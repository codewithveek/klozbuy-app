-- Get posts from users within a specific radius (e.g., 5km) of current user
-- Replace ? placeholders with actual values from your application

-- Method 1: Using ST_Distance_Sphere (MySQL 8.0+)
SELECT 
    p.id,
    p.uuid,
    p.content,
    p.type,
    p.publishedAt,
    p.createdAt,
    
    -- User info
    u.username,
    up.displayName,
    up.firstName,
    up.lastName,
    up.avatarUrl,
    u.type as userType,
    
    -- Business info (if applicable)
    bp.businessName,
    bp.businessType,
    
    -- Location info
    l.name as locationName,
    l.city,
    l.state,
    l.latitude,
    l.longitude,
    
    -- Calculate distance in meters
    ST_Distance_Sphere(
        POINT(l.longitude, l.latitude),
        POINT(?, ?)  -- Current user's longitude, latitude
    ) AS distance_meters,
    
    -- Convert to kilometers for display
    ROUND(
        ST_Distance_Sphere(
            POINT(l.longitude, l.latitude),
            POINT(?, ?)
        ) / 1000, 2
    ) AS distance_km

FROM posts p
INNER JOIN users u ON p.userId = u.id
INNER JOIN user_profiles up ON u.id = up.userId
LEFT JOIN business_profiles bp ON u.id = bp.userId
INNER JOIN locations l ON p.locationId = l.id

WHERE 
    -- Only published posts
    p.status = 'published'
    
    -- Only active locations
    AND l.isActive = true
    
    -- Only active users
    AND u.status = 'active'
    
    -- Visibility rules
    AND (
        p.visibility = 'public' 
        OR p.visibility = 'nearby'
        -- Add followers logic here if needed
    )
    
    -- Within specified radius (5km = 5000 meters)
    AND ST_Distance_Sphere(
        POINT(l.longitude, l.latitude),
        POINT(?, ?)  -- Current user's coordinates
    ) <= 5000
    
    -- Exclude current user's posts (optional)
    AND p.userId != ?  -- Current user ID

ORDER BY 
    -- Prioritize by recency, then by distance
    p.publishedAt DESC,
    distance_meters ASC

LIMIT 50;

-- Method 2: Using Bounding Box (Faster for large datasets)
-- Calculate approximate bounding box for 5km radius
-- 1 degree latitude ≈ 111km, 1 degree longitude ≈ 111km * cos(latitude)

SELECT 
    p.id,
    p.uuid,
    p.content,
    p.type,
    p.publishedAt,
    u.username,
    up.displayName,
    up.avatarUrl,
    bp.businessName,
    l.name as locationName,
    l.city,
    l.latitude,
    l.longitude,
    
    -- Calculate precise distance for final ordering
    ST_Distance_Sphere(
        POINT(l.longitude, l.latitude),
        POINT(?, ?)
    ) AS distance_meters

FROM posts p
INNER JOIN users u ON p.userId = u.id
INNER JOIN user_profiles up ON u.id = up.userId
LEFT JOIN business_profiles bp ON u.id = bp.userId
INNER JOIN locations l ON p.locationId = l.id

WHERE 
    p.status = 'published'
    AND l.isActive = true
    AND u.status = 'active'
    AND (p.visibility = 'public' OR p.visibility = 'nearby')
    
    -- Bounding box filter (much faster)
    AND l.latitude BETWEEN (? - 0.045) AND (? + 0.045)   -- ±5km in latitude
    AND l.longitude BETWEEN (? - 0.045) AND (? + 0.045)  -- ±5km in longitude (approximate)
    
    -- Then apply precise distance filter
    AND ST_Distance_Sphere(
        POINT(l.longitude, l.latitude),
        POINT(?, ?)
    ) <= 5000

ORDER BY p.publishedAt DESC, distance_meters ASC
LIMIT 50;

-- Method 3: With Engagement Metrics (if you have likes/comments tables)
SELECT 
    p.*,
    u.username,
    up.displayName,
    up.avatarUrl,
    bp.businessName,
    l.name as locationName,
    l.city,
    l.latitude,
    l.longitude,
    
    ST_Distance_Sphere(
        POINT(l.longitude, l.latitude),
        POINT(?, ?)
    ) AS distance_meters,
    
    -- Add engagement metrics if available
    COUNT(DISTINCT pl.id) as like_count,
    COUNT(DISTINCT pc.id) as comment_count

FROM posts p
INNER JOIN users u ON p.userId = u.id
INNER JOIN user_profiles up ON u.id = up.userId
LEFT JOIN business_profiles bp ON u.id = bp.userId
INNER JOIN locations l ON p.locationId = l.id
-- LEFT JOIN post_likes pl ON p.id = pl.postId
-- LEFT JOIN post_comments pc ON p.id = pc.postId

WHERE 
    p.status = 'published'
    AND l.isActive = true
    AND u.status = 'active'
    AND (p.visibility = 'public' OR p.visibility = 'nearby')
    AND ST_Distance_Sphere(
        POINT(l.longitude, l.latitude),
        POINT(?, ?)
    ) <= 5000
    AND p.userId != ?

GROUP BY p.id
ORDER BY 
    -- Weighted scoring: recency + proximity + engagement
    (
        (UNIX_TIMESTAMP(NOW()) - UNIX_TIMESTAMP(p.publishedAt)) / 3600 * -0.1 +  -- Recency score
        (5000 - ST_Distance_Sphere(POINT(l.longitude, l.latitude), POINT(?, ?))) / 1000 +  -- Proximity score
        (COUNT(DISTINCT pl.id) + COUNT(DISTINCT pc.id)) * 0.1  -- Engagement score
    ) DESC

LIMIT 50;