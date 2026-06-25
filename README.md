# MediCare Connect - Client

A modern, full-stack healthcare appointment and management system.

## 🚀 Features

- **Authentication**: JWT-based authentication using Better-Auth.
- **Role-based Dashboards**: Custom interfaces for Patients, Doctors, and Admins.
- **Doctor Discovery**: Search, filter by specialty, and sort by fee/rating.
- **Appointments**: Two-step booking modal with Stripe payment integration.
- **Analytics**: Admin dashboard with Recharts for visual data representation.
- **Dark Mode**: Fully supported using `next-themes`.
- **Animations**: Smooth transitions powered by Framer Motion.

## 🛠️ Tech Stack

- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Payments**: Stripe Checkout
- **Charts**: Recharts
- **Auth**: Better-Auth

## 📦 Setup & Run

1. Clone the repository and navigate to the client folder.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your `.env.local`:
   ```env
   NEXT_PUBLIC_SERVER_URL=http://localhost:5000
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 👥 User Roles & Demo Accounts

This project is pre-populated with a rich, relational database of doctors, patients, appointments, payments, reviews, and prescriptions. You can log in with any of the following credentials to test different user flows:

### 🔑 Administrator Account
* **Role**: Admin
* **Email**: `admin@medicare.com`
* **Password**: `Admin@12345`
* **Key Features**: View platform-wide statistics/charts (users, doctors, revenue, appointments), manage user accounts, verify or reject pending doctor applications.

### 🩺 Doctor Accounts
All doctors have pre-configured hospital affiliations, experience, consultation fees, and available slots.

| Name | Email | Password | Specialization | Verification Status | Features to Test |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Dr. John Doe** | `dr.john@medicare.com` | `Doctor@123` | Cardiology | Verified | View active appointments, issue prescriptions, read reviews. |
| **Dr. Sarah Jenkins** | `dr.sarah@medicare.com` | `Doctor@123` | Pediatrics | Verified | Manage appointments, view ratings. |
| **Dr. Robert Chen** | `dr.robert@medicare.com` | `Doctor@123` | Neurology | Verified | View prescription history, manage schedules. |
| **Dr. Lisa Wong** | `dr.lisa@medicare.com` | `Doctor@123` | General Medicine | Verified | Multi-day slot availability, view reviews. |
| **Dr. Alex Mercer** | `dr.alex@medicare.com` | `Doctor@123` | Dermatology | **Pending** | View the restricted "Pending Verification" screen. |

### 👤 Patient Accounts
These accounts contain mock health records, payment history, and scheduled bookings.

| Name | Email | Password | Existing Data / Patient History |
| :--- | :--- | :--- | :--- |
| **Emily Watson** | `patient.emily@medicare.com` | `Patient@123` | Has a completed appointment with Dr. John, a prescription for hypertension, and an active review. |
| **David Miller** | `patient.david@medicare.com` | `Patient@123` | Has a pending appointment with Dr. Sarah and a cancelled/refunded booking. |
| **James Wilson** | `patient.james@medicare.com` | `Patient@123` | Has a neurology consult history with Dr. Robert and a medication prescription. |
| **Sophia Martinez** | `patient.sophia@medicare.com` | `Patient@123` | Has a newly booked pending appointment with Dr. Lisa. |

