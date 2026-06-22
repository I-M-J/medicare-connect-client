"use client";

import { useState, useEffect } from "react";
import { useSession, authClient } from "@/lib/auth-client";
import { motion } from "framer-motion";
import { CreditCard, Calendar, Clock, Loader2, FileText, CheckCircle2 } from "lucide-react";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

export default function PatientPaymentHistoryPage() {
    const { data: session } = useSession();
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
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
                    setPayments(data);
                }
            }
            catch (err) {
                console.error("Error fetching payments:", err);
            }
            finally {
                setLoading(false);
            }
        };

        fetchPayments();
    }, [session]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 text-sky-500 animate-spin" />
            </div>
        );
    }

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Payment History</h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Review all your past transactions</p>
            </div>

            {payments.length === 0 ? (
                <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                    <FileText className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                    <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-1">No payments found</h3>
                    <p className="text-sm text-gray-400 dark:text-gray-500">You haven&apos;t made any payments yet.</p>
                </div>
            ) : (
                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 font-medium">
                                <tr>
                                    <th className="px-6 py-4">Transaction Details</th>
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                {payments.map((payment, i) => (
                                    <motion.tr
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        key={payment._id || i}
                                        className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-sky-50 dark:bg-sky-900/20 text-sky-500 rounded-lg">
                                                    <CreditCard className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900 dark:text-white">Consultation Fee</p>
                                                    <p className="text-xs text-gray-500">Dr. {payment.doctorName || "Doctor"}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                                            <div className="flex items-center gap-1.5">
                                                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                                                {new Date(payment.paymentDate || new Date()).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center gap-1 text-xs bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 px-2.5 py-1 rounded-full font-medium">
                                                <CheckCircle2 className="w-3.5 h-3.5" />
                                                Paid
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="font-bold text-gray-900 dark:text-white">${payment.amount || payment.consultationFee || 0}</span>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
