"use client";

import { useState, useEffect } from "react";
import { useSession, authClient } from "@/lib/auth-client";
import { motion } from "framer-motion";
import { Users, Stethoscope, CalendarCheck, DollarSign, Loader2 } from "lucide-react";
import Link from "next/link";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

export default function AdminDashboardPage() {
    const { data: session } = useSession();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            if (!session) return;
            try {
                let tokenValue = "";
                try {
                    const tokenRes = await authClient.token();
                    tokenValue = tokenRes?.data?.token || "";
                } catch { tokenValue = session?.session?.token || ""; }

                const res = await fetch(`${SERVER_URL}/admin/analytics`, {
                    headers: { "Authorization": `Bearer ${tokenValue}` },
                });
                
                if (res.ok) {
                    const data = await res.json();
                    setStats(data);
                }
            }
            catch (err) {
                console.error("Error fetching admin stats:", err);
            }
            finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [session]);

    if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-sky-500 animate-spin" /></div>;
    if (!stats) return <div className="text-center py-20 text-gray-500">Failed to load statistics.</div>;

    const statCards = [
        { title: "Total Users", value: stats.totalPatients + stats.totalDoctors, icon: Users, color: "text-sky-500", bg: "bg-sky-50 dark:bg-sky-900/20" },
        { title: "Verified Doctors", value: stats.verifiedDoctors, icon: Stethoscope, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
        { title: "Total Appointments", value: stats.totalAppointments, icon: CalendarCheck, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-900/20" },
        { title: "Total Revenue", value: `$${stats.totalRevenue}`, icon: DollarSign, color: "text-violet-500", bg: "bg-violet-50 dark:bg-violet-900/20" },
    ];

    // Format data for chart
    const chartData = [
        { name: "Verified Doctors", count: stats.verifiedDoctors },
        { name: "Pending Doctors", count: stats.pendingDoctors },
        { name: "Patients", count: stats.totalPatients },
    ];

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Overview</h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Platform statistics and quick management</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statCards.map((card, i) => (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        key={i}
                        className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-4"
                    >
                        <div className={`w-12 h-12 ${card.bg} ${card.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                            <card.icon className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{card.title}</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{card.value}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Chart Section */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">User Distribution</h2>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} margin={{ top: 5, right: 30, left: -20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" className="dark:opacity-20" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                                <RechartsTooltip 
                                    cursor={{ fill: 'transparent' }}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="count" fill="#0ea5e9" radius={[4, 4, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Quick Links Section */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Management Links</h2>
                    <div className="space-y-3">
                        <Link href="/dashboard/admin/users" className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 hover:bg-sky-50 dark:hover:bg-sky-900/20 rounded-xl border border-gray-100 dark:border-gray-800 transition-colors group">
                            <div className="flex items-center gap-3">
                                <Users className="w-5 h-5 text-gray-400 group-hover:text-sky-500" />
                                <span className="font-medium text-gray-700 dark:text-gray-300 group-hover:text-sky-600 dark:group-hover:text-sky-400">Manage Patients</span>
                            </div>
                            <span className="text-xs bg-white dark:bg-gray-900 px-2 py-1 rounded-md shadow-sm border border-gray-100 dark:border-gray-700">View All</span>
                        </Link>
                        <Link href="/dashboard/admin/doctors" className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-xl border border-gray-100 dark:border-gray-800 transition-colors group">
                            <div className="flex items-center gap-3">
                                <Stethoscope className="w-5 h-5 text-gray-400 group-hover:text-emerald-500" />
                                <span className="font-medium text-gray-700 dark:text-gray-300 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">Verify Doctors</span>
                            </div>
                            <div className="flex items-center gap-2">
                                {stats.pendingDoctors > 0 && (
                                    <span className="text-xs font-bold bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400 px-2 py-0.5 rounded-full">
                                        {stats.pendingDoctors} pending
                                    </span>
                                )}
                                <span className="text-xs bg-white dark:bg-gray-900 px-2 py-1 rounded-md shadow-sm border border-gray-100 dark:border-gray-700">Review</span>
                            </div>
                        </Link>
                        <Link href="/dashboard/admin/appointments" className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-xl border border-gray-100 dark:border-gray-800 transition-colors group">
                            <div className="flex items-center gap-3">
                                <CalendarCheck className="w-5 h-5 text-gray-400 group-hover:text-amber-500" />
                                <span className="font-medium text-gray-700 dark:text-gray-300 group-hover:text-amber-600 dark:group-hover:text-amber-400">Monitor Appointments</span>
                            </div>
                            <span className="text-xs bg-white dark:bg-gray-900 px-2 py-1 rounded-md shadow-sm border border-gray-100 dark:border-gray-700">View Logs</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
