import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

const doctorNavItems = [
    { href: "/dashboard/doctor", label: "Overview", icon: "LayoutDashboard" },
    { href: "/dashboard/doctor/appointments", label: "Appointments", icon: "CalendarCheck" },
    { href: "/dashboard/doctor/prescriptions", label: "Prescriptions", icon: "FileText" },
    { href: "/dashboard/doctor/profile", label: "My Profile", icon: "User" },
    { href: "/dashboard/profile", label: "Account Settings", icon: "Settings" },
];

export default function DoctorDashboardLayout({ children }) {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex">
            <DashboardSidebar navItems={doctorNavItems} role="doctor" />
            <main className="flex-1 min-w-0 p-6 lg:p-8 relative">
                {children}
            </main>
        </div>
    );
}
