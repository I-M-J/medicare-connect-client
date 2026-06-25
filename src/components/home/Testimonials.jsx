"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const fallbackTestimonials = [
    {
        _id: "1",
        patientName: "Sarah Johnson",
        rating: 5,
        comment: "Amazing experience! Dr. Rahman was very thorough and explained everything clearly. The booking process was so simple.",
        doctorName: "Dr. Rahman",
    },
    {
        _id: "2",
        patientName: "Michael Chen",
        rating: 5,
        comment: "I've been using MediCare Connect for over a year now and I couldn't be happier. Quality doctors, easy scheduling.",
        doctorName: "Dr. Hasan",
    },
    {
        _id: "3",
        patientName: "Aisha Begum",
        rating: 4,
        comment: "Very professional platform. Found a cardiologist within minutes and got an appointment the same day. Highly recommend!",
        doctorName: "Dr. Kamal",
    },
];

export default function Testimonials({ testimonials }) {
    const displayItems = testimonials?.length ? testimonials.slice(0, 3) : fallbackTestimonials;

    return (
        <section className="py-16 bg-white dark:bg-gray-950">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                        What Our <span className="text-sky-500">Patients Say</span>
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400">Real stories from real patients who trust MediCare Connect</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {displayItems.map((item, i) => (
                        <motion.div
                            key={item._id || i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1, duration: 0.5 }}
                            className="bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 hover:shadow-md transition-all relative"
                        >
                            <Quote className="w-8 h-8 text-sky-200 dark:text-sky-900 absolute top-4 right-4" />

                            <div className="flex items-center gap-1 mb-4">
                                {[...Array(5)].map((_, j) => (
                                    <Star key={j} className={`w-4 h-4 ${j < (item.rating || 5) ? "fill-amber-400 text-amber-400" : "text-gray-200 dark:text-gray-700"}`} />
                                ))}
                            </div>

                            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-5">
                                &ldquo;{item.comment}&rdquo;
                            </p>

                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-sky-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                                    {(item.patientName || "P")[0].toUpperCase()}
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900 dark:text-white text-sm">{item.patientName || "Anonymous"}</p>
                                    {item.doctorName && (
                                        <p className="text-xs text-gray-400 dark:text-gray-500">Patient of {item.doctorName}</p>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
