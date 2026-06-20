"use client";

import { motion } from "framer-motion";
import { Users, Stethoscope, CalendarCheck, Star } from "lucide-react";

export default function PlatformStats({ stats }) {
    const statItems = [
        {
            icon: Stethoscope,
            value: stats?.totalDoctors ?? "500+",
            label: "Verified Doctors",
            color: "text-sky-500",
            bg: "bg-sky-50 dark:bg-sky-900/20",
        },
        {
            icon: Users,
            value: stats?.totalPatients ?? "10K+",
            label: "Total Patients",
            color: "text-emerald-500",
            bg: "bg-emerald-50 dark:bg-emerald-900/20",
        },
        {
            icon: CalendarCheck,
            value: stats?.totalAppointments ?? "50K+",
            label: "Appointments",
            color: "text-violet-500",
            bg: "bg-violet-50 dark:bg-violet-900/20",
        },
        {
            icon: Star,
            value: stats?.totalReviews ?? "8K+",
            label: "Patient Reviews",
            color: "text-amber-500",
            bg: "bg-amber-50 dark:bg-amber-900/20",
        },
    ];

    return (
        <section className="py-14 bg-white dark:bg-gray-950">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                    {statItems.map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1, duration: 0.5 }}
                            className="flex flex-col items-center text-center p-6 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className={`${item.bg} p-4 rounded-2xl mb-4`}>
                                <item.icon className={`w-7 h-7 ${item.color}`} />
                            </div>
                            <span className="text-3xl font-extrabold text-gray-900 dark:text-white mb-1">
                                {typeof item.value === "number" ? item.value.toLocaleString() + "+" : item.value}
                            </span>
                            <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">{item.label}</span>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
