"use client";

import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { CreditCard, Lock, ArrowLeft } from "lucide-react";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

function CheckoutForm({ amount, doctorName, appointmentDate, onSuccess, onCancel, isLoading }) {
    const stripe = useStripe();
    const elements = useElements();
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        setProcessing(true);
        setError(null);

        try {
            const res = await fetch("/api/create-payment-intent", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount, doctorName, appointmentDate }),
            });

            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.error || "Failed to initialize payment");
            }

            const { clientSecret } = await res.json();

            const result = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement),
                },
            });

            if (result.error) {
                setError(result.error.message);
            }
            else if (result.paymentIntent.status === "succeeded") {
                onSuccess(result.paymentIntent.id);
            }
        }
        catch (err) {
            setError(err.message || "Payment failed. Please try again.");
        }
        finally {
            setProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="bg-sky-50 dark:bg-sky-900/20 rounded-xl p-4 border border-sky-100 dark:border-sky-800">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Consultation with</p>
                        <p className="font-semibold text-gray-900 dark:text-white">Dr. {doctorName}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-gray-500 dark:text-gray-400">Amount</p>
                        <p className="text-xl font-bold text-sky-600 dark:text-sky-400">${amount}</p>
                    </div>
                </div>
            </div>

            <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Card Details
                </label>
                <div className="px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                    <CardElement
                        options={{
                            style: {
                                base: {
                                    fontSize: "14px",
                                    color: "#374151",
                                    "::placeholder": { color: "#9ca3af" },
                                },
                                invalid: { color: "#ef4444" },
                            },
                            hidePostalCode: true,
                        }}
                    />
                </div>
                {error && (
                    <p className="text-xs text-red-500 mt-2">{error}</p>
                )}
            </div>

            <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
                <Lock className="w-3 h-3" />
                <span>Secured by Stripe. Your card data is never stored on our servers.</span>
            </div>

            <div className="flex gap-3">
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                </button>
                <button
                    type="submit"
                    disabled={!stripe || processing || isLoading}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-sky-500 hover:bg-sky-600 disabled:bg-sky-300 text-white font-semibold rounded-xl text-sm transition-all shadow-sm"
                >
                    {processing || isLoading ? (
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <CreditCard className="w-4 h-4" />
                    )}
                    {processing || isLoading ? "Processing..." : `Pay $${amount}`}
                </button>
            </div>
        </form>
    );
}

export default function PaymentForm(props) {
    return (
        <Elements stripe={stripePromise}>
            <CheckoutForm {...props} />
        </Elements>
    );
}
