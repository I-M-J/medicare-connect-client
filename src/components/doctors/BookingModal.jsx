"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useSession, authClient } from "@/lib/auth-client";
import { toast } from "react-hot-toast";
import { CalendarCheck, X, CreditCard } from "lucide-react";
import PaymentForm from "@/components/payment/PaymentForm";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

export default function BookingModal({ doctor }) {
    const router = useRouter();
    const { data: sessionData, isPending } = useSession();
    const [isOpen, setIsOpen] = useState(false);
    const [step, setStep] = useState(1); // 1 = booking form, 2 = payment
    const [bookingData, setBookingData] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { register, handleSubmit, formState: { errors }, reset } = useForm();

    const handleOpen = () => {
        if (!sessionData) {
            toast.error("Please login to book an appointment");
            router.push("/login");
            return;
        }
        setIsOpen(true);
    };

    const handleClose = () => {
        setIsOpen(false);
        setStep(1);
        setBookingData(null);
        reset();
    };

    const onBookingSubmit = (data) => {
        setBookingData(data);
        setStep(2);
    };

    const onPaymentSuccess = async (paymentIntentId) => {
        setIsSubmitting(true);
        try {
            let tokenValue = "";

            try {
                const tokenRes = await authClient.token();
                tokenValue = tokenRes?.data?.token || tokenRes?.value || "";
            }
            catch {
                tokenValue = sessionData?.session?.token || "";
            }

            const appointmentPayload = {
                doctorId: doctor._id,
                doctorName: doctor.doctorName,
                doctorEmail: doctor.email,
                doctorSpecialization: doctor.specialization,
                doctorImage: doctor.image,
                patientId: sessionData.user.id,
                patientName: sessionData.user.name,
                patientEmail: sessionData.user.email,
                patientPhone: bookingData.phone,
                appointmentDate: bookingData.date,
                appointmentTime: bookingData.time,
                issue: bookingData.issue,
                consultationFee: doctor.consultationFee ?? doctor.fee ?? 0,
                paymentIntentId,
                appointmentStatus: "pending",
                paymentStatus: "paid",
            };

            const res = await fetch(`${SERVER_URL}/appointments`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${tokenValue}`,
                },
                body: JSON.stringify(appointmentPayload),
            });

            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.message || "Failed to create appointment");
            }

            toast.success("Appointment booked successfully! 🎉");
            handleClose();
            router.refresh();
        }
        catch (error) {
            console.error("Appointment creation error:", error);
            toast.error(error.message || "Failed to complete booking");
        }
        finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="font-bold text-gray-900 dark:text-white">Book an Appointment</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Consultation fee: <span className="font-semibold text-sky-600 dark:text-sky-400">${doctor.consultationFee ?? 0}</span></p>
                    </div>
                </div>
                <button
                    onClick={handleOpen}
                    disabled={isPending}
                    className="w-full flex items-center justify-center gap-2 py-3.5 bg-sky-500 hover:bg-sky-600 disabled:bg-sky-300 text-white font-semibold rounded-xl shadow-sm transition-all"
                >
                    <CalendarCheck className="w-5 h-5" />
                    {isPending ? "Loading..." : "Book Appointment"}
                </button>
            </div>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md border border-gray-100 dark:border-gray-800">
                        {/* Header */}
                        <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-800">
                            <div>
                                <h3 className="font-bold text-gray-900 dark:text-white">
                                    {step === 1 ? "Book Appointment" : "Complete Payment"}
                                </h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                    Dr. {doctor.doctorName} — {doctor.specialization}
                                </p>
                            </div>
                            <button onClick={handleClose} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 transition-colors">
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Step indicator */}
                        <div className="px-5 pt-4 flex items-center gap-2">
                            <div className={`flex-1 h-1.5 rounded-full ${step >= 1 ? "bg-sky-500" : "bg-gray-200 dark:bg-gray-700"}`} />
                            <div className={`flex-1 h-1.5 rounded-full ${step >= 2 ? "bg-sky-500" : "bg-gray-200 dark:bg-gray-700"}`} />
                        </div>

                        {/* Step 1: Booking Form */}
                        {step === 1 && (
                            <form onSubmit={handleSubmit(onBookingSubmit)} className="p-5 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">Your Name</label>
                                        <input
                                            type="text"
                                            value={sessionData?.user?.name || ""}
                                            readOnly
                                            className="w-full px-3 py-2.5 rounded-xl text-sm border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-500 cursor-not-allowed"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">Phone <span className="text-red-500">*</span></label>
                                        <input
                                            type="tel"
                                            placeholder="+880 1700..."
                                            className={`w-full px-3 py-2.5 rounded-xl text-sm border ${errors.phone ? "border-red-400" : "border-gray-200 dark:border-gray-700"} bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-400 transition`}
                                            {...register("phone", { required: "Phone number is required" })}
                                        />
                                        {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">Date <span className="text-red-500">*</span></label>
                                        <input
                                            type="date"
                                            min={new Date().toISOString().split("T")[0]}
                                            className={`w-full px-3 py-2.5 rounded-xl text-sm border ${errors.date ? "border-red-400" : "border-gray-200 dark:border-gray-700"} bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-400 transition`}
                                            {...register("date", { required: "Date is required" })}
                                        />
                                        {errors.date && <p className="text-xs text-red-500 mt-1">{errors.date.message}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">Time <span className="text-red-500">*</span></label>
                                        <select
                                            className={`w-full px-3 py-2.5 rounded-xl text-sm border ${errors.time ? "border-red-400" : "border-gray-200 dark:border-gray-700"} bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-400 transition`}
                                            {...register("time", { required: "Time is required" })}
                                        >
                                            <option value="">Select time</option>
                                            {["09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"].map((t) => (
                                                <option key={t} value={t}>{t}</option>
                                            ))}
                                        </select>
                                        {errors.time && <p className="text-xs text-red-500 mt-1">{errors.time.message}</p>}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">Chief Complaint / Issue</label>
                                    <textarea
                                        placeholder="Describe your symptoms or reason for visit..."
                                        rows={3}
                                        className="w-full px-3 py-2.5 rounded-xl text-sm border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-400 transition resize-none"
                                        {...register("issue")}
                                    />
                                </div>

                                <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800">
                                    <div>
                                        <span className="text-xs text-gray-400">Total to pay</span>
                                        <p className="font-bold text-sky-600 dark:text-sky-400">${doctor.consultationFee ?? 0}</p>
                                    </div>
                                    <button
                                        type="submit"
                                        className="flex items-center gap-2 px-5 py-2.5 bg-sky-500 hover:bg-sky-600 text-white font-semibold rounded-xl text-sm transition-all"
                                    >
                                        <CreditCard className="w-4 h-4" />
                                        Proceed to Payment
                                    </button>
                                </div>
                            </form>
                        )}

                        {/* Step 2: Payment */}
                        {step === 2 && (
                            <div className="p-5">
                                <PaymentForm
                                    amount={doctor.consultationFee ?? doctor.fee ?? 0}
                                    doctorName={doctor.doctorName}
                                    appointmentDate={bookingData?.date}
                                    onSuccess={onPaymentSuccess}
                                    onCancel={() => setStep(1)}
                                    isLoading={isSubmitting}
                                />
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
