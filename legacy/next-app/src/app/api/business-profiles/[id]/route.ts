import { NextRequest } from "next/server";
import { BusinessProfileController } from "@/controllers/businessProfile.controller";

interface BusinessProfileRouteParams {
  params: {
    id: string;
  };
}

export async function GET(
  request: NextRequest,
  { params }: BusinessProfileRouteParams
) {
  return await BusinessProfileController.getBusinessProfileById(params.id);
}

export async function PUT(
  request: NextRequest,
  { params }: BusinessProfileRouteParams
) {
  try {
    const body = await request.json();
    return await BusinessProfileController.updateBusinessProfile(
      params.id,
      body
    );
  } catch (error) {
    console.error(
      `Failed to parse request body for business profile update (ID: ${params.id}):`,
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
  { params }: BusinessProfileRouteParams
) {
  return await BusinessProfileController.deleteBusinessProfile(params.id);
}
