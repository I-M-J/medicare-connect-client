"use client";

import { useState, useEffect } from "react";
import { useSession, authClient } from "@/lib/auth-client";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { User, Phone, CheckCircle, Mail, Loader2, Save } from "lucide-react";

export default function GeneralProfile() {
    const { data: session, isPending } = useSession();
    const [saving, setSaving] = useState(false);
    
    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    useEffect(() => {
        if (session?.user) {
            reset({
                name: session.user.name || "",
                phone: session.user.phone || "",
                gender: session.user.gender || "",
            });
        }
    }, [session, reset]);

    const onSubmit = async (data) => {
        setSaving(true);
        try {
            const { error } = await authClient.updateUser({
                name: data.name,
                phone: data.phone,
                gender: data.gender,
            });

            if (error) {
                throw new Error(error.message || "Failed to update profile");
            }
            
            toast.success("Profile updated successfully");
            // Optional: window.location.reload() to force refresh session context
        }
        catch (err) {
            toast.error(err.message || "Something went wrong");
        }
        finally {
            setSaving(false);
        }
    };

    if (isPending) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-sky-500 animate-spin" /></div>;

    return (
        <div className="max-w-3xl mx-auto">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Account Settings</h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Manage your basic account information</p>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6 mb-6">
                <div className="flex flex-col sm:flex-row items-center gap-6 mb-6 pb-6 border-b border-gray-100 dark:border-gray-800">
                    <div className="w-24 h-24 rounded-full bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center text-sky-600 dark:text-sky-400 text-3xl font-bold">
                        {session?.user?.image ? (
                            <img src={session.user.image} alt="Avatar" className="w-full h-full rounded-full object-cover" referrerPolicy="no-referrer" />
                        ) : (
                            session?.user?.name?.[0]?.toUpperCase() || "U"
                        )}
                    </div>
                    <div className="text-center sm:text-left">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">{session?.user?.name}</h2>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">{session?.user?.email}</p>
                        <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-full text-xs font-medium capitalize">
                            <CheckCircle className="w-3.5 h-3.5" />
                            {session?.user?.role || "patient"} Account
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-sky-400"
                                    {...register("name", { required: "Name is required" })}
                                />
                            </div>
                            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="email"
                                    readOnly
                                    value={session?.user?.email || ""}
                                    className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-500 cursor-not-allowed"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Phone Number</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="tel"
                                    placeholder="e.g. +1 234 567 8900"
                                    className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-sky-400"
                                    {...register("phone")}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Gender</label>
                            <select
                                className="w-full px-4 py-2.5 rounded-xl text-sm border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-sky-400 appearance-none"
                                {...register("gender")}
                            >
                                <option value="">Select Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                                <option value="prefer_not_to_say">Prefer not to say</option>
                            </select>
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex items-center gap-2 px-6 py-2.5 bg-sky-500 hover:bg-sky-600 disabled:bg-sky-300 text-white rounded-xl font-medium transition-colors shadow-sm"
                        >
                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            {saving ? "Saving Changes..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
