"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, RefreshCcw } from "lucide-react";

export default function Error({ error, reset }) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-4">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md w-full bg-white dark:bg-gray-900 rounded-3xl p-8 text-center border border-gray-100 dark:border-gray-800 shadow-xl shadow-red-900/5"
            >
                <div className="w-20 h-20 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <AlertTriangle className="w-10 h-10" />
                </div>
                
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Something went wrong!</h1>
                <p className="text-gray-500 dark:text-gray-400 mb-8 text-sm">
                    We encountered an unexpected error. Please try again or contact support if the issue persists.
                </p>
                
                <button 
                    onClick={() => reset()}
                    className="inline-flex items-center justify-center gap-2 w-full py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-colors"
                >
                    <RefreshCcw className="w-4 h-4" /> Try Again
                </button>
            </motion.div>
        </div>
    );
}
