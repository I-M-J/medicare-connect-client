import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function DashboardPage() {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) {
        redirect("/login");
    }

    const role = session.user?.role || "patient";

    if (role === "admin") {
        redirect("/dashboard/admin");
    } else if (role === "doctor") {
        redirect("/dashboard/doctor");
    } else {
        redirect("/dashboard/patient");
    }
}
