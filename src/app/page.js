import Banner from "@/components/home/Banner";
import FeaturedDoctors from "@/components/home/FeaturedDoctors";
import Specializations from "@/components/home/Specializations";
import PlatformStats from "@/components/home/PlatformStats";
import Testimonials from "@/components/home/Testimonials";
import WhyChooseUs from "@/components/home/WhyChooseUs";

export const metadata = {
    title: "MediCare Connect — Your Trusted Healthcare Platform",
    description: "Book appointments with verified doctors, manage your health records, and receive quality care online.",
};

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

async function getFeaturedDoctors() {
    try {
        const res = await fetch(`${SERVER_URL}/doctors/featured`, { cache: "no-store" });
        if (!res.ok) return [];
        return res.json();
    }
    catch {
        return [];
    }
}

async function getStats() {
    try {
        const res = await fetch(`${SERVER_URL}/stats`, { cache: "no-store" });
        if (!res.ok) return {};
        return res.json();
    }
    catch {
        return {};
    }
}

async function getTestimonials() {
    try {
        const res = await fetch(`${SERVER_URL}/reviews?limit=6`, { cache: "no-store" });
        if (!res.ok) return [];
        return res.json();
    }
    catch {
        return [];
    }
}

export default async function HomePage() {
    const [doctors, stats, testimonials] = await Promise.all([
        getFeaturedDoctors(),
        getStats(),
        getTestimonials(),
    ]);

    return (
        <div>
            <Banner />
            <PlatformStats stats={stats} />
            <Specializations />
            <FeaturedDoctors doctors={doctors} />
            <WhyChooseUs />
            <Testimonials testimonials={testimonials} />
        </div>
    );
}
