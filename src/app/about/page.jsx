"use client";

import { motion } from "framer-motion";
import { Users, Shield, Award, HeartPulse, Building, Phone } from "lucide-react";
import Image from "next/image";

export default function AboutPage() {
    return (
        <div className="min-h-screen pt-24 pb-16 bg-gray-50 dark:bg-gray-950">
            {/* Hero Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 text-center">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                        Revolutionizing Healthcare Access
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                        MediCare Connect bridges the gap between patients and top-tier medical professionals. We believe that finding the right doctor should be simple, transparent, and immediate.
                    </p>
                </motion.div>
            </section>

            {/* Stats */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {[
                        { label: "Happy Patients", value: "50k+", icon: Users },
                        { label: "Verified Doctors", value: "2,500+", icon: Shield },
                        { label: "Consultations", value: "100k+", icon: HeartPulse },
                        { label: "Awards Won", value: "15+", icon: Award }
                    ].map((stat, i) => (
                        <motion.div 
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white dark:bg-gray-900 p-8 rounded-3xl text-center shadow-sm border border-gray-100 dark:border-gray-800"
                        >
                            <div className="w-12 h-12 bg-sky-50 dark:bg-sky-900/20 text-sky-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{stat.label}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="bg-white dark:bg-gray-900 py-24 border-y border-gray-100 dark:border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                            <div className="w-16 h-16 bg-sky-50 dark:bg-sky-900/20 text-sky-500 rounded-2xl flex items-center justify-center mb-6">
                                <Building className="w-8 h-8" />
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Our Mission</h2>
                            <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                                To democratize access to quality healthcare by building a seamless digital ecosystem where patients can instantly connect, consult, and manage their health journey with verified medical professionals worldwide.
                            </p>
                            <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800">
                                <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 rounded-full flex items-center justify-center">
                                    <Phone className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Need immediate assistance?</p>
                                    <p className="font-bold text-gray-900 dark:text-white">1-800-MEDICARE</p>
                                </div>
                            </div>
                        </motion.div>
                        <motion.div 
                            initial={{ opacity: 0, x: 20 }} 
                            whileInView={{ opacity: 1, x: 0 }} 
                            viewport={{ once: true }}
                            className="relative"
                        >
                            <div className="aspect-[4/3] rounded-3xl overflow-hidden bg-gray-200 dark:bg-gray-800 relative">
                                <Image src="https://images.unsplash.com/photo-1538108149393-cecf8dac44df?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" alt="Medical Team" fill className="object-cover" />
                            </div>
                            <div className="absolute -bottom-6 -left-6 bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 hidden md:block">
                                <div className="flex -space-x-4">
                                    {[1,2,3,4].map(i => (
                                        <img key={i} src={`https://i.pravatar.cc/100?img=${i+10}`} alt="Doctor" className="w-12 h-12 rounded-full border-2 border-white dark:border-gray-900" />
                                    ))}
                                    <div className="w-12 h-12 rounded-full border-2 border-white dark:border-gray-900 bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xs font-bold text-gray-500">+2k</div>
                                </div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white mt-3">Trusted by Doctors globally</p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    );
}
