import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { MongoClient } from "mongodb";
import { nextCookies } from "better-auth/next-js";

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
    plugins: [nextCookies()],
    session: {
        cookieCache: {
            enabled: true,
            maxAge: 5 * 60,
        },
    },
    jwt: {
        enabled: true,
    },
});
