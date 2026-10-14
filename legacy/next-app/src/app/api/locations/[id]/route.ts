import { NextRequest } from "next/server";
import { LocationController } from "@/controllers/location.controller";

interface LocationRouteParams {
  params: {
    id: string;
  };
}

export async function GET(
  request: NextRequest,
  { params }: LocationRouteParams
) {
  return await LocationController.getLocationById(params.id);
}

export async function PUT(
  request: NextRequest,
  { params }: LocationRouteParams
) {
  try {
    const body = await request.json();
    return await LocationController.updateLocation(params.id, body);
  } catch (error) {
    console.error(
      `Failed to parse request body for location update (ID: ${params.id}):`,
      error
    );
    return new Response(JSON.stringify({ error: "Invalid request body." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: LocationRouteParams
) {
  return await LocationController.deleteLocation(params.id);
}
