import { NextRequest } from "next/server";
import { FollowController } from "@/controllers/follow.controller";

interface UserFollowersRouteParams {
  params: {
    userId: string;
  };
}

/**
 * Handles GET requests to retrieve followers for a specific user.
 * @param request The NextRequest object.
 * @param params Route params containing the userId.
 * @returns A JSON response with an array of followers or an error.
 */
export async function GET(
  request: NextRequest,
  { params }: UserFollowersRouteParams
) {
  const searchParams = request.nextUrl.searchParams;
  return await FollowController.getFollowers(params.userId, searchParams);
}
