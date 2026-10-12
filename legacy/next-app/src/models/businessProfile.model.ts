import { businessProfiles } from "@/db/schemas/users-schema"; // Adjusted path
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";
import { z } from "zod/v4";

export type BusinessProfile = typeof businessProfiles.$inferSelect;
export type NewBusinessProfile = typeof businessProfiles.$inferInsert;

export const CreateBusinessProfileSchema = createInsertSchema(
  businessProfiles,
  {
    businessName: z.string().min(2).max(100),
    businessCategory: z.string().min(2).max(50),
    userId: z.string().length(36), // Ensure userId is provided for creation
  }
).omit({
  id: true,
  isVerified: true,
  reviewsCount: true,
  averageRating: true,
  verificationStatus: true,
  verifiedAt: true,
  createdAt: true,
  updatedAt: true,
});

export const UpdateBusinessProfileSchema = createUpdateSchema(
  businessProfiles,
  {
    id: z.string().length(36).optional(), // Can be omitted as it's from path
  }
);

export const SelectBusinessProfileSchema = createSelectSchema(businessProfiles);

export type CreateBusinessProfileInput = z.infer<
  typeof CreateBusinessProfileSchema
>;
export type UpdateBusinessProfileInput = z.infer<
  typeof UpdateBusinessProfileSchema
>;
export type BusinessProfileResponse = z.infer<
  typeof SelectBusinessProfileSchema
>;
