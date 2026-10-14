import { createAuthClient } from "better-auth/react";
import {
  emailOTPClient,
  adminClient,
  multiSessionClient,
  usernameClient,
  phoneNumberClient,
  inferAdditionalFields,
} from "better-auth/client/plugins";

export const authClient = createAuthClient({});
export const { signIn, signUp, useSession } = createAuthClient({
  plugins: [
    emailOTPClient(),
    adminClient(),
    multiSessionClient(),
    usernameClient(),
    phoneNumberClient(),
    inferAdditionalFields({
      user: {
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
          required: false,
          returned: true,
          input: false,
        },

        coverImageUrl: {
          type: "string",
          required: false,
          returned: true,
          input: false,
        },
      },
    }),
  ],
});
