import "server-only";
import { db } from "@/db";
import { businessProfiles } from "@/db/schemas/users-schema";
import {
  CreateBusinessProfileInput,
  UpdateBusinessProfileInput,
  BusinessProfile,
} from "@/models/businessProfile.model";
import { eq, sql } from "drizzle-orm";

export class BusinessProfileService {
  static async getBusinessProfileById(
    id: string
  ): Promise<BusinessProfile | null> {
    const profile = await db.query.businessProfiles.findFirst({
      where: eq(businessProfiles.id, id),
    });
    return profile || null;
  }

  static async getBusinessProfileByUserId(
    userId: string
  ): Promise<BusinessProfile | null> {
    const profile = await db.query.businessProfiles.findFirst({
      where: eq(businessProfiles.userId, userId),
    });
    return profile || null;
  }

  static async getAllBusinessProfiles(
    limit: number = 10,
    offset: number = 0
  ): Promise<BusinessProfile[]> {
    const allProfiles = await db.query.businessProfiles.findMany({
      limit: limit,
      offset: offset,
      orderBy: businessProfiles.createdAt,
    });
    return allProfiles;
  }

  static async createBusinessProfile(
    profileData: CreateBusinessProfileInput
  ): Promise<BusinessProfile> {
    const newProfile = await db.transaction(async (tx) => {
      const [returned] = await tx
        .insert(businessProfiles)
        .values(profileData)
        .$returningId();

      return await tx.query.businessProfiles.findFirst({
        where(fields, { eq }) {
          return eq(fields.id, returned.id);
        },
      });
    });
    if (!newProfile) {
      throw new Error("Failed to create business profile.");
    }
    return newProfile;
  }

  static async updateBusinessProfile(
    id: string,
    updateData: UpdateBusinessProfileInput
  ): Promise<BusinessProfile | null> {
    const updatedProfile = await db.transaction(async (tx) => {
      await tx
        .update(businessProfiles)
        .set({ ...updateData, updatedAt: sql`CURRENT_TIMESTAMP` })
        .where(eq(businessProfiles.id, id));

      return await tx.query.businessProfiles.findFirst({
        where(fields, { eq }) {
          return eq(fields.id, id);
        },
      });
    });
    return updatedProfile || null;
  }

  static async deleteBusinessProfile(id: string): Promise<boolean> {
    const result = await db
      .delete(businessProfiles)
      .where(eq(businessProfiles.id, id));
    return result[0].affectedRows > 0;
  }
}
