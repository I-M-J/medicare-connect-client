"use client";

import { useState, useEffect } from "react";
import { useSession, authClient } from "@/lib/auth-client";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { Loader2, RefreshCw, Users, Stethoscope, CalendarCheck, DollarSign, Star, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

const COLORS = ["#0ea5e9", "#10b981", "#f59e0b", "#ef4444", "#6366f1", "#8b5cf6"];

export default function AdminAnalyticsPage() {
    const { data: session } = useSession();
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchAnalytics = async () => {
        if (!session) return;
        setLoading(true);
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
                setAnalytics(data);
            } else {
                toast.error("Failed to load analytics");
            }
        }
        catch (err) {
            console.error("Error fetching analytics:", err);
            toast.error("Something went wrong");
        }
        finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnalytics();
    }, [session]);

    if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-sky-500 animate-spin" /></div>;
    if (!analytics) return <div className="text-center py-20 text-gray-500">Failed to load analytics.</div>;

    // Prep data for Doctor Performance Chart
    const docPerformanceData = (analytics.topDoctors || []).map(doc => ({
        name: doc.doctorName?.replace("Dr. ", "") || "Doc",
        rating: doc.averageRating || 0,
        reviews: doc.totalReviews || 0
    }));

    // Prep data for Appointment Status Chart
    const appointmentStatusData = (analytics.appointmentStats || []).map(stat => ({
        name: stat.status?.toUpperCase() || "UNKNOWN",
        value: stat.count || 0
    }));

    const cardStats = [
        { label: "Total Revenue", value: `$${(analytics.totalRevenue || 0).toLocaleString()}`, icon: DollarSign, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
        { label: "Total Doctors", value: analytics.totalDoctors, icon: Stethoscope, color: "text-sky-500", bg: "bg-sky-50 dark:bg-sky-900/20" },
        { label: "Total Patients", value: analytics.totalPatients, icon: Users, color: "text-indigo-500", bg: "bg-indigo-50 dark:bg-indigo-900/20" },
        { label: "Total Appointments", value: analytics.totalAppointments, icon: CalendarCheck, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-900/20" },
    ];

    return (
        <div>
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Analytics</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Real-time stats and provider performance insights</p>
                </div>
                <button 
                    onClick={fetchAnalytics} 
                    className="flex items-center gap-2 px-3 py-2 text-sm bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl transition-colors"
                >
                    <RefreshCw className="w-4 h-4 text-gray-500" />
                    Refresh
                </button>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                {cardStats.map((stat, i) => (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        key={i}
                        className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-4"
                    >
                        <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                            <stat.icon className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{stat.label}</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-0.5">{stat.value}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Doctor Performance */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                        <Star className="w-5 h-5 text-amber-500" />
                        Doctor Performance (Top Rated)
                    </h2>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={docPerformanceData} margin={{ top: 5, right: 30, left: -20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" className="dark:opacity-10" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                                <YAxis domain={[0, 5]} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                                <RechartsTooltip 
                                    cursor={{ fill: 'transparent' }}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="rating" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={35} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Appointment Status Pie */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-sky-500" />
                        Appointment Status Distribution
                    </h2>
                    <div className="h-72 flex flex-col justify-center">
                        {appointmentStatusData.length === 0 ? (
                            <p className="text-center text-gray-500 text-sm">No appointment data available.</p>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={appointmentStatusData}
                                        cx="50%"
                                        cy="45%"
                                        innerRadius={60}
                                        outerRadius={90}
                                        paddingAngle={4}
                                        dataKey="value"
                                    >
                                        {appointmentStatusData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <RechartsTooltip />
                                    <Legend verticalAlign="bottom" height={36} />
                                </PieChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>
            </div>

            {/* Top Doctors Details List */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Top Rated Providers</h2>
                <div className="space-y-4">
                    {(analytics.topDoctors || []).slice(0, 5).map((doc, i) => (
                        <div key={doc._id || i} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/40 rounded-xl border border-gray-100 dark:border-gray-800">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 flex items-center justify-center font-bold">
                                    {doc.doctorName?.charAt(0) || "D"}
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900 dark:text-white">{doc.doctorName}</p>
                                    <p className="text-xs text-gray-500 capitalize">{doc.specialization} &bull; {doc.experience} Yrs Experience</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1.5 bg-white dark:bg-gray-900 px-3 py-1.5 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                                <span className="font-bold text-sm text-gray-800 dark:text-gray-200">{doc.averageRating || 0}</span>
                                <span className="text-xs text-gray-400">({doc.totalReviews || 0} reviews)</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
