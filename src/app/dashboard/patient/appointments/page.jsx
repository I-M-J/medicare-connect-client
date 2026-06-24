"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, authClient } from "@/lib/auth-client";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { Calendar, Clock, Stethoscope, Loader2, XCircle, RefreshCw, AlertCircle } from "lucide-react";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

const STATUS_CONFIG = {
    pending: { label: "Pending", className: "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400" },
    accepted: { label: "Accepted", className: "bg-sky-50 dark:bg-sky-900/20 text-sky-600 dark:text-sky-400" },
    completed: { label: "Completed", className: "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400" },
    rejected: { label: "Rejected", className: "bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400" },
    cancelled: { label: "Cancelled", className: "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400" },
};

export default function PatientAppointmentsPage() {
    const { data: session } = useSession();
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cancellingId, setCancellingId] = useState(null);

    const fetchAppointments = async () => {
        setLoading(true);
        try {
            let tokenValue = "";
            try {
                const tokenRes = await authClient.token();
                tokenValue = tokenRes?.data?.token || tokenRes?.value || "";
            } catch { tokenValue = session?.session?.token || ""; }

            const res = await fetch(`${SERVER_URL}/appointments/patient`, {
                headers: { "Authorization": `Bearer ${tokenValue}` },
            });
            if (!res.ok) throw new Error("Failed to fetch");
            const data = await res.json();
            setAppointments(data);
        }
        catch (err) {
            console.error("Error:", err);
            setAppointments([]);
        }
        finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (session) fetchAppointments();
    }, [session]);

    const handleCancel = async (id) => {
        if (!confirm("Are you sure you want to cancel this appointment?")) return;
        setCancellingId(id);
        try {
            let tokenValue = "";
            try {
                const tokenRes = await authClient.token();
                tokenValue = tokenRes?.data?.token || "";
            } catch { tokenValue = session?.session?.token || ""; }

            const res = await fetch(`${SERVER_URL}/appointments/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${tokenValue}` },
            });
            if (!res.ok) throw new Error("Failed to cancel");
            toast.success("Appointment cancelled");
            setAppointments(prev => prev.filter(a => a._id !== id));
        }
        catch (err) {
            toast.error(err.message || "Failed to cancel appointment");
        }
        finally {
            setCancellingId(null);
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Appointments</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Track and manage all your bookings</p>
                </div>
                <button onClick={fetchAppointments} className="p-2 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all" title="Refresh">
                    <RefreshCw className="w-4 h-4 text-gray-500" />
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-8 h-8 text-sky-500 animate-spin" />
                </div>
            ) : appointments.length === 0 ? (
                <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
                    <AlertCircle className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                    <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-1">No appointments yet</h3>
                    <p className="text-sm text-gray-400 dark:text-gray-500">
                        <Link href="/find-doctors" className="text-sky-500 hover:underline">Find a doctor</Link> and book your first appointment.
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {appointments.map((appt, i) => {
                        const status = STATUS_CONFIG[appt.appointmentStatus] || STATUS_CONFIG.pending;
                        return (
                            <motion.div
                                key={appt._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-5 flex flex-col sm:flex-row sm:items-center gap-4"
                            >
                                <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-sky-100 dark:bg-sky-900/30">
                                    <img
                                        src={appt.doctorImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(appt.doctorName || "Dr")}&background=0ea5e9&color=fff`}
                                        alt={appt.doctorName}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2 flex-wrap">
                                        <div>
                                            <h3 className="font-bold text-gray-900 dark:text-white">Dr. {appt.doctorName}</h3>
                                            <p className="text-sky-600 dark:text-sky-400 text-sm">{appt.doctorSpecialization}</p>
                                        </div>
                                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${status.className}`}>
                                            {status.label}
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                                        <span className="flex items-center gap-1.5">
                                            <Calendar className="w-3.5 h-3.5" />
                                            {appt.appointmentDate}
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <Clock className="w-3.5 h-3.5" />
                                            {appt.appointmentTime}
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <Stethoscope className="w-3.5 h-3.5" />
                                            ${appt.consultationFee}
                                        </span>
                                    </div>
                                </div>

                                {appt.appointmentStatus === "pending" && (
                                    <button
                                        onClick={() => handleCancel(appt._id)}
                                        disabled={cancellingId === appt._id}
                                        className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl border border-red-200 dark:border-red-800 transition-all disabled:opacity-50"
                                    >
                                        {cancellingId === appt._id ? (
                                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                        ) : (
                                            <XCircle className="w-3.5 h-3.5" />
                                        )}
                                        Cancel
                                    </button>
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
