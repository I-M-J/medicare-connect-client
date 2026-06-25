import Link from "next/link";
import { Stethoscope, Phone, Mail, MapPin } from "lucide-react";
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from "react-icons/fa";

const quickLinks = [
    { href: "/", label: "Home" },
    { href: "/find-doctors", label: "Find Doctors" },
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact Us" },
    { href: "/login", label: "Login" },
    { href: "/register", label: "Register" },
];

const services = [
    { href: "/find-doctors?spec=Cardiology", label: "Cardiology" },
    { href: "/find-doctors?spec=Neurology", label: "Neurology" },
    { href: "/find-doctors?spec=Orthopedics", label: "Orthopedics" },
    { href: "/find-doctors?spec=Pediatrics", label: "Pediatrics" },
    { href: "/find-doctors?spec=Dermatology", label: "Dermatology" },
];

export default function Footer() {
    return (
        <footer className="bg-gray-900 dark:bg-gray-950 text-white border-t border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                    {/* Brand */}
                    <div className="space-y-5">
                        <Link href="/" className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-xl bg-linear-to-br from-sky-500 to-cyan-400 flex items-center justify-center shadow-md">
                                <Stethoscope className="w-5 h-5 text-white" />
                            </div>
                            <span className="font-bold text-xl text-sky-400 tracking-tight">
                                MediCare<span className="text-white">Connect</span>
                            </span>
                        </Link>
                        <p className="text-sm text-gray-400 leading-relaxed">
                            Your trusted partner in healthcare. Connect with verified doctors and book appointments effortlessly.
                        </p>
                        <div className="flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                            <span className="text-sm text-red-400 font-semibold">Emergency: 999</span>
                        </div>
                        <div className="flex items-center gap-3 pt-1">
                            {[FaFacebook, FaTwitter, FaLinkedin, FaInstagram].map((Icon, i) => (
                                <a
                                    key={i}
                                    href="#"
                                    className="w-9 h-9 rounded-lg bg-gray-800 hover:bg-sky-500 flex items-center justify-center text-gray-400 hover:text-white transition-all duration-200"
                                >
                                    <Icon className="w-4 h-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-sm font-semibold text-sky-400 uppercase tracking-wider mb-5">Quick Links</h3>
                        <ul className="space-y-3">
                            {quickLinks.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-gray-400 hover:text-sky-400 transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Specializations */}
                    <div>
                        <h3 className="text-sm font-semibold text-sky-400 uppercase tracking-wider mb-5">Specializations</h3>
                        <ul className="space-y-3">
                            {services.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-gray-400 hover:text-sky-400 transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-sm font-semibold text-sky-400 uppercase tracking-wider mb-5">Contact Us</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <MapPin className="w-4 h-4 text-sky-400 mt-0.5 shrink-0" />
                                <span className="text-sm text-gray-400">123 Healthcare Avenue, Medical District, Dhaka, BD</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="w-4 h-4 text-sky-400 shrink-0" />
                                <a href="tel:+8801712345678" className="text-sm text-gray-400 hover:text-sky-400 transition-colors">+880 171 234 5678</a>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="w-4 h-4 text-sky-400 shrink-0" />
                                <a href="mailto:support@medicareconnect.com" className="text-sm text-gray-400 hover:text-sky-400 transition-colors">support@medicareconnect.com</a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 pt-6 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-gray-500">
                        &copy; {new Date().getFullYear()} MediCare Connect. All rights reserved.
                    </p>
                    <div className="flex items-center gap-5 text-sm text-gray-500">
                        <a href="#" className="hover:text-sky-400 transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-sky-400 transition-colors">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
