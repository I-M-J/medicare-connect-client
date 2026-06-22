"use client";

import { useState, useEffect } from "react";
import { useSession, authClient } from "@/lib/auth-client";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { FileText, Loader2, Plus, Calendar, Search } from "lucide-react";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

export default function DoctorPrescriptionsPage() {
    const { data: session } = useSession();
    const [prescriptions, setPrescriptions] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAppt, setSelectedAppt] = useState(null);
    const [saving, setSaving] = useState(false);

    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    const fetchData = async () => {
        if (!session) return;
        setLoading(true);
        try {
            let tokenValue = "";
            try {
                const tokenRes = await authClient.token();
                tokenValue = tokenRes?.data?.token || "";
            } catch { tokenValue = session?.session?.token || ""; }

            const [prescRes, apptRes] = await Promise.all([
                fetch(`${SERVER_URL}/prescriptions?doctorEmail=${session.user.email}`, {
                    headers: { "Authorization": `Bearer ${tokenValue}` },
                }),
                fetch(`${SERVER_URL}/appointments/doctor`, {
                    headers: { "Authorization": `Bearer ${tokenValue}` },
                })
            ]);

            if (prescRes.ok) setPrescriptions(await prescRes.json());
            if (apptRes.ok) {
                // Only allow prescriptions for accepted/completed appointments
                const allAppts = await apptRes.json();
                setAppointments(allAppts.filter(a => a.appointmentStatus === 'accepted' || a.appointmentStatus === 'completed'));
            }
        }
        catch (err) {
            console.error("Error fetching data:", err);
        }
        finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [session]);

    const openModal = (appt = null) => {
        if (appt) {
            setSelectedAppt(appt);
            reset({
                appointmentId: appt._id,
                patientName: appt.patientName,
                diagnosis: appt.issue || "",
                medicines: "",
                instructions: ""
            });
        } else {
            setSelectedAppt(null);
            reset();
        }
        setIsModalOpen(true);
    };

    const onSubmit = async (data) => {
        setSaving(true);
        try {
            let tokenValue = "";
            try {
                const tokenRes = await authClient.token();
                tokenValue = tokenRes?.data?.token || "";
            } catch { tokenValue = session?.session?.token || ""; }

            const targetAppt = appointments.find(a => a._id === data.appointmentId);

            const payload = {
                ...data,
                patientEmail: targetAppt?.patientEmail,
                doctorEmail: session.user.email,
                doctorName: session.user.name,
                date: new Date().toISOString().split('T')[0]
            };

            const res = await fetch(`${SERVER_URL}/prescriptions`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${tokenValue}`
                },
                body: JSON.stringify(payload)
            });

            if (!res.ok) throw new Error("Failed to save prescription");
            
            toast.success("Prescription issued successfully");
            setIsModalOpen(false);
            fetchData();
        }
        catch (err) {
            toast.error(err.message || "Failed to save prescription");
        }
        finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-sky-500 animate-spin" /></div>;

    return (
        <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Prescriptions</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Issue and manage patient prescriptions</p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="flex items-center gap-2 px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-sm font-medium transition-colors shadow-sm"
                >
                    <Plus className="w-4 h-4" /> Issue New Prescription
                </button>
            </div>

            {prescriptions.length === 0 ? (
                <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                    <FileText className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                    <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-1">No prescriptions yet</h3>
                    <p className="text-sm text-gray-400">You haven&apos;t written any prescriptions.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    {prescriptions.map((presc, i) => (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            key={presc._id}
                            className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6"
                        >
                            <div className="flex items-start justify-between border-b border-gray-100 dark:border-gray-800 pb-4 mb-4">
                                <div>
                                    <h3 className="font-bold text-gray-900 dark:text-white text-lg">{presc.patientName}</h3>
                                    <p className="text-sm text-sky-600 dark:text-sky-400 font-medium mt-0.5">Diagnosis: {presc.diagnosis}</p>
                                </div>
                                <span className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded-full">
                                    <Calendar className="w-3.5 h-3.5" /> {presc.date}
                                </span>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Medicines</h4>
                                    <div className="bg-sky-50 dark:bg-sky-900/10 border border-sky-100 dark:border-sky-900/30 rounded-xl p-3">
                                        <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{presc.medicines}</p>
                                    </div>
                                </div>
                                
                                {presc.instructions && (
                                    <div>
                                        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Instructions</h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl border border-gray-100 dark:border-gray-800">
                                            {presc.instructions}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                            <h2 className="font-bold text-gray-900 dark:text-white">Issue Prescription</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">✕</button>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="p-6">
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Select Patient/Appointment</label>
                                    <select
                                        className="w-full px-4 py-2.5 rounded-xl text-sm border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-sky-400"
                                        {...register("appointmentId", { required: "Please select an appointment" })}
                                        onChange={(e) => {
                                            const appt = appointments.find(a => a._id === e.target.value);
                                            if (appt) {
                                                reset({ ...register(), patientName: appt.patientName, diagnosis: appt.issue });
                                            }
                                        }}
                                    >
                                        <option value="">Select an appointment...</option>
                                        {appointments.map(appt => (
                                            <option key={appt._id} value={appt._id}>
                                                {appt.patientName} - {appt.appointmentDate}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.appointmentId && <p className="text-xs text-red-500 mt-1">{errors.appointmentId.message}</p>}
                                </div>

                                <input type="hidden" {...register("patientName")} />

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Diagnosis / Reason</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Viral Fever"
                                        className="w-full px-4 py-2.5 rounded-xl text-sm border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-sky-400"
                                        {...register("diagnosis", { required: "Diagnosis is required" })}
                                    />
                                    {errors.diagnosis && <p className="text-xs text-red-500 mt-1">{errors.diagnosis.message}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Medicines</label>
                                    <textarea
                                        rows="4"
                                        placeholder="1. Paracetamol 500mg - 1-0-1 (After meals)&#10;2. Azithromycin 500mg - 1-0-0 (After breakfast)"
                                        className="w-full px-4 py-2.5 rounded-xl text-sm border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-sky-400 resize-none"
                                        {...register("medicines", { required: "Medicines are required" })}
                                    ></textarea>
                                    {errors.medicines && <p className="text-xs text-red-500 mt-1">{errors.medicines.message}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Additional Instructions</label>
                                    <textarea
                                        rows="2"
                                        placeholder="e.g. Drink plenty of water, rest for 3 days."
                                        className="w-full px-4 py-2.5 rounded-xl text-sm border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-sky-400 resize-none"
                                        {...register("instructions")}
                                    ></textarea>
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-sky-500 hover:bg-sky-600 disabled:bg-sky-300 text-white rounded-xl text-sm font-medium transition-colors shadow-sm"
                                >
                                    {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                                    Issue Prescription
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
