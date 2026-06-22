"use client";

import { useState, useEffect } from "react";
import { useSession, authClient } from "@/lib/auth-client";
import { motion } from "framer-motion";
import { Users, Calendar as CalendarIcon, DollarSign, Loader2, AlertTriangle } from "lucide-react";
import Link from "next/link";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

export default function DoctorDashboardPage() {
    const { data: session } = useSession();
    const [doctor, setDoctor] = useState(null);
    const [stats, setStats] = useState({ totalPatients: 0, todayAppointments: 0, revenue: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDoctorData = async () => {
            if (!session) return;
            try {
                let tokenValue = "";
                try {
                    const tokenRes = await authClient.token();
                    tokenValue = tokenRes?.data?.token || "";
                } catch { tokenValue = session?.session?.token || ""; }

                const res = await fetch(`${SERVER_URL}/doctors/my`, {
                    headers: { "Authorization": `Bearer ${tokenValue}` },
                });
                if (res.ok) {
                    const docData = await res.json();
                    setDoctor(docData);
                    
                    // fetch appointments for stats
                    const apptRes = await fetch(`${SERVER_URL}/appointments/doctor`, {
                        headers: { "Authorization": `Bearer ${tokenValue}` },
                    });
                    if (apptRes.ok) {
                        const appointments = await apptRes.json();
                        const today = new Date().toISOString().split('T')[0];
                        const todayAppts = appointments.filter(a => a.appointmentDate === today).length;
                        const uniquePatients = new Set(appointments.map(a => a.patientEmail)).size;
                        const rev = appointments.filter(a => a.paymentStatus === 'paid').reduce((sum, a) => sum + (a.consultationFee || 0), 0);
                        
                        setStats({ totalPatients: uniquePatients, todayAppointments: todayAppts, revenue: rev });
                    }
                }
            }
            catch (err) {
                console.error("Error fetching doctor data:", err);
            }
            finally {
                setLoading(false);
            }
        };

        fetchDoctorData();
    }, [session]);

    if (loading) {
        return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-sky-500 animate-spin" /></div>;
    }

    if (!doctor || Object.keys(doctor).length === 0) {
        return (
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-6 text-center">
                <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-amber-800 dark:text-amber-400">Profile Not Found</h3>
                <p className="text-amber-700 dark:text-amber-500 mt-2">You need to set up your professional profile first.</p>
                <Link href="/dashboard/doctor/profile" className="inline-block mt-4 px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-medium transition-colors">
                    Setup Profile
                </Link>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Welcome Dr. {doctor.doctorName}!
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                    Status: <span className={`font-semibold ${doctor.verificationStatus === 'verified' ? 'text-emerald-500' : 'text-amber-500'}`}>{doctor.verificationStatus?.toUpperCase() || 'PENDING'}</span>
                </p>
                {doctor.verificationStatus !== 'verified' && (
                    <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl text-sm text-amber-700 dark:text-amber-400 flex items-start gap-2">
                        <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                        <p>Your account is currently under review by an administrator. You may not appear in patient search results until verified.</p>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-sky-50 dark:bg-sky-900/20 text-sky-500 rounded-xl flex items-center justify-center">
                        <Users className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Total Patients</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalPatients}</p>
                    </div>
                </motion.div>
                
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 rounded-xl flex items-center justify-center">
                        <CalendarIcon className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Today&apos;s Appointments</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.todayAppointments}</p>
                    </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-violet-50 dark:bg-violet-900/20 text-violet-500 rounded-xl flex items-center justify-center">
                        <DollarSign className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Total Revenue</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">${stats.revenue}</p>
                    </div>
                </motion.div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Link href="/dashboard/doctor/appointments" className="p-4 border border-gray-100 dark:border-gray-800 rounded-xl hover:border-sky-200 dark:hover:border-sky-800 hover:bg-sky-50 dark:hover:bg-sky-900/10 transition-colors">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Manage Appointments</h3>
                        <p className="text-sm text-gray-500">View requests, accept, or reject</p>
                    </Link>
                    <Link href="/dashboard/doctor/prescriptions" className="p-4 border border-gray-100 dark:border-gray-800 rounded-xl hover:border-sky-200 dark:hover:border-sky-800 hover:bg-sky-50 dark:hover:bg-sky-900/10 transition-colors">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Write Prescriptions</h3>
                        <p className="text-sm text-gray-500">Issue prescriptions to patients</p>
                    </Link>
                    <Link href="/dashboard/doctor/profile" className="p-4 border border-gray-100 dark:border-gray-800 rounded-xl hover:border-sky-200 dark:hover:border-sky-800 hover:bg-sky-50 dark:hover:bg-sky-900/10 transition-colors">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Update Profile</h3>
                        <p className="text-sm text-gray-500">Edit your fee, slots, and bio</p>
                    </Link>
                </div>
            </div>
        </div>
    );
}
