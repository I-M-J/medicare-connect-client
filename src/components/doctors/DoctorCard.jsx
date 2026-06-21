import Link from "next/link";
import { Star, MapPin, Clock, Award } from "lucide-react";

export default function DoctorCard({ doctor }) {
    const id = doctor._id;
    const rating = doctor.averageRating ?? 0;

    return (
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm hover:shadow-md hover:border-sky-200 dark:hover:border-sky-700 transition-all overflow-hidden group flex flex-col">
            {/* Top — image + badge */}
            <div className="relative p-5 flex items-start gap-4">
                <div className="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 bg-sky-100 dark:bg-sky-900/30">
                    <img
                        src={doctor.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.doctorName || "Dr")}&background=0ea5e9&color=fff`}
                        alt={doctor.doctorName}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                    />
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 dark:text-white text-base truncate">
                        Dr. {doctor.doctorName}
                    </h3>
                    <p className="text-sky-600 dark:text-sky-400 text-sm font-medium mt-0.5">
                        {doctor.specialization}
                    </p>

                    {/* Verification badge */}
                    {doctor.verificationStatus === "verified" && (
                        <span className="inline-flex items-center gap-1 text-xs bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full mt-1 font-medium">
                            <Award className="w-3 h-3" />
                            Verified
                        </span>
                    )}
                </div>
            </div>

            {/* Info */}
            <div className="px-5 pb-4 flex flex-col gap-2 flex-1">
                <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                    <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="truncate">{doctor.hospital || "MediCare Hospital"}</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                    <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{doctor.experience || 0} yrs experience</span>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1.5">
                    {[...Array(5)].map((_, i) => (
                        <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${i < Math.round(rating) ? "fill-amber-400 text-amber-400" : "text-gray-200 dark:text-gray-700"}`}
                        />
                    ))}
                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                        {rating > 0 ? `${rating.toFixed(1)} (${doctor.totalReviews || 0})` : "No reviews"}
                    </span>
                </div>

                {/* Fee + CTA */}
                <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100 dark:border-gray-800">
                    <div>
                        <span className="text-xs text-gray-400 dark:text-gray-500">Consultation fee</span>
                        <p className="text-lg font-bold text-sky-600 dark:text-sky-400">
                            ${doctor.consultationFee ?? doctor.fee ?? 0}
                        </p>
                    </div>
                    <Link
                        href={`/find-doctors/${id}`}
                        className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white text-sm font-semibold rounded-xl transition-all shadow-sm group-hover:shadow-md"
                    >
                        Book Now
                    </Link>
                </div>
            </div>
        </div>
    );
}
