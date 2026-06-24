"use client";

import Link from "next/link";
import { useState } from "react";
import { useSession, signOut } from "@/lib/auth-client";
import { useTheme } from "next-themes";
import {
    Menu,
    X,
    Sun,
    Moon,
    ChevronDown,
    User,
    LogOut,
    LayoutDashboard,
    Stethoscope,
} from "lucide-react";

const navLinks = [
    { href: "/", label: "Home" },
    { href: "/find-doctors", label: "Find Doctors" },
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact Us" },
];

export default function Navbar() {
    const { data: session, isPending } = useSession();
    const { theme, setTheme } = useTheme();
    const [menuOpen, setMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const handleSignOut = async () => {
        await signOut();
        setDropdownOpen(false);
    };

    const getDashboardLink = () => {
        const role = session?.user?.role;
        if (role === "admin") return "/dashboard/admin";
        if (role === "doctor") return "/dashboard/doctor";
        return "/dashboard/patient";
    };

    return (
        <nav className="sticky top-0 z-50 bg-white/90 dark:bg-gray-950/90 backdrop-blur-md border-b border-sky-100 dark:border-sky-900/30 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-500 to-cyan-400 flex items-center justify-center shadow-md">
                            <Stethoscope className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-bold text-xl text-sky-600 dark:text-sky-400 tracking-tight">
                            MediCare<span className="text-gray-800 dark:text-white">Connect</span>
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <ul className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <li key={link.href}>
                                <Link
                                    href={link.href}
                                    className="px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-sky-600 dark:hover:text-sky-400 rounded-lg hover:bg-sky-50 dark:hover:bg-sky-900/20 transition-all"
                                >
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    {/* Right Side */}
                    <div className="hidden md:flex items-center gap-3">
                        {/* Theme Toggle */}
                        <button
                            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                            className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-sky-50 dark:hover:bg-sky-900/20 hover:text-sky-600 dark:hover:text-sky-400 transition-all"
                            aria-label="Toggle theme"
                        >
                            {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>

                        {isPending ? (
                            <div className="w-8 h-8 rounded-full bg-sky-100 animate-pulse" />
                        ) : session?.user ? (
                            <div className="relative">
                                <button
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-sky-200 dark:border-sky-800 hover:bg-sky-50 dark:hover:bg-sky-900/20 transition-all"
                                >
                                    {session.user.image ? (
                                        <img
                                            src={session.user.image}
                                            alt={session.user.name}
                                            className="w-7 h-7 rounded-full object-cover"
                                            referrerPolicy="no-referrer"
                                        />
                                    ) : (
                                        <div className="w-7 h-7 rounded-full bg-sky-500 flex items-center justify-center text-white text-xs font-bold">
                                            {session.user.name?.[0]?.toUpperCase() || "U"}
                                        </div>
                                    )}
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200 max-w-[100px] truncate">
                                        {session.user.name?.split(" ")[0]}
                                    </span>
                                    <ChevronDown className="w-4 h-4 text-gray-400" />
                                </button>

                                {dropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl shadow-xl py-1.5 z-50">
                                        <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-800">
                                            <p className="text-sm font-semibold text-gray-800 dark:text-white truncate">{session.user.name}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{session.user.email}</p>
                                        </div>
                                        <Link
                                            href={getDashboardLink()}
                                            onClick={() => setDropdownOpen(false)}
                                            className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-sky-50 dark:hover:bg-sky-900/20 hover:text-sky-600 transition-all"
                                        >
                                            <LayoutDashboard className="w-4 h-4" />
                                            Dashboard
                                        </Link>
                                        <Link
                                            href="/dashboard/profile"
                                            onClick={() => setDropdownOpen(false)}
                                            className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-sky-50 dark:hover:bg-sky-900/20 hover:text-sky-600 transition-all"
                                        >
                                            <User className="w-4 h-4" />
                                            Profile
                                        </Link>
                                        <button
                                            onClick={handleSignOut}
                                            className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Sign Out
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link
                                    href="/login"
                                    className="px-4 py-2 text-sm font-medium text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-900/20 rounded-lg transition-all"
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/register"
                                    className="px-4 py-2 text-sm font-medium text-white bg-sky-500 hover:bg-sky-600 rounded-lg shadow-sm transition-all"
                                >
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile: avatar + menu button */}
                    <div className="md:hidden flex items-center gap-2">
                        {session?.user && (
                            <button
                                onClick={() => setMenuOpen(!menuOpen)}
                                className="flex items-center gap-2 px-2 py-1.5 rounded-xl border border-sky-200 dark:border-sky-800 hover:bg-sky-50 dark:hover:bg-sky-900/20 transition-all"
                            >
                                {session.user.image ? (
                                    <img
                                        src={session.user.image}
                                        alt={session.user.name}
                                        className="w-7 h-7 rounded-full object-cover"
                                        referrerPolicy="no-referrer"
                                    />
                                ) : (
                                    <div className="w-7 h-7 rounded-full bg-sky-500 flex items-center justify-center text-white text-xs font-bold">
                                        {session.user.name?.[0]?.toUpperCase() || "U"}
                                    </div>
                                )}
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-200 max-w-[80px] truncate">
                                    {session.user.name?.split(" ")[0]}
                                </span>
                            </button>
                        )}
                        <button
                            className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-sky-50 dark:hover:bg-sky-900/20 transition-all"
                            onClick={() => setMenuOpen(!menuOpen)}
                            aria-label="Toggle menu"
                        >
                            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {menuOpen && (
                    <div className="md:hidden border-t border-sky-100 dark:border-sky-900/30 py-3 space-y-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setMenuOpen(false)}
                                className="block px-3 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-sky-600 dark:hover:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-900/20 rounded-lg transition-all"
                            >
                                {link.label}
                            </Link>
                        ))}
                        <div className="pt-2 border-t border-sky-100 dark:border-sky-900/30 flex flex-col gap-2">
                            {session?.user ? (
                                <>
                                    {/* User info header in mobile menu */}
                                    <div className="px-3 py-2.5 bg-sky-50 dark:bg-sky-900/20 rounded-xl">
                                        <p className="text-sm font-semibold text-gray-800 dark:text-white truncate">{session.user.name}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{session.user.email}</p>
                                        <span className="inline-block mt-1 text-xs font-medium px-2 py-0.5 bg-sky-100 dark:bg-sky-900/40 text-sky-600 dark:text-sky-400 rounded-full capitalize">
                                            {session.user.role || "patient"}
                                        </span>
                                    </div>
                                    <Link
                                        href={getDashboardLink()}
                                        onClick={() => setMenuOpen(false)}
                                        className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-sky-600 hover:bg-sky-50 dark:hover:bg-sky-900/20 rounded-lg transition-all"
                                    >
                                        <LayoutDashboard className="w-4 h-4" />
                                        Dashboard
                                    </Link>
                                    <button
                                        onClick={() => { handleSignOut(); setMenuOpen(false); }}
                                        className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg text-left transition-all"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Sign Out
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link href="/login" onClick={() => setMenuOpen(false)} className="px-4 py-2.5 text-sm font-medium text-center text-sky-600 border border-sky-200 rounded-lg hover:bg-sky-50 transition-all">Login</Link>
                                    <Link href="/register" onClick={() => setMenuOpen(false)} className="px-4 py-2.5 text-sm font-medium text-center text-white bg-sky-500 rounded-lg hover:bg-sky-600 transition-all">Register</Link>
                                </>
                            )}
                            <button
                                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                                className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-sky-50 dark:hover:bg-sky-900/20 rounded-lg transition-all"
                            >
                                {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                                {theme === "dark" ? "Light Mode" : "Dark Mode"}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
