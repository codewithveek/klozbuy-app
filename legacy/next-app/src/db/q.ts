// // Location-based feed service using Drizzle ORM
// import { db } from "./db";
// import {
//   posts,
//   users,
//   userProfiles,
//   businessProfiles,
//   locations,
// } from "./schema";
// import { eq, and, sql, desc, ne, lte, gte, or } from "drizzle-orm";

// interface LocationFeedParams {
//   userId: number;
//   userLatitude: number;
//   userLongitude: number;
//   radiusKm?: number;
//   limit?: number;
//   offset?: number;
//   postTypes?: ("general" | "product" | "service" | "event")[];
// }

// interface LocationFeedPost {
//   id: number;
//   uuid: string;
//   content: string;
//   type: string;
//   publishedAt: Date;
//   user: {
//     username: string;
//     displayName: string | null;
//     avatarUrl: string | null;
//     type: "individual" | "business";
//     businessName?: string | null;
//     businessType?: string | null;
//   };
//   location: {
//     name: string | null;
//     city: string | null;
//     state: string | null;
//     latitude: string;
//     longitude: string;
//   };
//   distanceKm: number;
// }

// export class LocationFeedService {
//   /**
//    * Get posts from users within a specified radius
//    */
//   async getNearbyPosts({
//     userId,
//     userLatitude,
//     userLongitude,
//     radiusKm = 5,
//     limit = 50,
//     offset = 0,
//     postTypes,
//   }: LocationFeedParams): Promise<LocationFeedPost[]> {
//     const radiusMeters = radiusKm * 1000;

//     // Build type filter
//     const typeFilter =
//       postTypes && postTypes.length > 0
//         ? sql`AND p.type IN (${postTypes.map((t) => `'${t}'`).join(",")})`
//         : sql``;

//     const query = sql`
//       SELECT
//         p.id,
//         p.uuid,
//         p.content,
//         p.type,
//         p.published_at as publishedAt,

//         u.username,
//         u.type as userType,
//         up.display_name as displayName,
//         up.avatar_url as avatarUrl,

//         bp.business_name as businessName,
//         bp.business_type as businessType,

//         l.name as locationName,
//         l.city,
//         l.state,
//         l.latitude,
//         l.longitude,

//         ST_Distance_Sphere(
//           POINT(l.longitude, l.latitude),
//           POINT(${userLongitude}, ${userLatitude})
//         ) AS distance_meters,

//         ROUND(
//           ST_Distance_Sphere(
//             POINT(l.longitude, l.latitude),
//             POINT(${userLongitude}, ${userLatitude})
//           ) / 1000, 2
//         ) AS distance_km

//       FROM posts p
//       INNER JOIN users u ON p.user_id = u.id
//       INNER JOIN user_profiles up ON u.id = up.user_id
//       LEFT JOIN business_profiles bp ON u.id = bp.user_id
//       INNER JOIN locations l ON p.location_id = l.id

//       WHERE
//         p.status = 'published'
//         AND l.is_active = true
//         AND u.status = 'active'
//         AND (p.visibility = 'public' OR p.visibility = 'nearby')
//         AND ST_Distance_Sphere(
//           POINT(l.longitude, l.latitude),
//           POINT(${userLongitude}, ${userLatitude})
//         ) <= ${radiusMeters}
//         AND p.user_id != ${userId}
//         ${typeFilter}

//       ORDER BY p.published_at DESC, distance_meters ASC
//       LIMIT ${limit} OFFSET ${offset}
//     `;

//     const results = await db.execute(query);

//     return results.map((row: any) => ({
//       id: row.id,
//       uuid: row.uuid,
//       content: row.content,
//       type: row.type,
//       publishedAt: row.publishedAt,
//       user: {
//         username: row.username,
//         displayName: row.displayName,
//         avatarUrl: row.avatarUrl,
//         type: row.userType,
//         businessName: row.businessName,
//         businessType: row.businessType,
//       },
//       location: {
//         name: row.locationName,
//         city: row.city,
//         state: row.state,
//         latitude: row.latitude,
//         longitude: row.longitude,
//       },
//       distanceKm: parseFloat(row.distance_km),
//     }));
//   }

//   /**
//    * Get posts by category within radius (e.g., only business posts)
//    */
//   async getNearbyBusinessPosts({
//     userId,
//     userLatitude,
//     userLongitude,
//     businessType,
//     radiusKm = 10,
//     limit = 20,
//   }: LocationFeedParams & { businessType?: string }) {
//     const radiusMeters = radiusKm * 1000;

//     const businessTypeFilter = businessType
//       ? sql`AND bp.business_type = ${businessType}`
//       : sql``;

//     const query = sql`
//       SELECT
//         p.id,
//         p.uuid,
//         p.content,
//         p.type,
//         p.published_at as publishedAt,

//         u.username,
//         bp.business_name as businessName,
//         bp.business_type as businessType,
//         bp.is_verified as isVerified,

//         up.avatar_url as avatarUrl,

