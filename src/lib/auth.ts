import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { apiKey } from "@better-auth/api-key";
import { prisma } from "../db";
import redis_client from "./redis";
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  baseURL: process.env.BETTER_AUTH_URL,
  trustedOrigins: [process.env.FRONTEND_URL!],
  advanced: {
    useSecureCookies: true,
    defaultCookieAttributes: {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      path: "/",
    },
  },
  secondaryStorage: {
    get: async (key) => {
      return await redis_client.get(key);
    },
    set: async (key, value, ttl) => {
      if (ttl) await redis_client.set(key, value, { EX: ttl });
      else await redis_client.set(key, value);
    },
    delete: async (key) => {
      await redis_client.del(key);
    },
  },
  session: {
    storeSessionInDatabase: true,
  },
  plugins: [
    apiKey({
      storage: "secondary-storage",
      fallbackToDatabase: true,
    }),
  ],
  emailAndPassword: {
    enabled: true,
  },
  user: {
    deleteUser: {
      enabled: true,
    },
    additionalFields: {
      role: {
        type: ["user", "admin", "super_admin"],
        required: false,
        default: "user",
        input: false,
      },
    },
  },
});
