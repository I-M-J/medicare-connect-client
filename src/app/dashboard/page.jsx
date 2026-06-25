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

    try {
        const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
        await fetch(`${SERVER_URL}/users/sync-role`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: session.user.email }),
        });
    } catch (error) {
        console.error("Failed to sync user role:", error);
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
