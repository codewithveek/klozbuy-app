import {
  CreateBusinessProfileInput,
  UpdateBusinessProfileInput,
  CreateBusinessProfileSchema,
  UpdateBusinessProfileSchema,
} from "@/models/businessProfile.model";
import { BusinessProfileService } from "@/services/businessProfile.service";
import { NextResponse } from "next/server";
import { ZodError, z } from "zod/v4";

export class BusinessProfileController {
  static async getBusinessProfileById(id: string): Promise<NextResponse> {
    try {
      if (!id)
        return NextResponse.json(
          { error: "Business Profile ID is required." },
          { status: 400 }
        );
      const profile = await BusinessProfileService.getBusinessProfileById(id);
      if (!profile)
        return NextResponse.json(
          { error: "Business Profile not found." },
          { status: 404 }
        );
      return NextResponse.json(profile, { status: 200 });
    } catch (error) {
      console.error("Error fetching business profile by ID:", error);
      return NextResponse.json(
        { error: "Internal server error." },
        { status: 500 }
      );
    }
  }

  static async getBusinessProfileByUserId(
    userId: string
  ): Promise<NextResponse> {
    try {
      if (!userId)
        return NextResponse.json(
          { error: "User ID is required." },
          { status: 400 }
        );
      const profile = await BusinessProfileService.getBusinessProfileByUserId(
        userId
      );
      if (!profile)
        return NextResponse.json(
          { error: "Business Profile not found for this user." },
          { status: 404 }
        );
      return NextResponse.json(profile, { status: 200 });
    } catch (error) {
      console.error("Error fetching business profile by User ID:", error);
      return NextResponse.json(
        { error: "Internal server error." },
        { status: 500 }
      );
    }
  }

  static async getAllBusinessProfiles(
    searchParams: URLSearchParams
  ): Promise<NextResponse> {
    try {
      const limit = parseInt(searchParams.get("limit") || "10", 10);
      const offset = parseInt(searchParams.get("offset") || "0", 10);
      if (isNaN(limit) || limit <= 0 || isNaN(offset) || offset < 0) {
        return NextResponse.json(
          { error: "Invalid limit or offset parameters." },
          { status: 400 }
        );
      }
      const profiles = await BusinessProfileService.getAllBusinessProfiles(
        limit,
        offset
      );
      return NextResponse.json(profiles, { status: 200 });
    } catch (error) {
      console.error("Error fetching all business profiles:", error);
      return NextResponse.json(
        { error: "Internal server error." },
        { status: 500 }
      );
    }
  }

  static async createBusinessProfile(
    requestBody: CreateBusinessProfileInput
  ): Promise<NextResponse> {
    try {
      const validatedData = CreateBusinessProfileSchema.parse(requestBody);
      const existingProfile =
        await BusinessProfileService.getBusinessProfileByUserId(
          validatedData.userId
        );
      if (existingProfile) {
        return NextResponse.json(
          { error: "A business profile already exists for this user." },
          { status: 409 }
        );
      }
      const newProfile = await BusinessProfileService.createBusinessProfile(
        validatedData
      );
      return NextResponse.json(newProfile, { status: 201 });
    } catch (error) {
      if (error instanceof ZodError) {
        return NextResponse.json(
          { error: "Validation failed.", details: error.issues },
          { status: 400 }
        );
      }
      console.error("Error creating business profile:", error);
      return NextResponse.json(
        { error: "Internal server error." },
        { status: 500 }
      );
    }
  }

  static async updateBusinessProfile(
    id: string,
    requestBody: UpdateBusinessProfileInput
  ): Promise<NextResponse> {
    try {
      if (!id)
        return NextResponse.json(
          { error: "Business Profile ID is required." },
          { status: 400 }
        );
      const validatedData = UpdateBusinessProfileSchema.parse(requestBody);
      const updatedProfile = await BusinessProfileService.updateBusinessProfile(
        id,
        validatedData
      );
      if (!updatedProfile)
        return NextResponse.json(
          { error: "Business Profile not found or nothing to update." },
          { status: 404 }
        );
      return NextResponse.json(updatedProfile, { status: 200 });
    } catch (error) {
      if (error instanceof ZodError) {
        return NextResponse.json(
          { error: "Validation failed.", details: error.issues },
          { status: 400 }
        );
      }
      console.error("Error updating business profile:", error);
      return NextResponse.json(
        { error: "Internal server error." },
        { status: 500 }
      );
    }
  }

  static async deleteBusinessProfile(id: string): Promise<NextResponse> {
    try {
      if (!id)
        return NextResponse.json(
          { error: "Business Profile ID is required." },
          { status: 400 }
        );
      const deleted = await BusinessProfileService.deleteBusinessProfile(id);
      if (!deleted)
        return NextResponse.json(
          { error: "Business Profile not found or could not be deleted." },
          { status: 404 }
        );
      return NextResponse.json(
        { message: "Business Profile deleted successfully." },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error deleting business profile:", error);
      return NextResponse.json(
        { error: "Internal server error." },
        { status: 500 }
      );
    }
  }
}
