import { locations } from "@/db/schemas/users-schema"; // Adjusted path
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";
import { z } from "zod/v4";

export type Location = typeof locations.$inferSelect;
export type NewLocation = typeof locations.$inferInsert;

export const CreateLocationSchema = createInsertSchema(locations, {
  userId: z.string().length(36),
  address: z.string().min(5).max(255),
  city: z.string().min(2).max(100),
  state: z.string().min(2).max(100),
  country: z.string().min(2).max(100),
  postalCode: z.string().min(3).max(20).optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const UpdateLocationSchema = createUpdateSchema(locations, {
  id: z.string().length(36).optional(),
});

export const SelectLocationSchema = createSelectSchema(locations);

export type CreateLocationInput = z.infer<typeof CreateLocationSchema>;
export type UpdateLocationInput = z.infer<typeof UpdateLocationSchema>;
export type LocationResponse = z.infer<typeof SelectLocationSchema>;
