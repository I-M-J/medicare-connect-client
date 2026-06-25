import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { MongoClient } from "mongodb";
import { nextCookies } from "better-auth/next-js";
import { jwt } from "better-auth/plugins";

const client = new MongoClient(process.env.MONGODB_URI);

export const auth = betterAuth({
    database: mongodbAdapter(client.db("medicare_connect_db")),
    emailAndPassword: {
        enabled: true,
        minPasswordLength: 6,
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        },
    },
    user: {
        additionalFields: {
            role: {
                type: "string",
                defaultValue: "patient",
            },
            phone: {
                type: "string",
                required: false,
            },
            gender: {
                type: "string",
                required: false,
            },
            status: {
                type: "string",
                defaultValue: "active",
            },
        },
    },
    secret: process.env.BETTER_AUTH_SECRET,
    baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
    plugins: [jwt(), nextCookies()],
    session: {
        cookieCache: {
            enabled: true,
            maxAge: 5 * 60,
        },
    },
});

// Seed admin account programmatically in Better-Auth
if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
    const seedAdminAuth = async () => {
        try {
            const db = client.db("medicare_connect_db");
            const adminEmail = process.env.ADMIN_EMAIL;
            const existingUser = await db.collection("user").findOne({ email: adminEmail });
            if (!existingUser) {
                console.log("Seeding admin account in Better-Auth...");
                await auth.api.signUpEmail({
                    body: {
                        email: adminEmail,
                        password: process.env.ADMIN_PASSWORD,
                        name: "MediCare Admin",
                    }
                });
                console.log("Admin account created in Better-Auth.");
            }
            // Ensure the role is set to 'admin' in both collections
            await db.collection("user").updateOne({ email: adminEmail }, { $set: { role: "admin" } });
            await db.collection("users").updateOne(
                { email: adminEmail },
                {
                    $set: {
                        name: "MediCare Admin",
                        role: "admin",
                        status: "active",
                        updatedAt: new Date()
                    }
                },
                { upsert: true }
            );
            console.log("Admin role and record synchronized successfully.");
        } catch (err) {
            console.error("Better-Auth Admin Seeding Error:", err.message);
        }
    };
    seedAdminAuth();
}
