import Link from "next/link";
import { Heart, Brain, Bone, Baby, Microscope, Eye, Pill, Activity } from "lucide-react";

const specializations = [
    { label: "Cardiology", icon: Heart, color: "text-rose-500", bg: "bg-rose-50 dark:bg-rose-900/20", slug: "Cardiology" },
    { label: "Neurology", icon: Brain, color: "text-violet-500", bg: "bg-violet-50 dark:bg-violet-900/20", slug: "Neurology" },
    { label: "Orthopedics", icon: Bone, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-900/20", slug: "Orthopedics" },
    { label: "Pediatrics", icon: Baby, color: "text-pink-500", bg: "bg-pink-50 dark:bg-pink-900/20", slug: "Pediatrics" },
    { label: "Dermatology", icon: Microscope, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-900/20", slug: "Dermatology" },
    { label: "Ophthalmology", icon: Eye, color: "text-sky-500", bg: "bg-sky-50 dark:bg-sky-900/20", slug: "Ophthalmology" },
    { label: "Pharmacy", icon: Pill, color: "text-indigo-500", bg: "bg-indigo-50 dark:bg-indigo-900/20", slug: "Pharmacy" },
    { label: "General Medicine", icon: Activity, color: "text-cyan-500", bg: "bg-cyan-50 dark:bg-cyan-900/20", slug: "General" },
];

export default function Specializations() {
    return (
        <section className="py-16 bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                        Browse by <span className="text-sky-500">Specialization</span>
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
                        Find the right specialist for your health needs across a wide range of medical disciplines.
                    </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {specializations.map((spec) => (
                        <Link
                            key={spec.slug}
                            href={`/find-doctors?specialization=${spec.slug}`}
                            className="group flex flex-col items-center gap-3 p-5 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-sm hover:shadow-md hover:border-sky-300 dark:hover:border-sky-600 transition-all"
                        >
                            <div className={`${spec.bg} p-4 rounded-xl group-hover:scale-110 transition-transform`}>
                                <spec.icon className={`w-7 h-7 ${spec.color}`} />
                            </div>
                            <span className="text-sm font-semibold text-gray-700 dark:text-gray-200 text-center">
                                {spec.label}
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
