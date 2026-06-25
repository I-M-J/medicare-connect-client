import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

const adminNavItems = [
    { href: "/dashboard/admin", label: "Overview", icon: "LayoutDashboard" },
    { href: "/dashboard/admin/users", label: "Manage Users", icon: "Users" },
    { href: "/dashboard/admin/doctors", label: "Manage Doctors", icon: "Stethoscope" },
    { href: "/dashboard/admin/appointments", label: "Appointments", icon: "CalendarCheck" },
    { href: "/dashboard/admin/payments", label: "Payments", icon: "CreditCard" },
    { href: "/dashboard/admin/analytics", label: "Analytics", icon: "BarChart2" },
    { href: "/dashboard/admin/profile", label: "Profile", icon: "User" },
];

export default async function AdminDashboardLayout({ children }) {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) {
        redirect("/login");
    }

    if (session.user?.role !== "admin") {
        redirect("/unauthorized");
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex">
            <DashboardSidebar navItems={adminNavItems} role="admin" />
            <main className="flex-1 min-w-0 p-6 lg:p-8 relative">
                {children}
            </main>
        </div>
    );
}
