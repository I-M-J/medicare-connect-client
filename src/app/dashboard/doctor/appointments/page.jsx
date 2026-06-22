"use client";

import { useState, useEffect } from "react";
import { useSession, authClient } from "@/lib/auth-client";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { Calendar, Clock, Loader2, CheckCircle2, XCircle, FileWarning, Search } from "lucide-react";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

const STATUS_COLORS = {
    pending: "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400 border-amber-200 dark:border-amber-800",
    accepted: "bg-sky-50 text-sky-600 dark:bg-sky-900/20 dark:text-sky-400 border-sky-200 dark:border-sky-800",
    completed: "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
    rejected: "bg-red-50 text-red-500 dark:bg-red-900/20 dark:text-red-400 border-red-200 dark:border-red-800",
    cancelled: "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-700",
};

export default function DoctorAppointmentsPage() {
    const { data: session } = useSession();
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionId, setActionId] = useState(null);

    const fetchAppointments = async () => {
        if (!session) return;
        setLoading(true);
        try {
            let tokenValue = "";
            try {
                const tokenRes = await authClient.token();
                tokenValue = tokenRes?.data?.token || "";
            } catch { tokenValue = session?.session?.token || ""; }

            const res = await fetch(`${SERVER_URL}/appointments/doctor`, {
                headers: { "Authorization": `Bearer ${tokenValue}` },
            });
            if (res.ok) {
                const data = await res.json();
                setAppointments(data);
            }
        }
        catch (err) {
            console.error("Error:", err);
        }
        finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, [session]);

    const handleStatusUpdate = async (id, status) => {
        setActionId(id);
        try {
            let tokenValue = "";
            try {
                const tokenRes = await authClient.token();
                tokenValue = tokenRes?.data?.token || "";
            } catch { tokenValue = session?.session?.token || ""; }

            const res = await fetch(`${SERVER_URL}/appointments/${id}/status`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${tokenValue}`
                },
                body: JSON.stringify({ appointmentStatus: status })
            });

            if (!res.ok) throw new Error("Failed to update status");
            
            toast.success(`Appointment ${status} successfully`);
            setAppointments(prev => prev.map(a => a._id === id ? { ...a, appointmentStatus: status } : a));
        }
        catch (err) {
            toast.error(err.message || "Something went wrong");
        }
        finally {
            setActionId(null);
        }
    };

    if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-sky-500 animate-spin" /></div>;

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Appointment Requests</h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Manage your patient appointments</p>
            </div>

            {appointments.length === 0 ? (
                <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
                    <Search className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                    <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-1">No appointments yet</h3>
                    <p className="text-sm text-gray-400">You don&apos;t have any appointment requests right now.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {appointments.map((appt, i) => (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.05 }}
                            key={appt._id}
                            className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden flex flex-col"
                        >
                            <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex-1">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="font-bold text-gray-900 dark:text-white text-lg">{appt.patientName}</h3>
                                        <p className="text-xs text-gray-500">{appt.patientPhone}</p>
                                    </div>
                                    <span className={`text-xs px-2.5 py-1 rounded-full border font-medium uppercase ${STATUS_COLORS[appt.appointmentStatus] || STATUS_COLORS.pending}`}>
                                        {appt.appointmentStatus}
                                    </span>
                                </div>

                                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                                    <p className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-sky-500" /> {appt.appointmentDate}
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-sky-500" /> {appt.appointmentTime}
                                    </p>
                                    {appt.issue && (
                                        <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-800">
                                            <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1.5">
                                                <FileWarning className="w-3.5 h-3.5" /> Issue / Symptoms
                                            </p>
                                            <p className="text-xs">{appt.issue}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 flex gap-2">
                                {appt.appointmentStatus === 'pending' && (
                                    <>
                                        <button
                                            onClick={() => handleStatusUpdate(appt._id, 'accepted')}
                                            disabled={actionId === appt._id}
                                            className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
                                        >
                                            <CheckCircle2 className="w-4 h-4" /> Accept
                                        </button>
                                        <button
                                            onClick={() => handleStatusUpdate(appt._id, 'rejected')}
                                            disabled={actionId === appt._id}
                                            className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
                                        >
                                            <XCircle className="w-4 h-4" /> Reject
                                        </button>
                                    </>
                                )}
                                {appt.appointmentStatus === 'accepted' && (
                                    <button
                                        onClick={() => handleStatusUpdate(appt._id, 'completed')}
                                        disabled={actionId === appt._id}
                                        className="w-full flex items-center justify-center gap-1.5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
                                    >
                                        <CheckCircle2 className="w-4 h-4" /> Mark as Completed
                                    </button>
                                )}
                                {(appt.appointmentStatus === 'completed' || appt.appointmentStatus === 'rejected' || appt.appointmentStatus === 'cancelled') && (
                                    <p className="text-center w-full text-sm text-gray-500 font-medium py-2">
                                        No further actions available
                                    </p>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
