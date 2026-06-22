"use client";

import { useState, useEffect } from "react";
import { useSession, authClient } from "@/lib/auth-client";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Search, Loader2, ShieldCheck, Mail, AlertTriangle } from "lucide-react";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

export default function AdminDoctorsPage() {
    const { data: session } = useSession();
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionId, setActionId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchDoctors = async () => {
        if (!session) return;
        setLoading(true);
        try {
            // we reuse the search API without limits to get all doctors for admin
            const res = await fetch(`${SERVER_URL}/doctors?limit=1000`);
            if (res.ok) {
                const data = await res.json();
                setDoctors(data.doctors || []);
            }
        }
        catch (err) {
            console.error("Error fetching doctors:", err);
        }
        finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDoctors();
    }, [session]);

    const handleVerify = async (id, status) => {
        setActionId(id);
        try {
            let tokenValue = "";
            try {
                const tokenRes = await authClient.token();
                tokenValue = tokenRes?.data?.token || "";
            } catch { tokenValue = session?.session?.token || ""; }

            const res = await fetch(`${SERVER_URL}/doctors/${id}/verify`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${tokenValue}`
                },
                body: JSON.stringify({ verificationStatus: status })
            });

            if (!res.ok) throw new Error("Failed to update status");
            
            toast.success(`Doctor marked as ${status}`);
            setDoctors(prev => prev.map(d => d._id === id ? { ...d, verificationStatus: status } : d));
        }
        catch (err) {
            toast.error(err.message || "Something went wrong");
        }
        finally {
            setActionId(null);
        }
    };

    const filteredDoctors = doctors.filter(doc => 
        doc.doctorName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        doc.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.specialization?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-sky-500 animate-spin" /></div>;

    return (
        <div>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Verify Doctors</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Review and approve doctor registrations</p>
                </div>
                
                <div className="relative w-full md:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search doctors..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 rounded-xl text-sm border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-sky-400"
                    />
                </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 font-medium">
                            <tr>
                                <th className="px-6 py-4">Doctor Info</th>
                                <th className="px-6 py-4">Specialization</th>
                                <th className="px-6 py-4">Experience</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {filteredDoctors.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                        No doctors found matching your criteria.
                                    </td>
                                </tr>
                            ) : (
                                filteredDoctors.map((doc, i) => (
                                    <motion.tr
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.02 }}
                                        key={doc._id}
                                        className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 flex items-center justify-center font-bold">
                                                    {doc.doctorName?.charAt(0) || "D"}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-900 dark:text-white flex items-center gap-1">
                                                        {doc.doctorName}
                                                        {doc.verificationStatus === 'verified' && <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />}
                                                    </p>
                                                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                                                        <Mail className="w-3 h-3" /> {doc.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                                            {doc.specialization}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                                            {doc.experience} Years
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${
                                                doc.verificationStatus === 'verified' ? 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/50' : 
                                                doc.verificationStatus === 'rejected' ? 'bg-red-50 text-red-600 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800/50' :
                                                'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800/50'
                                            }`}>
                                                {doc.verificationStatus === 'verified' ? <CheckCircle2 className="w-3.5 h-3.5" /> : 
                                                 doc.verificationStatus === 'rejected' ? <XCircle className="w-3.5 h-3.5" /> : 
                                                 <AlertTriangle className="w-3.5 h-3.5" />}
                                                {doc.verificationStatus || 'pending'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                {doc.verificationStatus !== 'verified' && (
                                                    <button
                                                        onClick={() => handleVerify(doc._id, 'verified')}
                                                        disabled={actionId === doc._id}
                                                        className="px-3 py-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:hover:bg-emerald-900/40 rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
                                                    >
                                                        Approve
                                                    </button>
                                                )}
                                                {doc.verificationStatus !== 'rejected' && (
                                                    <button
                                                        onClick={() => handleVerify(doc._id, 'rejected')}
                                                        disabled={actionId === doc._id}
                                                        className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40 rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
                                                    >
                                                        Reject
                                                    </button>
                                                )}
                                            </div>
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
