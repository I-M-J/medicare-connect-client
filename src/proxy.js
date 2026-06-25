import { NextResponse } from "next/server";
import { betterFetch } from "@better-fetch/fetch";

export async function proxy(request) {
    const { data: session } = await betterFetch("/api/auth/get-session", {
        baseURL: request.nextUrl.origin,
        headers: {
            cookie: request.headers.get("cookie") || "",
        },
    });

    const { pathname } = request.nextUrl;

    // Protected dashboard routes
    if (pathname.startsWith("/dashboard")) {
        if (!session) {
            return NextResponse.redirect(new URL("/login", request.url));
        }

        const role = session.user?.role || "patient";

        // Root dashboard redirect
        if (pathname === "/dashboard" || pathname === "/dashboard/") {
            if (role === "admin") {
                return NextResponse.redirect(new URL("/dashboard/admin", request.url));
            }
            if (role === "doctor") {
                return NextResponse.redirect(new URL("/dashboard/doctor", request.url));
            }
            return NextResponse.redirect(new URL("/dashboard/patient", request.url));
        }

        // Admin guard
        if (pathname.startsWith("/dashboard/admin") && role !== "admin") {
            return NextResponse.redirect(new URL("/unauthorized", request.url));
        }

        // Doctor guard (exempting /dashboard/doctor/profile so patients can register as doctors)
        if (
            pathname.startsWith("/dashboard/doctor") &&
            !pathname.startsWith("/dashboard/doctor/profile") &&
            role !== "doctor" &&
            role !== "admin"
        ) {
            return NextResponse.redirect(new URL("/unauthorized", request.url));
        }

        // Patient guard
        if (pathname.startsWith("/dashboard/patient") && role !== "patient") {
            return NextResponse.redirect(new URL("/unauthorized", request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard", "/dashboard/:path*"],
};
