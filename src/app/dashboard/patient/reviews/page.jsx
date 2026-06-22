"use client";

import { useState, useEffect } from "react";
import { useSession, authClient } from "@/lib/auth-client";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { Star, MessageSquare, Loader2, RefreshCw } from "lucide-react";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

export default function PatientReviewsPage() {
    const { data: session } = useSession();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchReviews = async () => {
        if (!session) return;
        setLoading(true);
        try {
            const res = await fetch(`${SERVER_URL}/reviews?patientEmail=${session.user.email}`);
            if (res.ok) {
                const data = await res.json();
                setReviews(data);
            }
        }
        catch (err) {
            console.error("Error fetching reviews:", err);
        }
        finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
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
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Reviews</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Manage feedback you&apos;ve given to doctors</p>
                </div>
                <button onClick={fetchReviews} className="p-2 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all" title="Refresh">
                    <RefreshCw className="w-4 h-4 text-gray-500" />
                </button>
            </div>

            {reviews.length === 0 ? (
                <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                    <MessageSquare className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                    <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-1">No reviews yet</h3>
                    <p className="text-sm text-gray-400 dark:text-gray-500">You haven&apos;t reviewed any doctors yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {reviews.map((review, i) => (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            key={review._id}
                            className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm"
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, idx) => (
                                        <Star key={idx} className={`w-4 h-4 ${idx < review.rating ? "fill-amber-400 text-amber-400" : "text-gray-200 dark:text-gray-700"}`} />
                                    ))}
                                </div>
                                <span className="text-xs text-gray-400">
                                    {new Date(review.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">&quot;{review.comment}&quot;</p>
                            <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                                <span className="text-xs font-medium text-gray-500">For Doctor ID:</span>
                                <span className="text-xs font-mono text-gray-400">{review.doctorId.slice(-6)}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
