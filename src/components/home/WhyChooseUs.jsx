import { CheckCircle, Clock, Shield, HeartPulse, PhoneCall, FileText } from "lucide-react";

const features = [
    {
        icon: CheckCircle,
        title: "Verified Doctors",
        description: "Every doctor on our platform is thoroughly vetted and credentials-verified by our medical board.",
        color: "text-emerald-500",
        bg: "bg-emerald-50 dark:bg-emerald-900/20",
    },
    {
        icon: Clock,
        title: "24/7 Availability",
        description: "Book appointments around the clock. Our platform is available any time you need medical attention.",
        color: "text-sky-500",
        bg: "bg-sky-50 dark:bg-sky-900/20",
    },
    {
        icon: Shield,
        title: "Secure & Private",
        description: "Your health data is protected with end-to-end encryption and strict privacy controls.",
        color: "text-violet-500",
        bg: "bg-violet-50 dark:bg-violet-900/20",
    },
    {
        icon: HeartPulse,
        title: "Quality Care",
        description: "Connect with specialists across 25+ medical disciplines for comprehensive healthcare.",
        color: "text-rose-500",
        bg: "bg-rose-50 dark:bg-rose-900/20",
    },
    {
        icon: PhoneCall,
        title: "Easy Booking",
        description: "Book, reschedule, or cancel appointments in just a few taps — no phone calls needed.",
        color: "text-amber-500",
        bg: "bg-amber-50 dark:bg-amber-900/20",
    },
    {
        icon: FileText,
        title: "Digital Prescriptions",
        description: "Receive and manage your prescriptions digitally for easy access anytime, anywhere.",
        color: "text-cyan-500",
        bg: "bg-cyan-50 dark:bg-cyan-900/20",
    },
];

export default function WhyChooseUs() {
    return (
        <section className="py-16 bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                        Why Choose <span className="text-sky-500">MediCare Connect?</span>
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
                        We combine technology with compassion to deliver a seamless healthcare experience for every patient.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, i) => (
                        <div
                            key={i}
                            className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md hover:border-sky-200 dark:hover:border-sky-700 transition-all"
                        >
                            <div className={`${feature.bg} w-12 h-12 rounded-xl flex items-center justify-center mb-4`}>
                                <feature.icon className={`w-6 h-6 ${feature.color}`} />
                            </div>
                            <h3 className="font-bold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
