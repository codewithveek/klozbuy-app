import { NextRequest } from "next/server";
import { FollowController } from "@/controllers/follow.controller";

interface UserFollowingRouteParams {
  params: {
    userId: string;
  };
}

/**
 * Handles GET requests to retrieve users that a specific user is following.
 * @param request The NextRequest object.
 * @param params Route params containing the userId.
 * @returns A JSON response with an array of users being followed or an error.
 */
export async function GET(
  request: NextRequest,
  { params }: UserFollowingRouteParams
) {
  const searchParams = request.nextUrl.searchParams;
  return await FollowController.getFollowing(params.userId, searchParams);
}
