"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import DoctorCard from "@/components/doctors/DoctorCard";
import { Search, SlidersHorizontal, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

const SPECIALIZATIONS = [
    "All", "Cardiology", "Neurology", "Orthopedics", "Pediatrics",
    "Dermatology", "Ophthalmology", "Gynecology", "Psychiatry",
    "Radiology", "General Medicine", "Oncology",
];

const SORT_OPTIONS = [
    { label: "Default", value: "" },
    { label: "Fee: Low to High", value: "fee_asc" },
    { label: "Fee: High to Low", value: "fee_desc" },
    { label: "Most Experienced", value: "experience" },
    { label: "Highest Rated", value: "rating" },
];

const LIMIT = 9;

export default function FindDoctorsClient() {
    const searchParams = useSearchParams();
    const initSpec = searchParams.get("specialization") || "";

    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [specialization, setSpecialization] = useState(initSpec);
    const [sortBy, setSortBy] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);

    const fetchDoctors = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (search) params.append("search", search);
            if (specialization && specialization !== "All") params.append("specialization", specialization);
            if (sortBy) params.append("sortBy", sortBy);
            params.append("page", page);
            params.append("limit", LIMIT);

            const res = await fetch(`${SERVER_URL}/doctors?${params.toString()}`);
            if (!res.ok) throw new Error("Failed to fetch");
            const data = await res.json();
            setDoctors(data.doctors || []);
            setTotal(data.total || 0);
            setTotalPages(data.totalPages || 1);
        }
        catch (error) {
            console.error("Error fetching doctors:", error);
            setDoctors([]);
        }
        finally {
            setLoading(false);
        }
    }, [search, specialization, sortBy, page]);

    useEffect(() => {
        const timeout = setTimeout(fetchDoctors, 300);
        return () => clearTimeout(timeout);
    }, [fetchDoctors]);

    // reset to page 1 on filter change
    useEffect(() => {
        setPage(1);
    }, [search, specialization, sortBy]);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Find a Doctor</h1>
                    <p className="text-gray-500 dark:text-gray-400">
                        Search from {total > 0 ? total.toLocaleString() : "our"} verified healthcare professionals
                    </p>
                </div>

                {/* Filters */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-5 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by doctor name..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 rounded-xl text-sm border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-400 transition"
                            />
                        </div>

                        {/* Specialization */}
                        <div className="relative">
                            <SlidersHorizontal className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <select
                                value={specialization}
                                onChange={(e) => setSpecialization(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 rounded-xl text-sm border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-400 transition appearance-none"
                            >
                                {SPECIALIZATIONS.map((s) => (
                                    <option key={s} value={s === "All" ? "" : s}>{s}</option>
                                ))}
                            </select>
                        </div>

                        {/* Sort */}
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl text-sm border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-400 transition appearance-none"
                        >
                            {SORT_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Results */}
                {loading ? (
                    <div className="flex justify-center items-center py-24">
                        <Loader2 className="w-10 h-10 text-sky-500 animate-spin" />
                    </div>
                ) : doctors.length === 0 ? (
                    <div className="text-center py-24 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
                        <div className="text-5xl mb-4">🩺</div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No doctors found</h3>
                        <p className="text-gray-500 dark:text-gray-400">Try adjusting your search or filters</p>
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
                    >
                        {doctors.map((doctor) => (
                            <motion.div
                                key={doctor._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <DoctorCard doctor={doctor} />
                            </motion.div>
                        ))}
                    </motion.div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-10">
                        <button
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="p-2 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-sky-50 dark:hover:bg-sky-900/20 disabled:opacity-40 transition-all"
                        >
                            <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        </button>

                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            const pageNum = i + 1;
                            return (
                                <button
                                    key={pageNum}
                                    onClick={() => setPage(pageNum)}
                                    className={`w-9 h-9 rounded-xl text-sm font-medium border transition-all ${page === pageNum ? "bg-sky-500 text-white border-sky-500" : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-sky-50 dark:hover:bg-sky-900/20"}`}
                                >
                                    {pageNum}
                                </button>
                            );
                        })}

                        <button
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            className="p-2 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-sky-50 dark:hover:bg-sky-900/20 disabled:opacity-40 transition-all"
                        >
                            <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
