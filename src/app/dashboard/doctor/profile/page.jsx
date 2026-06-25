"use client";

import { useState, useEffect } from "react";
import { useSession, authClient } from "@/lib/auth-client";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { User, DollarSign, Clock, MapPin, Briefcase, GraduationCap, FileText, Loader2, Save } from "lucide-react";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

export default function DoctorProfilePage() {
    const { data: session } = useSession();
    const [doctor, setDoctor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    
    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    useEffect(() => {
        const fetchProfile = async () => {
            if (!session) return;
            setLoading(true);
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
                    if (docData && Object.keys(docData).length > 0) {
                        setDoctor(docData);
                        reset({
                            doctorName: docData.doctorName || session.user.name,
                            email: docData.email || session.user.email,
                            specialization: docData.specialization || "",
                            qualifications: docData.qualifications || "",
                            experience: docData.experience || "",
                            consultationFee: docData.consultationFee || docData.fee || "",
                            hospital: docData.hospital || "",
                            availableDays: docData.availableDays?.join(", ") || "",
                            availableSlots: docData.availableSlots?.join(", ") || "",
                            bio: docData.bio || ""
                        });
                    } else {
                        // Not found, pre-fill from session
                        reset({
                            doctorName: session.user.name,
                            email: session.user.email,
                        });
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

        fetchProfile();
    }, [session, reset]);

    const onSubmit = async (data) => {
        setSaving(true);
        try {
            let tokenValue = "";
            try {
                const tokenRes = await authClient.token();
                tokenValue = tokenRes?.data?.token || "";
            } catch { tokenValue = session?.session?.token || ""; }

            // Convert comma separated strings to arrays
            const formattedData = {
                ...data,
                experience: Number(data.experience),
                consultationFee: Number(data.consultationFee),
                availableDays: data.availableDays.split(",").map(d => d.trim()).filter(Boolean),
                availableSlots: data.availableSlots.split(",").map(d => d.trim()).filter(Boolean),
                image: session.user.image || ""
            };

            const method = doctor && doctor._id ? "PATCH" : "POST";
            const url = doctor && doctor._id ? `${SERVER_URL}/doctors/${doctor._id}` : `${SERVER_URL}/doctors`;

            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${tokenValue}`
                },
                body: JSON.stringify(formattedData)
            });

            if (!res.ok) throw new Error("Failed to save profile");
            
            const savedData = await res.json();
            
            // If it was a POST, we need to refresh the session to pick up the new 'doctor' role
            if (method === "POST") {
                await authClient.getSession({
                    fetchOptions: {
                        headers: {
                            "Cache-Control": "no-cache",
                        }
                    }
                });
                toast.success("Doctor profile created successfully! Redirecting...");
                setTimeout(() => {
                    window.location.href = "/dashboard";
                }, 1500);
            } else {
                toast.success("Profile updated successfully");
            }
        }
        catch (err) {
            toast.error(err.message || "Failed to save profile");
        }
        finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-sky-500 animate-spin" /></div>;

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Doctor Profile</h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Update your professional information and availability</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Basic Info */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-3">
                        <User className="w-5 h-5 text-sky-500" /> Basic Information
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Full Name</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2.5 rounded-xl text-sm border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-sky-400"
                                {...register("doctorName", { required: "Name is required" })}
                            />
                            {errors.doctorName && <p className="text-xs text-red-500 mt-1">{errors.doctorName.message}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email Address</label>
                            <input
                                type="email"
                                readOnly
                                className="w-full px-4 py-2.5 rounded-xl text-sm border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-500 cursor-not-allowed"
                                {...register("email")}
                            />
                        </div>
                    </div>
                </div>

                {/* Professional Info */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-3">
                        <Briefcase className="w-5 h-5 text-sky-500" /> Professional Details
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Specialization</label>
                            <input
                                type="text"
                                placeholder="e.g. Cardiologist"
                                className="w-full px-4 py-2.5 rounded-xl text-sm border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-sky-400"
                                {...register("specialization", { required: "Specialization is required" })}
                            />
                            {errors.specialization && <p className="text-xs text-red-500 mt-1">{errors.specialization.message}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Qualifications</label>
                            <div className="relative">
                                <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="e.g. MBBS, MD"
                                    className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-sky-400"
                                    {...register("qualifications", { required: "Qualifications are required" })}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Years of Experience</label>
                            <input
                                type="number"
                                min="0"
                                className="w-full px-4 py-2.5 rounded-xl text-sm border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-sky-400"
                                {...register("experience", { required: "Experience is required" })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Consultation Fee ($)</label>
                            <div className="relative">
                                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="number"
                                    min="0"
                                    className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-sky-400"
                                    {...register("consultationFee", { required: "Fee is required" })}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Hospital / Clinic</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Where do you practice?"
                                    className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-sky-400"
                                    {...register("hospital", { required: "Hospital is required" })}
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Professional Bio</label>
                        <div className="relative">
                            <FileText className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                            <textarea
                                rows="4"
                                placeholder="Tell patients about your expertise..."
                                className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-sky-400 resize-none"
                                {...register("bio")}
                            ></textarea>
                        </div>
                    </div>
                </div>

                {/* Availability */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-3">
                        <Clock className="w-5 h-5 text-sky-500" /> Availability & Schedule
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Available Days</label>
                            <input
                                type="text"
                                placeholder="e.g. Mon, Tue, Wed, Thu, Fri"
                                className="w-full px-4 py-2.5 rounded-xl text-sm border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-sky-400"
                                {...register("availableDays", { required: "Days are required" })}
                            />
                            <p className="text-xs text-gray-500 mt-1.5">Comma separated list</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Available Slots</label>
                            <input
                                type="text"
                                placeholder="e.g. 09:00 AM, 11:00 AM, 02:00 PM"
                                className="w-full px-4 py-2.5 rounded-xl text-sm border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-sky-400"
                                {...register("availableSlots", { required: "Slots are required" })}
                            />
                            <p className="text-xs text-gray-500 mt-1.5">Comma separated list</p>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-3 bg-sky-500 hover:bg-sky-600 disabled:bg-sky-300 text-white rounded-xl font-medium transition-colors shadow-sm"
                    >
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        {saving ? "Saving Profile..." : "Save Profile"}
                    </button>
                </div>
            </form>
        </div>
    );
}
