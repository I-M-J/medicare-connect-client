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

## 👥 User Roles

- **Patient**: Can search doctors, book appointments, make payments, and leave reviews.
- **Doctor**: Can set availability, manage appointment requests, and write prescriptions.
- **Admin**: Verifies doctors, manages users, and views platform analytics.
