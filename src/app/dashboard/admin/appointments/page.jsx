"use client";

import { useState, useEffect } from "react";
import { useSession, authClient } from "@/lib/auth-client";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { Calendar, Clock, User, Stethoscope, Search, Loader2, RefreshCw, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

const STATUS_CONFIG = {
    pending: { label: "Pending", className: "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50" },
    accepted: { label: "Accepted", className: "bg-sky-50 dark:bg-sky-900/20 text-sky-600 dark:text-sky-400 border border-sky-200 dark:border-sky-800/50" },
    completed: { label: "Completed", className: "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50" },
    rejected: { label: "Rejected", className: "bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 border border-red-200 dark:border-red-800/50" },
    cancelled: { label: "Cancelled", className: "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700" },
};

export default function AdminAppointmentsPage() {
    const { data: session } = useSession();
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    const fetchAppointments = async () => {
        if (!session) return;
        setLoading(true);
        try {
            let tokenValue = "";
            try {
                const tokenRes = await authClient.token();
                tokenValue = tokenRes?.data?.token || "";
            } catch { tokenValue = session?.session?.token || ""; }

            const res = await fetch(`${SERVER_URL}/appointments`, {
                headers: { "Authorization": `Bearer ${tokenValue}` },
            });
            if (res.ok) {
                const data = await res.json();
                setAppointments(data || []);
            } else {
                toast.error("Failed to load appointments");
            }
        }
        catch (err) {
            console.error("Error fetching appointments:", err);
            toast.error("Something went wrong");
        }
        finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, [session]);

    const filteredAppointments = appointments.filter(appt => {
        const matchesSearch = 
            appt.doctorName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
            appt.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            appt.patientEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            appt.doctorSpecialization?.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesStatus = statusFilter === "all" || appt.appointmentStatus === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const stats = {
        total: appointments.length,
        pending: appointments.filter(a => a.appointmentStatus === "pending").length,
        completed: appointments.filter(a => a.appointmentStatus === "completed").length,
        accepted: appointments.filter(a => a.appointmentStatus === "accepted").length,
    };

    if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-sky-500 animate-spin" /></div>;

    return (
        <div>
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Appointments</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Monitor all booking requests and logs</p>
                </div>
                <button 
                    onClick={fetchAppointments} 
                    className="flex items-center gap-2 px-3 py-2 text-sm bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl transition-colors"
                >
                    <RefreshCw className="w-4 h-4 text-gray-500" />
                    Refresh
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                    { label: "Total Bookings", value: stats.total, color: "text-sky-500", bg: "bg-sky-50 dark:bg-sky-900/20 border-sky-100 dark:border-sky-900/40" },
                    { label: "Pending Approvals", value: stats.pending, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-900/40" },
                    { label: "Active/Accepted", value: stats.accepted, color: "text-indigo-500", bg: "bg-indigo-50 dark:bg-indigo-900/20 border-indigo-100 dark:border-indigo-900/40" },
                    { label: "Completed", value: stats.completed, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-900/40" }
                ].map((stat, i) => (
                    <div key={i} className={`p-4 rounded-2xl border ${stat.bg} shadow-sm`}>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{stat.label}</p>
                        <p className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Filter and Search */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                {/* Search */}
                <div className="relative w-full md:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search doctor, patient or details..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 rounded-xl text-sm border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-sky-400"
                    />
                </div>

                {/* Status Tabs */}
                <div className="flex items-center gap-1 overflow-x-auto bg-gray-100 dark:bg-gray-800/50 p-1.5 rounded-xl border border-gray-200 dark:border-gray-800">
                    {["all", "pending", "accepted", "completed", "rejected", "cancelled"].map((status) => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-3 py-1.5 text-xs font-medium rounded-lg capitalize whitespace-nowrap transition-all ${
                                statusFilter === status
                                    ? "bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm"
                                    : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
                            }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 font-medium">
                            <tr>
                                <th className="px-6 py-4">Patient</th>
                                <th className="px-6 py-4">Doctor</th>
                                <th className="px-6 py-4">Appointment Details</th>
                                <th className="px-6 py-4">Fee</th>
                                <th className="px-6 py-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {filteredAppointments.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                        No appointments found.
                                    </td>
                                </tr>
                            ) : (
                                filteredAppointments.map((appt, i) => {
                                    const status = STATUS_CONFIG[appt.appointmentStatus] || STATUS_CONFIG.pending;
                                    return (
                                        <motion.tr
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.02 }}
                                            key={appt._id}
                                            className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-full bg-sky-50 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 flex items-center justify-center font-semibold text-sm">
                                                        {appt.patientName?.charAt(0) || "P"}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-gray-900 dark:text-white">{appt.patientName || "Patient"}</p>
                                                        <p className="text-xs text-gray-500">{appt.patientEmail}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <img 
                                                        src={appt.doctorImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(appt.doctorName || 'D')}&background=0ea5e9&color=fff`} 
                                                        alt={appt.doctorName} 
                                                        className="w-9 h-9 rounded-xl object-cover"
                                                    />
                                                    <div>
                                                        <p className="font-semibold text-gray-900 dark:text-white">Dr. {appt.doctorName}</p>
                                                        <p className="text-xs text-sky-600 dark:text-sky-400">{appt.doctorSpecialization}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                                                <div className="flex flex-col gap-1">
                                                    <span className="flex items-center gap-1.5 text-xs">
                                                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                                                        {appt.appointmentDate}
                                                    </span>
                                                    <span className="flex items-center gap-1.5 text-xs">
                                                        <Clock className="w-3.5 h-3.5 text-gray-400" />
                                                        {appt.appointmentTime}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="font-bold text-gray-900 dark:text-white">${appt.consultationFee}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${status.className}`}>
                                                    {status.label}
                                                </span>
                                            </td>
                                        </motion.tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
