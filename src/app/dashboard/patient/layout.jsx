import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

const patientNavItems = [
    { href: "/dashboard/patient", label: "Overview", icon: "LayoutDashboard" },
    { href: "/dashboard/patient/appointments", label: "My Appointments", icon: "CalendarCheck" },
    { href: "/dashboard/patient/payment-history", label: "Payment History", icon: "CreditCard" },
    { href: "/dashboard/patient/reviews", label: "My Reviews", icon: "Star" },
    { href: "/dashboard/patient/profile", label: "My Profile", icon: "User" },
];

export default function PatientDashboardLayout({ children }) {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex">
            <DashboardSidebar navItems={patientNavItems} role="patient" />
            <main className="flex-1 min-w-0 p-6 lg:p-8 relative">
                {children}
            </main>
        </div>
    );
}
