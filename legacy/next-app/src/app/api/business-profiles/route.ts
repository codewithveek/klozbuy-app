import { NextRequest } from "next/server";
import { BusinessProfileController } from "@/controllers/businessProfile.controller";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  try {
    return await BusinessProfileController.getAllBusinessProfiles(searchParams);
  } catch (error) {
    console.error("Failed to get all business profiles:", error);
    return new Response(
      JSON.stringify({ error: "Failed to get business profiles." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    return await BusinessProfileController.createBusinessProfile(body);
  } catch (error) {
    console.error(
      "Failed to parse request body for business profile creation:",
      error
    );
    return new Response(JSON.stringify({ error: "Invalid request body." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
}
