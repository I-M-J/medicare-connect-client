import Stripe from "stripe";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { amount, doctorName, appointmentDate } = body;

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100),
            currency: "usd",
            metadata: {
                doctorName,
                appointmentDate,
                patientEmail: session.user.email,
            },
        });

        return Response.json({ clientSecret: paymentIntent.client_secret });
    }
    catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
}
