"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star, MapPin, Clock, Award, ChevronLeft, Stethoscope, GraduationCap } from "lucide-react";
import BookingModal from "@/components/doctors/BookingModal";

export default function DoctorDetailClient({ doctor, reviews }) {
    const [activeTab, setActiveTab] = useState("overview");
    const rating = doctor.averageRating ?? 0;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back */}
                <Link href="/find-doctors" className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-sky-600 dark:hover:text-sky-400 mb-6 transition-colors">
                    <ChevronLeft className="w-4 h-4" />
                    Back to Doctors
                </Link>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                    {/* Profile Card */}
                    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6 lg:p-8 mb-6">
                        <div className="flex flex-col sm:flex-row gap-6">
                            <div className="w-28 h-28 rounded-2xl overflow-hidden flex-shrink-0 bg-sky-100 dark:bg-sky-900/30">
                                <img
                                    src={doctor.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.doctorName || "Dr")}&background=0ea5e9&color=fff&size=128`}
                                    alt={doctor.doctorName}
                                    className="w-full h-full object-cover"
                                    referrerPolicy="no-referrer"
                                />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-start justify-between flex-wrap gap-3">
                                    <div>
                                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                            Dr. {doctor.doctorName}
                                        </h1>
                                        <p className="text-sky-600 dark:text-sky-400 font-medium mt-0.5">{doctor.specialization}</p>
                                        {doctor.verificationStatus === "verified" && (
                                            <span className="inline-flex items-center gap-1.5 text-xs bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-full mt-2 font-medium">
                                                <Award className="w-3.5 h-3.5" /> Verified Doctor
                                            </span>
                                        )}
                                    </div>
                                    <div className="text-right">
                                        <span className="text-xs text-gray-400">Consultation Fee</span>
                                        <p className="text-2xl font-bold text-sky-600 dark:text-sky-400">
                                            ${doctor.consultationFee ?? doctor.fee ?? 0}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-5 mt-4 text-sm text-gray-500 dark:text-gray-400">
                                    <span className="flex items-center gap-1.5">
                                        <MapPin className="w-4 h-4" />
                                        {doctor.hospital || "MediCare Hospital"}
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <Clock className="w-4 h-4" />
                                        {doctor.experience || 0} yrs experience
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <Stethoscope className="w-4 h-4" />
                                        {doctor.totalReviews || 0} patients served
                                    </span>
                                </div>

                                <div className="flex items-center gap-1.5 mt-3">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className={`w-4 h-4 ${i < Math.round(rating) ? "fill-amber-400 text-amber-400" : "text-gray-200 dark:text-gray-700"}`} />
                                    ))}
                                    <span className="text-sm text-gray-500 ml-1">
                                        {rating > 0 ? `${rating.toFixed(1)} (${doctor.totalReviews || 0} reviews)` : "No reviews yet"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm mb-6 overflow-hidden">
                        <div className="flex border-b border-gray-100 dark:border-gray-800">
                            {["overview", "reviews"].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-6 py-4 text-sm font-medium capitalize transition-all ${activeTab === tab ? "text-sky-600 dark:text-sky-400 border-b-2 border-sky-500" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"}`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        <div className="p-6">
                            {activeTab === "overview" && (
                                <div className="space-y-5">
                                    {doctor.bio && (
                                        <div>
                                            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">About</h3>
                                            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{doctor.bio}</p>
                                        </div>
                                    )}
                                    {doctor.qualifications && (
                                        <div>
                                            <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                                                <GraduationCap className="w-4 h-4 text-sky-500" />
                                                Qualifications
                                            </h3>
                                            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{doctor.qualifications}</p>
                                        </div>
                                    )}
                                    {doctor.availableSlots && (
                                        <div>
                                            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Available Days</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {doctor.availableSlots.map((slot, i) => (
                                                    <span key={i} className="px-3 py-1 bg-sky-50 dark:bg-sky-900/20 text-sky-600 dark:text-sky-400 text-xs rounded-full font-medium">
                                                        {slot}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {!doctor.bio && !doctor.qualifications && (
                                        <p className="text-gray-400 text-sm italic">No additional information available.</p>
                                    )}
                                </div>
                            )}

                            {activeTab === "reviews" && (
                                <div className="space-y-4">
                                    {reviews.length === 0 ? (
                                        <p className="text-gray-400 dark:text-gray-500 text-sm italic">No reviews yet. Be the first to leave a review!</p>
                                    ) : (
                                        reviews.map((review) => (
                                            <div key={review._id} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                                                <div className="flex items-center gap-1 mb-2">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? "fill-amber-400 text-amber-400" : "text-gray-200"}`} />
                                                    ))}
                                                </div>
                                                <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">{review.comment}</p>
                                                <p className="text-xs text-gray-400">— {review.patientName || "Anonymous"}</p>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Booking Section */}
                    <BookingModal doctor={doctor} />
                </motion.div>
            </div>
        </div>
    );
}
