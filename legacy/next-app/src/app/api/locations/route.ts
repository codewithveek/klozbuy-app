import { NextRequest } from "next/server";
import { LocationController } from "@/controllers/location.controller";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  // This endpoint might be used to get all locations, or locations for a specific user.
  // We'll prioritize userId if provided.
  const userId = searchParams.get("userId");
  if (userId) {
    return await LocationController.getLocationsByUserId(userId);
  }
  return await LocationController.getAllLocations(searchParams);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    return await LocationController.createLocation(body);
  } catch (error) {
    console.error("Failed to parse request body for location creation:", error);
    return new Response(JSON.stringify({ error: "Invalid request body." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
}
