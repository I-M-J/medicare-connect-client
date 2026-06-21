import DoctorDetailClient from "./DoctorDetailClient";

export async function generateMetadata({ params }) {
    const { id } = await params;
    return {
        title: "Doctor Details — MediCare Connect",
        description: "View doctor details, read reviews, and book your appointment online.",
    };
}

export default async function DoctorDetailPage({ params }) {
    const { id } = await params;
    const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

    let doctor = null;
    let reviews = [];

    try {
        const [docRes, revRes] = await Promise.all([
            fetch(`${SERVER_URL}/doctors/${id}`, { cache: "no-store" }),
            fetch(`${SERVER_URL}/reviews?doctorId=${id}`, { cache: "no-store" }),
        ]);

        if (docRes.ok) doctor = await docRes.json();
        if (revRes.ok) reviews = await revRes.json();
    }
    catch (err) {
        console.error("Error fetching doctor details:", err);
    }

    if (!doctor || !doctor._id) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
                <div className="text-center">
                    <div className="text-5xl mb-4">🩺</div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Doctor not found</h2>
                    <p className="text-gray-500">This doctor profile may no longer be available.</p>
                </div>
            </div>
        );
    }

    return <DoctorDetailClient doctor={doctor} reviews={reviews} />;
}
