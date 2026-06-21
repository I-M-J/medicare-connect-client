import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { headers } from "next/headers";

export async function middleware(request) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    const { pathname } = request.nextUrl;

    // protected dashboard routes
    if (pathname.startsWith("/dashboard")) {
        if (!session) {
            return NextResponse.redirect(new URL("/login", request.url));
        }

        // admin guard
        if (pathname.startsWith("/dashboard/admin") && session.user?.role !== "admin") {
            return NextResponse.redirect(new URL("/unauthorized", request.url));
        }

        // doctor guard
        if (pathname.startsWith("/dashboard/doctor") && session.user?.role !== "doctor" && session.user?.role !== "admin") {
            return NextResponse.redirect(new URL("/unauthorized", request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*"],
};
