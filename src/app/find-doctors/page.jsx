import FindDoctorsClient from "./FindDoctorsClient";

export const metadata = {
    title: "Find Doctors — MediCare Connect",
    description: "Search and filter verified doctors by specialization, name, or fee. Book your appointment in minutes.",
};

export default function FindDoctorsPage() {
    return <FindDoctorsClient />;
}
