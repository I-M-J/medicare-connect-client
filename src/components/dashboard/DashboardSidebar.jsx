"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import {
    LayoutDashboard, CalendarCheck, CreditCard, Star,
    User, FileText, Settings, Users, Stethoscope, BarChart2,
    LogOut, Menu, X
} from "lucide-react";
import { useState } from "react";

const iconMap = {
    LayoutDashboard, CalendarCheck, CreditCard, Star,
    User, FileText, Settings, Users, Stethoscope, BarChart2
};

const roleColors = {
    patient: "from-sky-500 to-cyan-400",
    doctor: "from-emerald-500 to-teal-400",
    admin: "from-violet-500 to-purple-400",
};

export default function DashboardSidebar({ navItems, role }) {
    const pathname = usePathname();
    const router = useRouter();
    const { data: session } = useSession();
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleSignOut = async () => {
        await signOut();
        router.push("/");
    };

    const sidebarContentNode = (
        <div className="flex flex-col h-full">
            {/* Logo */}
            <div className={`p-5 bg-gradient-to-r ${roleColors[role] || roleColors.patient} text-white`}>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-sm">
                            {session?.user?.name?.[0]?.toUpperCase() || "U"}
                        </span>
                    </div>
                    <div className="min-w-0">
                        <p className="font-semibold text-sm truncate">{session?.user?.name || "User"}</p>
                        <p className="text-white/70 text-xs capitalize">{role} Dashboard</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {navItems.map((item) => {
                    const Icon = iconMap[item.icon] || LayoutDashboard;
                    const isActive = pathname === item.href;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setMobileOpen(false)}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                                isActive
                                    ? "bg-sky-50 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400"
                                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                            }`}
                        >
                            <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-sky-600 dark:text-sky-400" : ""}`} />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            {/* Sign Out */}
            <div className="p-4 border-t border-gray-100 dark:border-gray-800">
                <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all"
                >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                </button>
            </div>
        </div>
    );

    return (
        <>
            {/* Mobile Toggle */}
            <button
                className="lg:hidden fixed top-20 left-4 z-40 p-2 bg-white dark:bg-gray-900 rounded-xl shadow-md border border-gray-200 dark:border-gray-700"
                onClick={() => setMobileOpen(!mobileOpen)}
            >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Mobile Overlay */}
            {mobileOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/40 z-30"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Mobile Sidebar */}
            <aside className={`lg:hidden fixed left-0 top-0 h-full w-64 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 z-40 shadow-xl transform transition-transform duration-300 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
                {sidebarContentNode}
            </aside>

            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex flex-col w-64 flex-shrink-0 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 h-screen sticky top-0">
                {sidebarContentNode}
            </aside>
        </>
    );
}
