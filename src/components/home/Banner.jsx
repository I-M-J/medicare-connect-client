"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CalendarCheck, ShieldCheck, Star } from "lucide-react";

export default function Banner() {
    return (
        <section className="relative overflow-hidden bg-linear-to-br from-sky-50 via-white to-cyan-50 dark:from-gray-950 dark:via-gray-900 dark:to-sky-950 py-20 lg:py-28">
            {/* Background decorative blobs */}
            <div className="absolute -top-32 -right-32 w-96 h-96 bg-sky-200 dark:bg-sky-900/30 rounded-full blur-3xl opacity-50 pointer-events-none" />
            <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-cyan-200 dark:bg-cyan-900/30 rounded-full blur-3xl opacity-40 pointer-events-none" />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Left Content */}
                    <div>
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300 rounded-full text-sm font-medium mb-6">
                                <ShieldCheck className="w-4 h-4" />
                                Trusted Healthcare Platform
                            </span>

                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight mb-5">
                                Your Health,{" "}
                                <span className="text-transparent bg-clip-text bg-linear-to-r from-sky-500 to-cyan-400">
                                    Our Priority
                                </span>
                            </h1>

                            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-8 max-w-xl">
                                Book appointments with verified specialists, manage prescriptions, and receive world-class care — all from one platform.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link
                                    href="/find-doctors"
                                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-sky-500 hover:bg-sky-600 text-white font-semibold rounded-xl shadow-lg shadow-sky-200 dark:shadow-sky-900/40 transition-all"
                                >
                                    <CalendarCheck className="w-5 h-5" />
                                    Book Appointment
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                                <Link
                                    href="/about"
                                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-semibold rounded-xl border border-gray-200 dark:border-gray-700 hover:border-sky-300 dark:hover:border-sky-600 transition-all"
                                >
                                    Learn More
                                </Link>
                            </div>

                            {/* Trust badges */}
                            <div className="flex items-center gap-6 mt-10">
                                <div className="flex -space-x-2">
                                    {["A", "B", "C", "D"].map((l, i) => (
                                        <div key={i} className="w-9 h-9 rounded-full border-2 border-white dark:border-gray-900 bg-sky-400 flex items-center justify-center text-white text-xs font-bold shadow">
                                            {l}
                                        </div>
                                    ))}
                                </div>
                                <div>
                                    <div className="flex items-center gap-1">
                                        {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                                    </div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Trusted by 10,000+ patients</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right — Animated Stats Card */}
                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className="relative"
                    >
                        <div className="relative bg-white dark:bg-gray-900 rounded-3xl shadow-2xl shadow-sky-100 dark:shadow-sky-900/20 p-8 border border-sky-100 dark:border-sky-900/30">
                            <div className="grid grid-cols-2 gap-5">
                                {[
                                    { label: "Verified Doctors", value: "500+", icon: "🩺", color: "bg-sky-50 dark:bg-sky-900/30" },
                                    { label: "Happy Patients", value: "10K+", icon: "❤️", color: "bg-rose-50 dark:bg-rose-900/20" },
                                    { label: "Specializations", value: "25+", icon: "🏥", color: "bg-emerald-50 dark:bg-emerald-900/20" },
                                    { label: "Success Rate", value: "98%", icon: "✅", color: "bg-amber-50 dark:bg-amber-900/20" },
                                ].map((item, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.4 + i * 0.1 }}
                                        className={`${item.color} rounded-2xl p-5 flex flex-col gap-2`}
                                    >
                                        <span className="text-2xl">{item.icon}</span>
                                        <span className="text-2xl font-bold text-gray-900 dark:text-white">{item.value}</span>
                                        <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">{item.label}</span>
                                    </motion.div>
                                ))}
                            </div>

                            <div className="mt-5 p-4 bg-sky-500 rounded-2xl flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                                    <CalendarCheck className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-white font-semibold text-sm">Next available slot</p>
                                    <p className="text-sky-100 text-xs">Today · 2:30 PM with Dr. Rahman</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
