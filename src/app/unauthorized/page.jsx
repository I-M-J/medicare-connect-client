"use client";

import Link from "next/link";
import { ShieldAlert, ArrowLeft } from "lucide-react";

export default function UnauthorizedPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-4">
            <div className="max-w-md w-full bg-white dark:bg-gray-900 rounded-3xl shadow-xl shadow-red-100 dark:shadow-red-900/10 border border-red-100 dark:border-red-900/20 p-8 text-center">
                <div className="w-20 h-20 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <ShieldAlert className="w-10 h-10 text-red-500" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Access Denied</h1>
                <p className="text-gray-500 dark:text-gray-400 mb-8">
                    You do not have the required permissions to view this page. If you believe this is a mistake, please contact support.
                </p>
                <Link
                    href="/"
                    className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 bg-sky-500 hover:bg-sky-600 text-white font-medium rounded-xl transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Return Home
                </Link>
            </div>
        </div>
    );
}
