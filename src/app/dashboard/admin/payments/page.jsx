"use client";

import { useState, useEffect } from "react";
import { useSession, authClient } from "@/lib/auth-client";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { CreditCard, Calendar, Search, Loader2, RefreshCw, CheckCircle2, DollarSign, FileSpreadsheet, ArrowUpRight } from "lucide-react";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

export default function AdminPaymentsPage() {
    const { data: session } = useSession();
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchPayments = async () => {
        if (!session) return;
        setLoading(true);
        try {
            let tokenValue = "";
            try {
                const tokenRes = await authClient.token();
                tokenValue = tokenRes?.data?.token || "";
            } catch { tokenValue = session?.session?.token || ""; }

            const res = await fetch(`${SERVER_URL}/payments`, {
                headers: { "Authorization": `Bearer ${tokenValue}` },
            });
            if (res.ok) {
                const data = await res.json();
                setPayments(data || []);
            } else {
                toast.error("Failed to load payments");
            }
        }
        catch (err) {
            console.error("Error fetching payments:", err);
            toast.error("Something went wrong");
        }
        finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPayments();
    }, [session]);

    const filteredPayments = payments.filter(pay => 
        pay.patientEmail?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        pay.doctorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pay.transactionId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pay.paymentIntentId?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Compute stats
    const totalRevenue = payments.reduce((sum, p) => sum + (p.amount || p.consultationFee || 0), 0);
    const totalTransactions = payments.length;
    const avgAmount = totalTransactions > 0 ? (totalRevenue / totalTransactions).toFixed(2) : 0;

    if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-sky-500 animate-spin" /></div>;

    return (
        <div>
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Payment Management</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Monitor and review all transaction records</p>
                </div>
                <button 
                    onClick={fetchPayments} 
                    className="flex items-center gap-2 px-3 py-2 text-sm bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl transition-colors"
                >
                    <RefreshCw className="w-4 h-4 text-gray-500" />
                    Refresh
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                {[
                    { label: "Total Revenue", value: `$${totalRevenue.toLocaleString()}`, icon: DollarSign, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-900/40" },
                    { label: "Total Transactions", value: totalTransactions, icon: CreditCard, color: "text-sky-500", bg: "bg-sky-50 dark:bg-sky-900/20 border-sky-100 dark:border-sky-900/40" },
                    { label: "Average Transaction", value: `$${avgAmount}`, icon: ArrowUpRight, color: "text-violet-500", bg: "bg-violet-50 dark:bg-violet-900/20 border-violet-100 dark:border-violet-900/40" }
                ].map((stat, i) => (
                    <div key={i} className={`p-6 rounded-2xl border ${stat.bg} shadow-sm flex items-center gap-4`}>
                        <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-xl flex items-center justify-center shadow-sm">
                            <stat.icon className={`w-6 h-6 ${stat.color}`} />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{stat.label}</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-0.5">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filter and Search */}
            <div className="flex items-center gap-4 mb-6">
                <div className="relative w-full md:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search email, doctor or transaction..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 rounded-xl text-sm border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-sky-400"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 font-medium">
                            <tr>
                                <th className="px-6 py-4">Transaction ID</th>
                                <th className="px-6 py-4">Patient Email</th>
                                <th className="px-6 py-4">Doctor Name</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {filteredPayments.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                                        No payments found.
                                    </td>
                                </tr>
                            ) : (
                                filteredPayments.map((pay, i) => (
                                    <motion.tr
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.02 }}
                                        key={pay._id || i}
                                        className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                                    >
                                        <td className="px-6 py-4 font-mono text-xs text-gray-500 dark:text-gray-400">
                                            {pay.transactionId || pay.paymentIntentId || "N/A"}
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                                            {pay.patientEmail || "N/A"}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                                            Dr. {pay.doctorName || "Doctor"}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                                            <div className="flex items-center gap-1.5">
                                                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                                                {new Date(pay.paymentDate || new Date()).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center gap-1 text-xs bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 px-2.5 py-1 rounded-full font-medium">
                                                <CheckCircle2 className="w-3.5 h-3.5" />
                                                Paid
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="font-bold text-gray-900 dark:text-white">
                                                ${pay.amount || pay.consultationFee || 0}
                                            </span>
                                        </td>
                                    </motion.tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
