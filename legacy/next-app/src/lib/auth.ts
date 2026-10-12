import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db"; // your drizzle instance
import * as schema from "@/db/schemas";
import {
  admin,
  emailOTP,
  multiSession,
  phoneNumber,
  username,
} from "better-auth/plugins";
import {
  isUsernameDisallowed,
  isUsernameSimilarToDisallowed,
} from "./constants/disallowed";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "mysql",
    usePlural: true,
    schema: schema,
  }),
  user: {
    additionalFields: {
      firstName: {
        type: "string",
        required: true,
        returned: true,
      },
      lastName: {
        type: "string",
        required: true,
        returned: true,
      },
      bio: {
        type: "string",
        required: true,
        returned: true,
      },

      coverImageUrl: {
        type: "string",
        required: false,
        returned: true,
      },
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day (every 1 day the session expiration is updated)
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // Cache duration in seconds
    },
  },
  plugins: [
    admin(),
    phoneNumber(),
    multiSession(),
    username({
      usernameValidator: (username) => {
        if (
          isUsernameDisallowed(username) ||
          isUsernameSimilarToDisallowed(username)
        ) {
          return false;
        }
        return true;
      },
    }),
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        if (type === "sign-in") {
          // Send the OTP for sign-in
        } else if (type === "email-verification") {
          // Send the OTP for email verification
        } else {
          // Send the OTP for password reset
        }
      },
    }),
  ],
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      mapProfileToUser: (profile) => {
        return {
          firstName: profile.given_name,
          lastName: profile.family_name,
        };
      },
    },
    facebook: {
      clientId: process.env.FACEBOOK_CLIENT_ID as string,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
      mapProfileToUser: (profile) => {
        return {
          firstName: profile.name.split(" ")[0],
          lastName: profile.name.split(" ")[1],
        };
      },
    },
  },
});
