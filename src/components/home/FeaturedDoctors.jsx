import Link from "next/link";
import { Star, Award, ArrowRight } from "lucide-react";

export default function FeaturedDoctors({ doctors }) {
    if (!doctors || doctors.length === 0) {
        return null;
    }

    return (
        <section className="py-16 bg-white dark:bg-gray-950">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                            Featured <span className="text-sky-500">Doctors</span>
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400">Our most trusted and highly rated healthcare professionals</p>
                    </div>
                    <Link
                        href="/find-doctors"
                        className="hidden sm:flex items-center gap-2 text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 font-semibold text-sm transition-colors"
                    >
                        See All <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {doctors.slice(0, 6).map((doctor) => {
                        const rating = doctor.averageRating ?? 0;
                        return (
                            <div
                                key={doctor._id}
                                className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-sky-200 dark:hover:border-sky-800 transition-all group"
                            >
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 bg-sky-100 dark:bg-sky-900/20">
                                        <img
                                            src={doctor.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.doctorName || "Dr")}&background=0ea5e9&color=fff`}
                                            alt={doctor.doctorName}
                                            className="w-full h-full object-cover"
                                            referrerPolicy="no-referrer"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-gray-900 dark:text-white truncate">Dr. {doctor.doctorName}</h3>
                                        <p className="text-sky-600 dark:text-sky-400 text-sm">{doctor.specialization}</p>
                                        <div className="flex items-center gap-1 mt-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className={`w-3 h-3 ${i < Math.round(rating) ? "fill-amber-400 text-amber-400" : "text-gray-200 dark:text-gray-700"}`} />
                                            ))}
                                            <span className="text-xs text-gray-400 ml-1">{rating.toFixed(1)}</span>
                                        </div>
                                    </div>
                                    {doctor.verificationStatus === "verified" && (
                                        <Award className="w-5 h-5 text-emerald-500 shrink-0" />
                                    )}
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <span className="text-xs text-gray-400">Fee</span>
                                        <p className="font-bold text-sky-600 dark:text-sky-400">${doctor.consultationFee ?? 0}</p>
                                    </div>
                                    <Link
                                        href={`/find-doctors/${doctor._id}`}
                                        className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white text-xs font-semibold rounded-xl transition-all shadow-sm"
                                    >
                                        Book Now
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="text-center mt-8 sm:hidden">
                    <Link
                        href="/find-doctors"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-sky-50 dark:bg-sky-900/20 text-sky-600 dark:text-sky-400 rounded-xl font-semibold text-sm hover:bg-sky-100 dark:hover:bg-sky-900/40 transition-all"
                    >
                        See All Doctors <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
