import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "react-hot-toast";

const inter = Inter({
    variable: "--font-inter",
    subsets: ["latin"],
});

export const metadata = {
    title: "MediCare Connect — Hospital Appointment & Healthcare Management",
    description: "Book appointments with verified doctors, manage your healthcare records, and receive quality medical care with MediCare Connect.",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${inter.variable} min-h-screen flex flex-col antialiased`}>
                <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
                    <Navbar />
                    <main className="flex-1">
                        {children}
                    </main>
                    <Footer />
                    <Toaster
                        position="top-right"
                        toastOptions={{
                            duration: 3500,
                            style: {
                                background: '#0ea5e9',
                                color: '#fff',
                                borderRadius: '10px',
                                fontWeight: '500',
                            },
                        }}
                    />
                </ThemeProvider>
            </body>
        </html>
    );
}
