"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { SearchX, ArrowLeft } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-4">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md w-full bg-white dark:bg-gray-900 rounded-3xl p-8 text-center border border-gray-100 dark:border-gray-800 shadow-xl shadow-sky-900/5"
            >
                <div className="w-20 h-20 bg-sky-50 dark:bg-sky-900/20 text-sky-500 rounded-2xl flex items-center justify-center mx-auto mb-6 rotate-12">
                    <SearchX className="w-10 h-10 -rotate-12" />
                </div>
                
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">404</h1>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Page not found</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-8">
                    Oops! The page you are looking for doesn&apos;t exist or has been moved.
                </p>
                
                <Link 
                    href="/" 
                    className="inline-flex items-center justify-center gap-2 w-full py-3 bg-sky-500 hover:bg-sky-600 text-white rounded-xl font-medium transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to Home
                </Link>
            </motion.div>
        </div>
    );
}
