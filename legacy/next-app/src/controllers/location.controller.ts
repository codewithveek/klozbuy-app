import {
  CreateLocationInput,
  UpdateLocationInput,
  CreateLocationSchema,
  UpdateLocationSchema,
} from "@/models/location.model";
import { LocationService } from "@/services/location.service";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

export class LocationController {
  static async getLocationById(id: string): Promise<NextResponse> {
    try {
      if (!id)
        return NextResponse.json(
          { error: "Location ID is required." },
          { status: 400 }
        );
      const location = await LocationService.getLocationById(id);
      if (!location)
        return NextResponse.json(
          { error: "Location not found." },
          { status: 404 }
        );
      return NextResponse.json(location, { status: 200 });
    } catch (error) {
      console.error("Error fetching location by ID:", error);
      return NextResponse.json(
        { error: "Internal server error." },
        { status: 500 }
      );
    }
  }

  static async getLocationsByUserId(userId: string): Promise<NextResponse> {
    try {
      if (!userId)
        return NextResponse.json(
          { error: "User ID is required." },
          { status: 400 }
        );
      const locations = await LocationService.getLocationsByUserId(userId);
      return NextResponse.json(locations, { status: 200 });
    } catch (error) {
      console.error("Error fetching locations by User ID:", error);
      return NextResponse.json(
        { error: "Internal server error." },
        { status: 500 }
      );
    }
  }

  static async getAllLocations(
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
      const locations = await LocationService.getAllLocations(limit, offset);
      return NextResponse.json(locations, { status: 200 });
    } catch (error) {
      console.error("Error fetching all locations:", error);
      return NextResponse.json(
        { error: "Internal server error." },
        { status: 500 }
      );
    }
  }

  static async createLocation(
    requestBody: CreateLocationInput
  ): Promise<NextResponse> {
    try {
      const validatedData = CreateLocationSchema.parse(requestBody);
      const newLocation = await LocationService.createLocation(validatedData);
      return NextResponse.json(newLocation, { status: 201 });
    } catch (error) {
      if (error instanceof ZodError) {
        return NextResponse.json(
          { error: "Validation failed.", details: error.issues },
          { status: 400 }
        );
      }
      console.error("Error creating location:", error);
      return NextResponse.json(
        { error: "Internal server error." },
        { status: 500 }
      );
    }
  }

  static async updateLocation(
    id: string,
    requestBody: UpdateLocationInput
  ): Promise<NextResponse> {
    try {
      if (!id)
        return NextResponse.json(
          { error: "Location ID is required." },
          { status: 400 }
        );
      const validatedData = UpdateLocationSchema.parse(requestBody);
      const updatedLocation = await LocationService.updateLocation(
        id,
        validatedData
      );
      if (!updatedLocation)
        return NextResponse.json(
          { error: "Location not found or nothing to update." },
          { status: 404 }
        );
      return NextResponse.json(updatedLocation, { status: 200 });
    } catch (error) {
      if (error instanceof ZodError) {
        return NextResponse.json(
          { error: "Validation failed.", details: error.issues },
          { status: 400 }
        );
      }
      console.error("Error updating location:", error);
      return NextResponse.json(
        { error: "Internal server error." },
        { status: 500 }
      );
    }
  }

  static async deleteLocation(id: string): Promise<NextResponse> {
    try {
      if (!id)
        return NextResponse.json(
          { error: "Location ID is required." },
          { status: 400 }
        );
      const deleted = await LocationService.deleteLocation(id);
      if (!deleted)
        return NextResponse.json(
          { error: "Location not found or could not be deleted." },
          { status: 404 }
        );
      return NextResponse.json(
        { message: "Location deleted successfully." },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error deleting location:", error);
      return NextResponse.json(
        { error: "Internal server error." },
        { status: 500 }
      );
    }
  }
}
