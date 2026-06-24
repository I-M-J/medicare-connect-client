"use client";

import { useSession } from "@/lib/auth-client";
import { motion } from "framer-motion";
import Link from "next/link";
import { CalendarCheck, CreditCard, Star, User, ArrowRight } from "lucide-react";

export default function PatientDashboardPage() {
    const { data: session, isPending } = useSession();

    if (isPending) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const quickActions = [
        { href: "/find-doctors", label: "Book Appointment", icon: CalendarCheck, color: "bg-sky-50 dark:bg-sky-900/20 text-sky-600 dark:text-sky-400" },
        { href: "/dashboard/patient/appointments", label: "View Appointments", icon: CalendarCheck, color: "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400" },
        { href: "/dashboard/patient/payment-history", label: "Payment History", icon: CreditCard, color: "bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400" },
        { href: "/dashboard/patient/reviews", label: "My Reviews", icon: Star, color: "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400" },
    ];

    return (
        <div>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Welcome back, {session?.user?.name?.split(" ")[0] || "Patient"}! 👋
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Here&apos;s your health summary</p>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {quickActions.map((action, i) => (
                        <Link
                            key={i}
                            href={action.href}
                            className="group flex items-center gap-3 p-4 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md hover:border-sky-200 dark:hover:border-sky-700 transition-all"
                        >
                            <div className={`p-3 rounded-xl ${action.color}`}>
                                <action.icon className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <span className="text-sm font-semibold text-gray-800 dark:text-white block">{action.label}</span>
                            </div>
                            <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-sky-400 transition-colors flex-shrink-0" />
                        </Link>
                    ))}
                </div>

                {/* Profile Card */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6">
                    <h2 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <User className="w-5 h-5 text-sky-500" />
                        Account Overview
                    </h2>
                    <div className="flex items-center gap-4">
                        {session?.user?.image ? (
                            <img src={session.user.image} alt={session.user.name} className="w-16 h-16 rounded-2xl object-cover" referrerPolicy="no-referrer" />
                        ) : (
                            <div className="w-16 h-16 rounded-2xl bg-sky-500 flex items-center justify-center text-white text-2xl font-bold">
                                {session?.user?.name?.[0]?.toUpperCase() || "P"}
                            </div>
                        )}
                        <div>
                            <p className="font-bold text-gray-900 dark:text-white text-lg">{session?.user?.name}</p>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">{session?.user?.email}</p>
                            <span className="inline-flex items-center gap-1 text-xs bg-sky-50 dark:bg-sky-900/20 text-sky-600 dark:text-sky-400 px-2.5 py-0.5 rounded-full font-medium mt-1 capitalize">
                                Patient Account
                            </span>
                        </div>
                    </div>
                </div>

                {/* Become a Doctor CTA */}
                <div className="mt-8 bg-gradient-to-br from-sky-500 to-cyan-400 rounded-2xl p-8 text-white shadow-lg shadow-sky-500/20 relative overflow-hidden">
                    <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
                    <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
                        <div>
                            <h2 className="text-xl font-bold mb-2">Are you a Medical Professional?</h2>
                            <p className="text-sky-50 max-w-lg text-sm">
                                Join our platform to manage your appointments, write prescriptions, and reach more patients easily.
                            </p>
                        </div>
                        <Link
                            href="/dashboard/doctor/profile"
                            className="whitespace-nowrap px-6 py-3 bg-white text-sky-600 font-bold rounded-xl shadow-sm hover:bg-sky-50 hover:scale-105 transition-all"
                        >
                            Apply as a Doctor
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
