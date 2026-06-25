# 🏥 MediCare Connect - Client Application

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-38B2AC?logo=tailwind-css)
![Better-Auth](https://img.shields.io/badge/Better--Auth-Security-blue)
![Stripe](https://img.shields.io/badge/Stripe-Payments-6772E5?logo=stripe)

A modern, highly responsive, and full-stack healthcare appointment and management system designed to seamlessly connect patients, doctors, and administrators. Built with Next.js App Router, this application prioritizes user experience, security, and performance.

## ✨ Key Features

- **Robust Authentication**: Secure, modern authentication powered by Better-Auth with JWTs. Supports both Email/Password and Google OAuth seamless sign-ins.
- **Role-Based Dashboards**: 
  - **Patients**: Manage bookings, view medical records, prescriptions, and payment history.
  - **Doctors**: Manage schedules, approve appointments, issue prescriptions, and view patient reviews.
  - **Admins**: Platform oversight with comprehensive analytics, user management, and doctor verification.
- **Advanced Discovery**: Powerful search and filtering capabilities to find doctors by specialty, fee, and user ratings.
- **Integrated Payments**: Frictionless two-step booking modal with secure Stripe payment processing.
- **Data Visualization**: Interactive and insightful Admin dashboard charts powered by Recharts.
- **Modern UI/UX**: Fully responsive design with Next-Themes for seamless Dark/Light mode switching and Framer Motion for fluid micro-animations.

## 🛠️ Tech Stack

- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS & Framer Motion
- **Icons**: Lucide React
- **Payments Integration**: Stripe Checkout
- **Data Visualization**: Recharts
- **Authentication**: Better-Auth

## 📦 Local Setup & Installation

1. Clone the repository and navigate to the client directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your environment variables by creating a `.env.local` file:
   ```env
   NEXT_PUBLIC_SERVER_URL=http://localhost:5000
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 👥 Demo Accounts & User Roles

This project is pre-populated with a rich, relational database to demonstrate real-world usage. You can log in with any of the following credentials to explore different user flows:

### 🔑 Administrator
* **Email**: `admin@medicare.com`
* **Password**: `Admin@12345`
* **Features**: View platform-wide statistics (users, doctors, revenue, appointments), manage accounts, and verify pending doctor applications.

### 🩺 Doctors
All doctors have pre-configured hospital affiliations, experience, consultation fees, and available slots.

| Name | Email | Password | Specialization | Status | Key Features to Test |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Dr. John Doe** | `dr.john@medicare.com` | `Doctor@123` | Cardiology | Verified | View active appointments, issue prescriptions. |
| **Dr. Sarah Jenkins**| `dr.sarah@medicare.com`| `Doctor@123` | Pediatrics | Verified | Manage appointments, view patient ratings. |
| **Dr. Robert Chen** | `dr.robert@medicare.com` | `Doctor@123` | Neurology | Verified | View prescription history, manage schedules. |
| **Dr. Lisa Wong** | `dr.lisa@medicare.com` | `Doctor@123` | General Medicine | Verified | Multi-day slot availability. |
| **Dr. Alex Mercer** | `dr.alex@medicare.com` | `Doctor@123` | Dermatology | **Pending** | View the restricted "Pending Verification" screen. |

### 👤 Patients
These accounts contain mock health records, payment history, and scheduled bookings.

| Name | Email | Password | Patient History |
| :--- | :--- | :--- | :--- |
| **Emily Watson** | `patient.emily@medicare.com` | `Patient@123` | Completed appointment with Dr. John, active prescription, and review. |
| **David Miller** | `patient.david@medicare.com` | `Patient@123` | Pending appointment with Dr. Sarah and a refunded booking. |
| **James Wilson** | `patient.james@medicare.com` | `Patient@123` | Neurology consult history with Dr. Robert and medication prescription. |
| **Sophia Martinez**| `patient.sophia@medicare.com`| `Patient@123` | Newly booked pending appointment with Dr. Lisa. |

---
*Designed and built as a comprehensive portfolio project showcasing modern full-stack development best practices.*
