import "server-only";
import { db } from "@/db";
import { locations } from "@/db/schemas/users-schema";
import {
  CreateLocationInput,
  UpdateLocationInput,
  Location,
} from "@/models/location.model";
import { eq, sql, and } from "drizzle-orm";

export class LocationService {
  static async getLocationById(id: string): Promise<Location | null> {
    const location = await db.query.locations.findFirst({
      where: eq(locations.id, id),
    });
    return location || null;
  }

  static async getLocationsByUserId(userId: string): Promise<Location[]> {
    const userLocations = await db.query.locations.findMany({
      where: eq(locations.userId, userId),
      orderBy: locations.createdAt,
    });
    return userLocations;
  }

  static async getAllLocations(
    limit: number = 10,
    offset: number = 0
  ): Promise<Location[]> {
    const allLocations = await db.query.locations.findMany({
      limit: limit,
      offset: offset,
      orderBy: locations.createdAt,
    });
    return allLocations;
  }

  static async createLocation(
    locationData: CreateLocationInput
  ): Promise<Location> {
    const newLocation = await db.transaction(async (tx) => {
      const [returned] = await tx
        .insert(locations)
        .values(locationData)
        .$returningId();

      return await tx.query.locations.findFirst({
        where(fields, { eq }) {
          return eq(fields.id, returned.id);
        },
      });
    });
    if (!newLocation) {
      throw new Error("Failed to create location.");
    }
    return newLocation;
  }

  static async updateLocation(
    id: string,
    updateData: UpdateLocationInput
  ): Promise<Location | null> {
    const updatedLocation = await db.transaction(async (tx) => {
      await tx
        .update(locations)
        .set({ ...updateData, updatedAt: sql`CURRENT_TIMESTAMP` })
        .where(eq(locations.id, id));

      return await tx.query.locations.findFirst({
        where(fields, { eq }) {
          return eq(fields.id, id);
        },
      });
    });
    return updatedLocation || null;
  }

  static async deleteLocation(id: string): Promise<boolean> {
    const result = await db.delete(locations).where(eq(locations.id, id));
    return result[0].affectedRows > 0;
  }

  // Example: Deactivate a location
  static async deactivateLocation(id: string): Promise<Location | null> {
    const deactivatedLocation = await db.transaction(async (tx) => {
      await tx
        .update(locations)
        .set({ isActive: false, updatedAt: sql`CURRENT_TIMESTAMP` })
        .where(eq(locations.id, id));

      return await tx.query.locations.findFirst({
        where(fields, { eq }) {
          return eq(fields.id, id);
        },
      });
    });
    return deactivatedLocation || null;
  }
}