//         l.name as locationName,
//         l.city,
//         l.state,
//         l.latitude,
//         l.longitude,

//         ROUND(
//           ST_Distance_Sphere(
//             POINT(l.longitude, l.latitude),
//             POINT(${userLongitude}, ${userLatitude})
//           ) / 1000, 2
//         ) AS distance_km

//       FROM posts p
//       INNER JOIN users u ON p.user_id = u.id AND u.type = 'business'
//       INNER JOIN user_profiles up ON u.id = up.user_id
//       INNER JOIN business_profiles bp ON u.id = bp.user_id
//       INNER JOIN locations l ON p.location_id = l.id

//       WHERE
//         p.status = 'published'
//         AND l.is_active = true
//         AND u.status = 'active'
//         AND (p.visibility = 'public' OR p.visibility = 'nearby')
//         AND ST_Distance_Sphere(
//           POINT(l.longitude, l.latitude),
//           POINT(${userLongitude}, ${userLatitude})
//         ) <= ${radiusMeters}
//         AND p.user_id != ${userId}
//         ${businessTypeFilter}

//       ORDER BY
//         bp.is_verified DESC,  -- Verified businesses first
//         p.published_at DESC,
//         distance_km ASC
//       LIMIT ${limit}
//     `;

//     return await db.execute(query);
//   }

//   /**
//    * Get trending posts in area (most engaged within timeframe)
//    */
//   async getTrendingNearbyPosts({
//     userId,
//     userLatitude,
//     userLongitude,
//     radiusKm = 10,
//     hoursBack = 24,
//     limit = 20,
//   }: LocationFeedParams & { hoursBack?: number }) {
//     const radiusMeters = radiusKm * 1000;

//     const query = sql`
//       SELECT
//         p.id,
//         p.uuid,
//         p.content,
//         p.type,
//         p.published_at as publishedAt,

//         u.username,
//         up.display_name as displayName,
//         up.avatar_url as avatarUrl,

//         bp.business_name as businessName,

//         l.name as locationName,
//         l.city,
//         l.latitude,
//         l.longitude,

//         ROUND(
//           ST_Distance_Sphere(
//             POINT(l.longitude, l.latitude),
//             POINT(${userLongitude}, ${userLatitude})
//           ) / 1000, 2
//         ) AS distance_km,

//         -- Engagement score (you'd need to add likes/comments tables)
//         -- COUNT(DISTINCT pl.id) + COUNT(DISTINCT pc.id) as engagement_score

//       FROM posts p
//       INNER JOIN users u ON p.user_id = u.id
//       INNER JOIN user_profiles up ON u.id = up.user_id
//       LEFT JOIN business_profiles bp ON u.id = bp.user_id
//       INNER JOIN locations l ON p.location_id = l.id
//       -- LEFT JOIN post_likes pl ON p.id = pl.post_id
//       -- LEFT JOIN post_comments pc ON p.id = pc.post_id

//       WHERE
//         p.status = 'published'
//         AND l.is_active = true
//         AND u.status = 'active'
//         AND (p.visibility = 'public' OR p.visibility = 'nearby')
//         AND ST_Distance_Sphere(
//           POINT(l.longitude, l.latitude),
//           POINT(${userLongitude}, ${userLatitude})
//         ) <= ${radiusMeters}
//         AND p.user_id != ${userId}
//         AND p.published_at >= DATE_SUB(NOW(), INTERVAL ${hoursBack} HOUR)

//       -- GROUP BY p.id
//       ORDER BY
//         -- engagement_score DESC,
//         p.published_at DESC,
//         distance_km ASC
//       LIMIT ${limit}
//     `;

//     return await db.execute(query);
//   }

//   /**
//    * Get user's current location for feed context
//    */
//   async getUserPrimaryLocation(userId: number) {
//     return await db
//       .select()
//       .from(locations)
//       .where(
//         and(
//           eq(locations.userId, userId),
//           eq(locations.type, "primary"),
//           eq(locations.isActive, true)
//         )
//       )
//       .limit(1);
//   }
// }

// // Usage example in your API route
// export async function GET(request: Request) {
//   const url = new URL(request.url);
//   const userId = parseInt(url.searchParams.get("userId") || "0");
//   const lat = parseFloat(url.searchParams.get("lat") || "0");
//   const lng = parseFloat(url.searchParams.get("lng") || "0");
//   const radius = parseInt(url.searchParams.get("radius") || "5");

//   const feedService = new LocationFeedService();

//   try {
//     const posts = await feedService.getNearbyPosts({
//       userId,
//       userLatitude: lat,
//       userLongitude: lng,
//       radiusKm: radius,
//       limit: 50,
//     });

//     return Response.json({
//       success: true,
//       posts,
//       radius: `${radius}km`,
//       center: { lat, lng },
//     });
//   } catch (error) {
//     return Response.json(
//       {
//         success: false,
//         error: "Failed to fetch nearby posts",
//       },
//       { status: 500 }
//     );
//   }
// }
