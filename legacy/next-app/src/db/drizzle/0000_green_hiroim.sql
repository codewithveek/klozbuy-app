CREATE TABLE `business_profiles` (
	`id` varchar(36) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`business_name` varchar(100) NOT NULL,
	`business_type` varchar(50) NOT NULL,
	`registration_number` varchar(100),
	`tax_id` varchar(100),
	`is_verified` boolean DEFAULT false,
	`reviews_count` int DEFAULT 0,
	`rating` decimal(3,2) DEFAULT 0,
	`verification_status` enum('pending','approved','rejected','suspended') DEFAULT 'pending',
	`verified_at` timestamp,
	`established_year` int,
	`employee_count` enum('1-10','11-50','51-200','201-500','500+'),
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `business_profiles_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `follows` (
	`id` varchar(36) NOT NULL,
	`follower_id` varchar(36) NOT NULL,
	`following_id` varchar(36) NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `follows_id` PRIMARY KEY(`id`),
	CONSTRAINT `follows_unique_follow_idx` UNIQUE(`follower_id`,`following_id`)
);
--> statement-breakpoint
CREATE TABLE `locations` (
	`id` varchar(36) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`type` enum('primary','business','delivery') DEFAULT 'primary',
	`name` varchar(100),
	`address` varchar(255),
	`city` varchar(100),
	`landmark` varchar(150),
	`state` varchar(100),
	`country` varchar(100) DEFAULT 'Nigeria',
	`postal_code` varchar(20),
	`latitude` decimal(10,8),
	`longitude` decimal(11,8),
	`is_active` boolean DEFAULT true,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `locations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` varchar(36) NOT NULL,
	`last_seen_at` timestamp,
	`type` enum('individual','business') NOT NULL,
	`username` varchar(50),
	`email` varchar(255) NOT NULL,
	`email_verified` boolean DEFAULT false,
	`phone_number` varchar(255),
	`phone_number_verified` boolean,
	`is_online` boolean DEFAULT false,
	`first_name` varchar(50),
	`last_name` varchar(50),
	`bio` text,
	`avatar_url` varchar(500),
	`cover_image_url` varchar(500),
	`website` varchar(255),
	`date_of_birth` timestamp,
	`gender` enum('male','female','other','prefer_not_to_say'),
	`role` varchar(50),
	`banned` boolean,
	`ban_reason` text,
	`ban_expires` timestamp,
	`display_username` text,
	`is_verified` boolean DEFAULT false,
	`followers_count` int DEFAULT 0,
	`following_count` int DEFAULT 0,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_username_unique` UNIQUE(`username`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`),
	CONSTRAINT `users_phone_number_unique` UNIQUE(`phone_number`)
);
--> statement-breakpoint
CREATE TABLE `comment_reactions` (
	`id` varchar(36) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`comment_id` varchar(36) NOT NULL,
	`type` enum('like','love','support','interesting','want') NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `comment_reactions_id` PRIMARY KEY(`id`),
	CONSTRAINT `comment_reactions_unique_user_comment` UNIQUE(`user_id`,`comment_id`)
);
--> statement-breakpoint
CREATE TABLE `event_attendees` (
	`id` varchar(36) NOT NULL,
	`event_id` varchar(36),
	`user_id` varchar(36) NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `event_attendees_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `events` (
	`id` varchar(36) NOT NULL,
	`post_id` varchar(36) NOT NULL,
	`title` varchar(100) NOT NULL,
	`start_date` timestamp NOT NULL,
	`end_date` timestamp NOT NULL,
	`start_time` varchar(10),
	`end_time` varchar(10),
	`timezone` varchar(50) DEFAULT 'Africa/Lagos',
	`cover_image_url` varchar(500),
	`venue` varchar(200),
	`venue_location_id` varchar(36),
	`event_venue_type` enum('online','offline') DEFAULT 'offline',
	`meeting_url` varchar(500),
	`capacity` int,
	`current_attendees` int DEFAULT 0,
	`ticket_price` decimal(10,2),
	`is_ticket_required` boolean DEFAULT false,
	`registration_deadline` timestamp,
	`contact_info` json,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `events_id` PRIMARY KEY(`id`),
	CONSTRAINT `events_post_id_unique` UNIQUE(`post_id`)
);
--> statement-breakpoint
CREATE TABLE `post_comment_media` (
	`id` varchar(36) NOT NULL,
	`comment_id` varchar(36) NOT NULL,
	`media_id` varchar(36) NOT NULL,
	CONSTRAINT `post_comment_media_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `post_comments` (
	`id` varchar(36) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`post_id` varchar(36) NOT NULL,
	`content` text NOT NULL,
	`parent_id` varchar(36),
	`mentioned_users` json,
	`status` enum('pending','approved','deleted','hidden') DEFAULT 'approved',
	`is_edited` boolean DEFAULT false,
	`edited_at` timestamp,
	`reaction_count` int DEFAULT 0,
	`reply_count` int DEFAULT 0,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `post_comments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `post_media` (
	`id` varchar(36) NOT NULL,
	`post_id` varchar(36) NOT NULL,
	`media_id` varchar(36) NOT NULL,
	`is_primary` boolean DEFAULT false,
	`sort_order` int DEFAULT 0,
	`alt_text` varchar(200),
	`caption` text,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `post_media_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `post_promotions` (
	`id` varchar(36) NOT NULL,
	`post_id` varchar(36) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`budget` decimal(10,2) DEFAULT 0,
	`spent` decimal(10,2) DEFAULT 0,
	`currency` varchar(3) DEFAULT 'NGN',
	`target_radius` int,
	`target_location_id` varchar(36),
	`target_audience` json,
	`impressions` int DEFAULT 0,
	`clicks` int DEFAULT 0,
	`conversions` int DEFAULT 0,
	`start_date` timestamp NOT NULL,
	`end_date` timestamp NOT NULL,
	`daily_budget` decimal(10,2),
	`type` enum('boost','featured','location_targeted','demographic_targeted','interest_targeted') NOT NULL,
	`status` enum('active','paused','completed','cancelled','pending_approval') DEFAULT 'pending_approval',
	`approved_at` timestamp,
	`approved_by` varchar(36),
	`rejection_reason` text,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `post_promotions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `post_reactions` (
	`id` varchar(36) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`post_id` varchar(36) NOT NULL,
	`type` enum('like','love','support','interesting','want') NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `post_reactions_id` PRIMARY KEY(`id`),
	CONSTRAINT `post_reactions_unique_user_post` UNIQUE(`user_id`,`post_id`)
);
--> statement-breakpoint
CREATE TABLE `posts` (
	`id` varchar(36) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`type` enum('general','product','service','event') NOT NULL,
	`content` text,
	`status` enum('draft','published','archived','deleted') DEFAULT 'published',
	`visibility` enum('public','followers','nearby') NOT NULL DEFAULT 'public',
	`location_id` varchar(36),
	`is_promoted` boolean DEFAULT false,
	`published_at` timestamp,
	`likes_count` int DEFAULT 0,
	`comments_count` int DEFAULT 0,
	`shares_count` int DEFAULT 0,
	`views_count` int DEFAULT 0,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `posts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `product_media` (
	`id` varchar(36) NOT NULL,
	`post_id` varchar(36) NOT NULL,
	`media_id` varchar(36) NOT NULL,
	`is_primary` boolean DEFAULT false,
	`sort_order` int DEFAULT 0,
	`alt_text` varchar(200),
	`caption` text,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `product_media_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` varchar(36) NOT NULL,
	`name` varchar(100) NOT NULL,
	`post_id` varchar(36) NOT NULL,
	`description` varchar(500),
	`media_id` varchar(36),
	`category` varchar(100),
	`sku` varchar(100),
	`price` decimal(10,2),
	`compare_at_price` decimal(10,2),
	`currency` varchar(3) DEFAULT 'NGN',
	`condition` enum('new','used','refurbished') DEFAULT 'new',
	`availability` enum('in_stock','out_of_stock','pre_order','discontinued') DEFAULT 'in_stock',
	`stock_quantity` int,
	`min_order_quantity` int DEFAULT 1,
	`max_order_quantity` int,
	`weight` decimal(8,3),
	`dimensions` json,
	`brand` varchar(100),
	`model` varchar(100),
	`warranty` varchar(200),
	`is_negotiable` boolean DEFAULT false,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `products_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `service_media` (
	`id` varchar(36) NOT NULL,
	`post_id` varchar(36) NOT NULL,
	`media_id` varchar(36) NOT NULL,
	`is_primary` boolean DEFAULT false,
	`sort_order` int DEFAULT 0,
	`alt_text` varchar(200),
	`caption` text,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `service_media_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `services` (
	`id` varchar(36) NOT NULL,
	`post_id` varchar(36) NOT NULL,
	`service_type` varchar(100) NOT NULL,
	`price_type` enum('fixed','hourly','per_project','negotiable') NOT NULL,
	`price` decimal(10,2),
	`currency` varchar(3) DEFAULT 'NGN',
	`duration` varchar(100),
	`availability` json,
	`service_venue` enum('onsite','remote','hybrid') DEFAULT 'onsite',
	`service_radius` int,
	`experience_years` int,
	`certifications` json,
	`portfolio` json,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `services_id` PRIMARY KEY(`id`),
	CONSTRAINT `services_post_id_unique` UNIQUE(`post_id`)
);
--> statement-breakpoint
CREATE TABLE `audio` (
	`id` varchar(36) NOT NULL,
	`media_id` varchar(36) NOT NULL,
	`duration` int NOT NULL,
	`bitrate` int,
	`sample_rate` int,
	`channels` int,
	`format` varchar(20),
	CONSTRAINT `audio_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `documents` (
	`id` varchar(36) NOT NULL,
	`media_id` varchar(36) NOT NULL,
	`mime_type` varchar(100) NOT NULL,
	`page_count` int,
	`thumbnail_url` varchar(500),
	`is_searchable` boolean DEFAULT false,
	CONSTRAINT `documents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `images` (
	`id` varchar(36) NOT NULL,
	`media_id` varchar(36) NOT NULL,
	`width` int NOT NULL,
	`height` int NOT NULL,
	`alt_text` varchar(255),
	`thumbnail_url` varchar(500),
	`color_profile` varchar(50),
	`is_animated` boolean DEFAULT false,
	CONSTRAINT `images_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `media` (
	`id` varchar(36) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`type` enum('image','video','audio','document') NOT NULL,
	`url` varchar(500) NOT NULL,
	`file_name` varchar(255),
	`file_size` int,
	`cdn_public_id` varchar(255),
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `media_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `videos` (
	`id` varchar(36) NOT NULL,
	`media_id` varchar(36) NOT NULL,
	`duration` int NOT NULL,
	`width` int,
	`height` int,
	`thumbnail_url` varchar(500),
	`bitrate` int,
	`codec` varchar(50),
	`frame_rate` decimal(5,2),
	CONSTRAINT `videos_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `batch_notifications` (
	`id` varchar(36) NOT NULL,
	`batch_id` varchar(36) NOT NULL,
	`notification_id` varchar(36) NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `batch_notifications_id` PRIMARY KEY(`id`),
	CONSTRAINT `batch_notifications_unique_idx` UNIQUE(`batch_id`,`notification_id`)
);
--> statement-breakpoint
CREATE TABLE `notification_batches` (
	`id` varchar(36) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`batch_type` enum('daily_digest','weekly_digest','monthly_digest','activity_summary') NOT NULL,
	`status` enum('pending','processing','sent','failed') DEFAULT 'pending',
	`title` varchar(255),
	`content` text,
	`notification_count` int DEFAULT 0,
	`scheduled_for` timestamp NOT NULL,
	`processed_at` timestamp,
	`sent_at` timestamp,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `notification_batches_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `notification_deliveries` (
	`id` varchar(36) NOT NULL,
	`notification_id` varchar(36) NOT NULL,
	`channel` enum('in_app','email','push','sms') NOT NULL,
	`status` enum('pending','sent','delivered','failed','bounced','clicked','opened') DEFAULT 'pending',
	`external_id` varchar(255),
	`provider` varchar(50),
	`attempt_count` int DEFAULT 1,
	`last_attempt_at` timestamp,
	`delivered_at` timestamp,
	`failure_reason` text,
	`opened_at` timestamp,
	`clicked_at` timestamp,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `notification_deliveries_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `notification_preferences` (
	`id` varchar(36) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`enable_in_app` boolean DEFAULT true,
	`enable_email` boolean DEFAULT true,
	`enable_push` boolean DEFAULT true,
	`enable_sms` boolean DEFAULT false,
	`quiet_hours` json,
	`preferences` json,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `notification_preferences_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `notification_templates` (
	`id` varchar(36) NOT NULL,
	`type` enum('like','comment','reply','mention','follow','unfollow','post_shared','post_featured','post_approved','post_rejected','review_received','review_reply','business_verified','business_suspended','message_received','message_reaction','event_reminder','event_invitation','event_cancelled','event_updated','subscription_expiring','subscription_renewed','subscription_cancelled','payment_successful','payment_failed','promotion_approved','promotion_rejected','promotion_budget_low','promotion_completed','account_warning','feature_announcement','maintenance_notice','security_alert','welcome') NOT NULL,
	`in_app_title` varchar(255),
	`in_app_content` text,
	`email_subject` varchar(255),
	`email_content` text,
	`push_title` varchar(255),
	`push_content` text,
	`sms_content` text,
	`variables` json,
	`is_active` boolean DEFAULT true,
	`default_priority` enum('low','normal','high','urgent') DEFAULT 'normal',
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `notification_templates_id` PRIMARY KEY(`id`),
	CONSTRAINT `notification_templates_type_unique` UNIQUE(`type`)
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` varchar(36) NOT NULL,
	`recipient_id` varchar(36),
	`sender_id` varchar(36),
	`type` enum('like','comment','reply','mention','follow','unfollow','post_shared','post_featured','post_approved','post_rejected','review_received','review_reply','business_verified','business_suspended','message_received','message_reaction','event_reminder','event_invitation','event_cancelled','event_updated','subscription_expiring','subscription_renewed','subscription_cancelled','payment_successful','payment_failed','promotion_approved','promotion_rejected','promotion_budget_low','promotion_completed','account_warning','feature_announcement','maintenance_notice','security_alert','welcome') NOT NULL,
	`title` varchar(255) NOT NULL,
	`content` text NOT NULL,
	`entity_type` enum('post','comment','user','review','message','conversation','event','subscription','promotion','advertisement'),
	`entity_id` varchar(36),
	`metadata` json,
	`is_read` boolean DEFAULT false,
	`read_at` timestamp,
	`channels` json,
	`priority` enum('low','normal','high','urgent') DEFAULT 'normal',
	`group_key` varchar(100),
	`scheduled_for` timestamp,
	`sent_at` timestamp,
	`expires_at` timestamp,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `notifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `conversation_participants` (
	`id` varchar(36) NOT NULL,
	`conversation_id` varchar(36) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`role` enum('member','admin','owner') DEFAULT 'member',
	`joined_at` timestamp DEFAULT (now()),
	`left_at` timestamp,
	CONSTRAINT `conversation_participants_id` PRIMARY KEY(`id`),
	CONSTRAINT `conversation_participants_unique_active_idx` UNIQUE(`conversation_id`,`user_id`,`left_at`)
);
--> statement-breakpoint
CREATE TABLE `conversations` (
	`id` varchar(36) NOT NULL,
	`type` enum('group','direct','channel') DEFAULT 'direct',
	`name` varchar(100),
	`description` varchar(255),
	`is_private` boolean DEFAULT true,
	`created_by` varchar(36),
	`last_message_at` timestamp,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `conversations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `message_attachments` (
	`id` varchar(36) NOT NULL,
	`message_id` varchar(36) NOT NULL,
	`cdn_url` varchar(500) NOT NULL,
	`cdn_public_id` varchar(255) NOT NULL,
	`file_name` varchar(255) NOT NULL,
	`mime_type` varchar(100) NOT NULL,
	`file_size` int,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `message_attachments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `message_mentions` (
	`id` varchar(36) NOT NULL,
	`message_id` varchar(36) NOT NULL,
	`mentioned_user_id` varchar(36) NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `message_mentions_id` PRIMARY KEY(`id`),
	CONSTRAINT `message_mentions_unique_message_mention_idx` UNIQUE(`message_id`,`mentioned_user_id`)
);
--> statement-breakpoint
CREATE TABLE `message_reactions` (
	`id` varchar(36) NOT NULL,
	`message_id` varchar(36) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`name` varchar(50) NOT NULL,
	`emoji` varchar(10) NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `message_reactions_id` PRIMARY KEY(`id`),
	CONSTRAINT `message_reactions_unique_user_emoji_idx` UNIQUE(`message_id`,`user_id`,`emoji`)
);
--> statement-breakpoint
CREATE TABLE `message_read_receipts` (
	`id` varchar(36) NOT NULL,
	`message_id` varchar(36) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`read_at` timestamp DEFAULT (now()),
	CONSTRAINT `message_read_receipts_id` PRIMARY KEY(`id`),
	CONSTRAINT `message_read_receipts_unique_user_message_idx` UNIQUE(`message_id`,`user_id`)
);
--> statement-breakpoint
CREATE TABLE `messages` (
	`id` varchar(36) NOT NULL,
	`conversation_id` varchar(36) NOT NULL,
	`sender_id` varchar(36) NOT NULL,
	`content` text,
	`message_type` enum('text','image','video','audio','file') DEFAULT 'text',
	`reply_to_id` varchar(36),
	`is_edited` boolean DEFAULT false,
	`is_deleted` boolean DEFAULT false,
	`reaction_count` int DEFAULT 0,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `messages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `reviews` (
	`id` varchar(36) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`business_id` varchar(36) NOT NULL,
	`post_id` varchar(36),
	`rating` int NOT NULL,
	`title` varchar(200),
	`content` text,
	`is_verified_purchase` boolean DEFAULT false,
	`is_recommended` boolean,
	`helpful_count` int DEFAULT 0,
	`status` enum('pending','approved','rejected') DEFAULT 'approved',
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `reviews_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `subscription_plans` (
	`id` varchar(36) NOT NULL,
	`name` varchar(100) NOT NULL,
	`slug` varchar(100) NOT NULL,
	`description` text,
	`price` decimal(10,2) NOT NULL,
	`currency` varchar(3) DEFAULT 'NGN',
	`billing_interval` enum('monthly','quarterly','yearly') NOT NULL,
	`features` json,
	`limits` json,
	`is_active` boolean DEFAULT true,
	`sort_order` int DEFAULT 0,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `subscription_plans_id` PRIMARY KEY(`id`),
	CONSTRAINT `subscription_plans_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `subscriptions` (
	`id` varchar(36) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`plan_id` varchar(36) NOT NULL,
	`status` enum('active','inactive','cancelled','expired','past_due') NOT NULL,
	`current_period_start` timestamp NOT NULL,
	`current_period_end` timestamp NOT NULL,
	`cancelled_at` timestamp,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `subscriptions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `advertisement_attachments` (
	`id` varchar(36) NOT NULL,
	`advertisement_id` varchar(36) NOT NULL,
	`media_id` varchar(36) NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `advertisement_attachments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `advertisement_targeting` (
	`id` varchar(36) NOT NULL,
	`advertisement_id` varchar(36) NOT NULL,
	`gender` enum('male','female','other','prefer_not_to_say'),
	`min_age` int,
	`max_age` int,
	`age_group` enum('teen','young_adult','adult','senior'),
	`location_id` varchar(36),
	CONSTRAINT `advertisement_targeting_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `advertisements` (
	`id` varchar(36) NOT NULL,
	`title` varchar(200) NOT NULL,
	`content` text NOT NULL,
	`image_url` varchar(500),
	`click_url` varchar(500),
	`user_id` varchar(36) NOT NULL,
	`type` enum('banner','sidebar','feed','popup') NOT NULL,
	`placement` varchar(100),
	`status` enum('active','paused','completed','cancelled') DEFAULT 'active',
	`target_gender` enum('male','female','other','prefer_not_to_say') NOT NULL,
	`target_age_start` int,
	`target_age_end` int,
	`target_location_id` varchar(36),
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `advertisements_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `business_profiles` ADD CONSTRAINT `business_profiles_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `follows` ADD CONSTRAINT `follows_follower_id_fk` FOREIGN KEY (`follower_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `follows` ADD CONSTRAINT `follows_following_id_fk` FOREIGN KEY (`following_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `locations` ADD CONSTRAINT `locations_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `comment_reactions` ADD CONSTRAINT `comment_reactions_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `comment_reactions` ADD CONSTRAINT `comment_reactions_comment_id_post_comments_id_fk` FOREIGN KEY (`comment_id`) REFERENCES `post_comments`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `event_attendees` ADD CONSTRAINT `event_attendees_event_id_events_id_fk` FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `event_attendees` ADD CONSTRAINT `event_attendees_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `events` ADD CONSTRAINT `events_post_id_posts_id_fk` FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `events` ADD CONSTRAINT `events_venue_location_id_locations_id_fk` FOREIGN KEY (`venue_location_id`) REFERENCES `locations`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `post_comment_media` ADD CONSTRAINT `post_comment_media_comment_id_post_comments_id_fk` FOREIGN KEY (`comment_id`) REFERENCES `post_comments`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `post_comment_media` ADD CONSTRAINT `post_comment_media_media_id_media_id_fk` FOREIGN KEY (`media_id`) REFERENCES `media`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `post_comments` ADD CONSTRAINT `post_comments_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `post_comments` ADD CONSTRAINT `post_comments_post_id_posts_id_fk` FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `post_comments` ADD CONSTRAINT `post_comments_parent_id_post_comments_id_fk` FOREIGN KEY (`parent_id`) REFERENCES `post_comments`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `post_media` ADD CONSTRAINT `post_media_post_id_posts_id_fk` FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `post_media` ADD CONSTRAINT `post_media_media_id_media_id_fk` FOREIGN KEY (`media_id`) REFERENCES `media`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `post_promotions` ADD CONSTRAINT `post_promotions_post_id_posts_id_fk` FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `post_promotions` ADD CONSTRAINT `post_promotions_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `post_promotions` ADD CONSTRAINT `post_promotions_target_location_id_locations_id_fk` FOREIGN KEY (`target_location_id`) REFERENCES `locations`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `post_reactions` ADD CONSTRAINT `post_reactions_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `post_reactions` ADD CONSTRAINT `post_reactions_post_id_posts_id_fk` FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `posts` ADD CONSTRAINT `posts_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `posts` ADD CONSTRAINT `posts_location_id_locations_id_fk` FOREIGN KEY (`location_id`) REFERENCES `locations`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `product_media` ADD CONSTRAINT `product_media_post_id_products_id_fk` FOREIGN KEY (`post_id`) REFERENCES `products`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `product_media` ADD CONSTRAINT `product_media_media_id_media_id_fk` FOREIGN KEY (`media_id`) REFERENCES `media`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `products` ADD CONSTRAINT `products_post_id_posts_id_fk` FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `service_media` ADD CONSTRAINT `service_media_post_id_services_id_fk` FOREIGN KEY (`post_id`) REFERENCES `services`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `service_media` ADD CONSTRAINT `service_media_media_id_media_id_fk` FOREIGN KEY (`media_id`) REFERENCES `media`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `services` ADD CONSTRAINT `services_post_id_posts_id_fk` FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `audio` ADD CONSTRAINT `audio_media_id_media_id_fk` FOREIGN KEY (`media_id`) REFERENCES `media`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `documents` ADD CONSTRAINT `documents_media_id_media_id_fk` FOREIGN KEY (`media_id`) REFERENCES `media`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `images` ADD CONSTRAINT `images_media_id_media_id_fk` FOREIGN KEY (`media_id`) REFERENCES `media`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `media` ADD CONSTRAINT `media_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `videos` ADD CONSTRAINT `videos_media_id_media_id_fk` FOREIGN KEY (`media_id`) REFERENCES `media`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `batch_notifications` ADD CONSTRAINT `batch_notifications_batch_id_notification_batches_id_fk` FOREIGN KEY (`batch_id`) REFERENCES `notification_batches`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `batch_notifications` ADD CONSTRAINT `batch_notifications_notification_id_notifications_id_fk` FOREIGN KEY (`notification_id`) REFERENCES `notifications`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `notification_batches` ADD CONSTRAINT `notification_batches_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `notification_deliveries` ADD CONSTRAINT `notification_deliveries_notification_id_notifications_id_fk` FOREIGN KEY (`notification_id`) REFERENCES `notifications`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `notification_preferences` ADD CONSTRAINT `notification_preferences_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `notifications` ADD CONSTRAINT `notifications_recipient_id_users_id_fk` FOREIGN KEY (`recipient_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `notifications` ADD CONSTRAINT `notifications_sender_id_users_id_fk` FOREIGN KEY (`sender_id`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `conversation_participants` ADD CONSTRAINT `conversation_participants_conversation_id_conversations_id_fk` FOREIGN KEY (`conversation_id`) REFERENCES `conversations`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `conversation_participants` ADD CONSTRAINT `conversation_participants_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `conversations` ADD CONSTRAINT `conversations_created_by_users_id_fk` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `message_attachments` ADD CONSTRAINT `message_attachments_message_id_messages_id_fk` FOREIGN KEY (`message_id`) REFERENCES `messages`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `message_mentions` ADD CONSTRAINT `message_mentions_message_id_messages_id_fk` FOREIGN KEY (`message_id`) REFERENCES `messages`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `message_mentions` ADD CONSTRAINT `message_mentions_mentioned_user_id_users_id_fk` FOREIGN KEY (`mentioned_user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `message_reactions` ADD CONSTRAINT `message_reactions_message_id_messages_id_fk` FOREIGN KEY (`message_id`) REFERENCES `messages`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `message_reactions` ADD CONSTRAINT `message_reactions_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `message_read_receipts` ADD CONSTRAINT `message_read_receipts_message_id_messages_id_fk` FOREIGN KEY (`message_id`) REFERENCES `messages`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `message_read_receipts` ADD CONSTRAINT `message_read_receipts_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `messages` ADD CONSTRAINT `messages_conversation_id_conversations_id_fk` FOREIGN KEY (`conversation_id`) REFERENCES `conversations`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `messages` ADD CONSTRAINT `messages_sender_id_users_id_fk` FOREIGN KEY (`sender_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `messages` ADD CONSTRAINT `messages_reply_to_id_messages_id_fk` FOREIGN KEY (`reply_to_id`) REFERENCES `messages`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `reviews` ADD CONSTRAINT `reviews_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `reviews` ADD CONSTRAINT `reviews_business_id_business_profiles_id_fk` FOREIGN KEY (`business_id`) REFERENCES `business_profiles`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `reviews` ADD CONSTRAINT `reviews_post_id_posts_id_fk` FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `subscriptions` ADD CONSTRAINT `subscriptions_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `subscriptions` ADD CONSTRAINT `subscriptions_plan_id_subscription_plans_id_fk` FOREIGN KEY (`plan_id`) REFERENCES `subscription_plans`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `advertisement_attachments` ADD CONSTRAINT `advertisement_attachments_advertisement_id_advertisements_id_fk` FOREIGN KEY (`advertisement_id`) REFERENCES `advertisements`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `advertisement_attachments` ADD CONSTRAINT `advertisement_attachments_media_id_media_id_fk` FOREIGN KEY (`media_id`) REFERENCES `media`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `advertisements` ADD CONSTRAINT `advertisements_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `advertisements` ADD CONSTRAINT `advertisements_target_location_id_locations_id_fk` FOREIGN KEY (`target_location_id`) REFERENCES `locations`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `business_profiles_user_id_idx` ON `business_profiles` (`user_id`);--> statement-breakpoint
CREATE INDEX `business_profiles_verified_idx` ON `business_profiles` (`is_verified`);--> statement-breakpoint
CREATE INDEX `business_profiles_status_idx` ON `business_profiles` (`verification_status`);--> statement-breakpoint
CREATE INDEX `business_profiles_created_at_idx` ON `business_profiles` (`created_at`);--> statement-breakpoint
CREATE INDEX `business_profiles_business_name_idx` ON `business_profiles` (`business_name`);--> statement-breakpoint
CREATE INDEX `business_profiles_established_year_idx` ON `business_profiles` (`established_year`);--> statement-breakpoint
CREATE INDEX `business_profiles_employee_count_idx` ON `business_profiles` (`employee_count`);--> statement-breakpoint
CREATE INDEX `business_profiles_business_type_idx` ON `business_profiles` (`business_type`);--> statement-breakpoint
CREATE INDEX `follows_follower_id_idx` ON `follows` (`follower_id`);--> statement-breakpoint
CREATE INDEX `follows_following_id_idx` ON `follows` (`following_id`);--> statement-breakpoint
CREATE INDEX `locations_user_id_idx` ON `locations` (`user_id`);--> statement-breakpoint
CREATE INDEX `locations_lat_lng_idx` ON `locations` (`latitude`,`longitude`);--> statement-breakpoint
CREATE INDEX `locations_city_idx` ON `locations` (`city`);--> statement-breakpoint
CREATE INDEX `locations_active_idx` ON `locations` (`is_active`);--> statement-breakpoint
CREATE INDEX `locations_created_at_idx` ON `locations` (`created_at`);--> statement-breakpoint
CREATE INDEX `locations_country_idx` ON `locations` (`country`);--> statement-breakpoint
CREATE INDEX `locations_postal_code_idx` ON `locations` (`postal_code`);--> statement-breakpoint
CREATE INDEX `locations_state_idx` ON `locations` (`state`);--> statement-breakpoint
CREATE INDEX `locations_name_idx` ON `locations` (`name`);--> statement-breakpoint
CREATE INDEX `locations_address_idx` ON `locations` (`address`);--> statement-breakpoint
CREATE INDEX `users_username_idx` ON `users` (`username`);--> statement-breakpoint
CREATE INDEX `users_email_idx` ON `users` (`email`);--> statement-breakpoint
CREATE INDEX `users_type_idx` ON `users` (`type`);--> statement-breakpoint
CREATE INDEX `users_online_idx` ON `users` (`is_online`);--> statement-breakpoint
CREATE INDEX `users_role_idx` ON `users` (`role`);--> statement-breakpoint
CREATE INDEX `users_banned_idx` ON `users` (`banned`);--> statement-breakpoint
CREATE INDEX `users_phone_number_idx` ON `users` (`phone_number`);--> statement-breakpoint
CREATE INDEX `users_created_at_idx` ON `users` (`created_at`);--> statement-breakpoint
CREATE INDEX `users_last_seen_idx` ON `users` (`last_seen_at`);--> statement-breakpoint
CREATE INDEX `users_gender_idx` ON `users` (`gender`);--> statement-breakpoint
CREATE INDEX `users_date_of_birth_idx` ON `users` (`date_of_birth`);--> statement-breakpoint
CREATE INDEX `users_first_name_idx` ON `users` (`first_name`);--> statement-breakpoint
CREATE INDEX `users_last_name_idx` ON `users` (`last_name`);--> statement-breakpoint
CREATE INDEX `users_followers_count_idx` ON `users` (`followers_count`);--> statement-breakpoint
CREATE INDEX `users_following_count_idx` ON `users` (`following_count`);--> statement-breakpoint
CREATE INDEX `users_display_username_idx` ON `users` (`display_username`);--> statement-breakpoint
CREATE INDEX `users_bio_idx` ON `users` (`bio`);--> statement-breakpoint
CREATE INDEX `comment_reactions_user_id_idx` ON `comment_reactions` (`user_id`);--> statement-breakpoint
CREATE INDEX `comment_reactions_comment_id_idx` ON `comment_reactions` (`comment_id`);--> statement-breakpoint
CREATE INDEX `event_attendees_event_id_idx` ON `event_attendees` (`event_id`);--> statement-breakpoint
CREATE INDEX `event_attendees_user_id_idx` ON `event_attendees` (`user_id`);--> statement-breakpoint
CREATE INDEX `events_post_id_idx` ON `events` (`post_id`);--> statement-breakpoint
CREATE INDEX `events_start_date_idx` ON `events` (`start_date`);--> statement-breakpoint
CREATE INDEX `events_title_idx` ON `events` (`title`);--> statement-breakpoint
CREATE INDEX `events_venue_idx` ON `events` (`venue`);--> statement-breakpoint
CREATE INDEX `events_venue_location_id_idx` ON `events` (`venue_location_id`);--> statement-breakpoint
CREATE INDEX `events_event_venue_type_idx` ON `events` (`event_venue_type`);--> statement-breakpoint
CREATE INDEX `events_capacity_idx` ON `events` (`capacity`);--> statement-breakpoint
CREATE INDEX `events_current_attendees_idx` ON `events` (`current_attendees`);--> statement-breakpoint
CREATE INDEX `events_ticket_price_idx` ON `events` (`ticket_price`);--> statement-breakpoint
CREATE INDEX `events_registration_deadline_idx` ON `events` (`registration_deadline`);--> statement-breakpoint
CREATE INDEX `events_contact_info_idx` ON `events` (`contact_info`);--> statement-breakpoint
CREATE INDEX `events_end_date_idx` ON `events` (`end_date`);--> statement-breakpoint
CREATE INDEX `post_comment_media_comment_id_idx` ON `post_comment_media` (`comment_id`);--> statement-breakpoint
CREATE INDEX `post_comment_media_media_id_idx` ON `post_comment_media` (`media_id`);--> statement-breakpoint
CREATE INDEX `comments_user_id_idx` ON `post_comments` (`user_id`);--> statement-breakpoint
CREATE INDEX `comments_post_id_idx` ON `post_comments` (`post_id`);--> statement-breakpoint
CREATE INDEX `comments_status_idx` ON `post_comments` (`status`);--> statement-breakpoint
CREATE INDEX `comments_parent_id_idx` ON `post_comments` (`parent_id`);--> statement-breakpoint
CREATE INDEX `comments_mentioned_users_idx` ON `post_comments` (`mentioned_users`);--> statement-breakpoint
CREATE INDEX `comments_edited_at_idx` ON `post_comments` (`edited_at`);--> statement-breakpoint
CREATE INDEX `comments_reaction_count_idx` ON `post_comments` (`reaction_count`);--> statement-breakpoint
CREATE INDEX `comments_reply_count_idx` ON `post_comments` (`reply_count`);--> statement-breakpoint
CREATE INDEX `post_media_post_id_idx` ON `post_media` (`post_id`);--> statement-breakpoint
CREATE INDEX `post_media_media_id_idx` ON `post_media` (`media_id`);--> statement-breakpoint
CREATE INDEX `post_media_primary_idx` ON `post_media` (`is_primary`);--> statement-breakpoint
CREATE INDEX `post_media_sort_order_idx` ON `post_media` (`sort_order`);--> statement-breakpoint
CREATE INDEX `post_promotions_post_id_idx` ON `post_promotions` (`post_id`);--> statement-breakpoint
CREATE INDEX `post_promotions_user_id_idx` ON `post_promotions` (`user_id`);--> statement-breakpoint
CREATE INDEX `post_promotions_status_idx` ON `post_promotions` (`status`);--> statement-breakpoint
CREATE INDEX `post_promotions_type_idx` ON `post_promotions` (`type`);--> statement-breakpoint
CREATE INDEX `post_promotions_start_date_idx` ON `post_promotions` (`start_date`);--> statement-breakpoint
CREATE INDEX `post_promotions_end_date_idx` ON `post_promotions` (`end_date`);--> statement-breakpoint
CREATE INDEX `post_reactions_user_id_idx` ON `post_reactions` (`user_id`);--> statement-breakpoint
CREATE INDEX `post_reactions_post_id_idx` ON `post_reactions` (`post_id`);--> statement-breakpoint
CREATE INDEX `posts_user_id_idx` ON `posts` (`user_id`);--> statement-breakpoint
CREATE INDEX `posts_type_idx` ON `posts` (`type`);--> statement-breakpoint
CREATE INDEX `posts_status_idx` ON `posts` (`status`);--> statement-breakpoint
CREATE INDEX `posts_location_id_idx` ON `posts` (`location_id`);--> statement-breakpoint
CREATE INDEX `posts_published_at_idx` ON `posts` (`published_at`);--> statement-breakpoint
CREATE INDEX `posts_visibility_idx` ON `posts` (`visibility`);--> statement-breakpoint
CREATE INDEX `posts_is_promoted_idx` ON `posts` (`is_promoted`);--> statement-breakpoint
CREATE INDEX `posts_created_at_idx` ON `posts` (`created_at`);--> statement-breakpoint
CREATE INDEX `posts_updated_at_idx` ON `posts` (`updated_at`);--> statement-breakpoint
CREATE INDEX `posts_likes_count_idx` ON `posts` (`likes_count`);--> statement-breakpoint
CREATE INDEX `posts_comments_count_idx` ON `posts` (`comments_count`);--> statement-breakpoint
CREATE INDEX `posts_shares_count_idx` ON `posts` (`shares_count`);--> statement-breakpoint
CREATE INDEX `posts_views_count_idx` ON `posts` (`views_count`);--> statement-breakpoint
CREATE INDEX `post_media_product_id_idx` ON `product_media` (`post_id`);--> statement-breakpoint
CREATE INDEX `post_media_media_id_idx` ON `product_media` (`media_id`);--> statement-breakpoint
CREATE INDEX `post_media_alt_text_idx` ON `product_media` (`alt_text`);--> statement-breakpoint
CREATE INDEX `post_media_caption_idx` ON `product_media` (`caption`);--> statement-breakpoint
CREATE INDEX `post_media_is_primary_idx` ON `product_media` (`is_primary`);--> statement-breakpoint
CREATE INDEX `post_media_sort_order_idx` ON `product_media` (`sort_order`);--> statement-breakpoint
CREATE INDEX `products_post_id_idx` ON `products` (`post_id`);--> statement-breakpoint
CREATE INDEX `products_sku_idx` ON `products` (`sku`);--> statement-breakpoint
CREATE INDEX `products_price_idx` ON `products` (`price`);--> statement-breakpoint
CREATE INDEX `products_compare_price_idx` ON `products` (`compare_at_price`);--> statement-breakpoint
CREATE INDEX `products_availability_idx` ON `products` (`availability`);--> statement-breakpoint
CREATE INDEX `post_media_service_id_idx` ON `service_media` (`post_id`);--> statement-breakpoint
CREATE INDEX `post_media_media_id_idx` ON `service_media` (`media_id`);--> statement-breakpoint
CREATE INDEX `post_media_alt_text_idx` ON `service_media` (`alt_text`);--> statement-breakpoint
CREATE INDEX `post_media_caption_idx` ON `service_media` (`caption`);--> statement-breakpoint
CREATE INDEX `post_media_is_primary_idx` ON `service_media` (`is_primary`);--> statement-breakpoint
CREATE INDEX `post_media_sort_order_idx` ON `service_media` (`sort_order`);--> statement-breakpoint
CREATE INDEX `services_post_id_idx` ON `services` (`post_id`);--> statement-breakpoint
CREATE INDEX `services_type_idx` ON `services` (`service_type`);--> statement-breakpoint
CREATE INDEX `services_price_type_idx` ON `services` (`price_type`);--> statement-breakpoint
CREATE INDEX `batch_notifications_batch_id_idx` ON `batch_notifications` (`batch_id`);--> statement-breakpoint
CREATE INDEX `batch_notifications_notification_id_idx` ON `batch_notifications` (`notification_id`);--> statement-breakpoint
CREATE INDEX `notification_batches_user_id_idx` ON `notification_batches` (`user_id`);--> statement-breakpoint
CREATE INDEX `notification_batches_type_idx` ON `notification_batches` (`batch_type`);--> statement-breakpoint
CREATE INDEX `notification_batches_status_idx` ON `notification_batches` (`status`);--> statement-breakpoint
CREATE INDEX `notification_batches_scheduled_idx` ON `notification_batches` (`scheduled_for`);--> statement-breakpoint
CREATE INDEX `notification_deliveries_notification_id_idx` ON `notification_deliveries` (`notification_id`);--> statement-breakpoint
CREATE INDEX `notification_deliveries_channel_idx` ON `notification_deliveries` (`channel`);--> statement-breakpoint
CREATE INDEX `notification_deliveries_status_idx` ON `notification_deliveries` (`status`);--> statement-breakpoint
CREATE INDEX `notification_deliveries_external_id_idx` ON `notification_deliveries` (`external_id`);--> statement-breakpoint
CREATE INDEX `notification_deliveries_delivered_at_idx` ON `notification_deliveries` (`delivered_at`);--> statement-breakpoint
CREATE INDEX `notification_deliveries_retry_idx` ON `notification_deliveries` (`status`,`last_attempt_at`);--> statement-breakpoint
CREATE INDEX `notification_preferences_user_id_idx` ON `notification_preferences` (`user_id`);--> statement-breakpoint
CREATE INDEX `notification_templates_type_idx` ON `notification_templates` (`type`);--> statement-breakpoint
CREATE INDEX `notification_templates_active_idx` ON `notification_templates` (`is_active`);--> statement-breakpoint
CREATE INDEX `notifications_recipient_id_idx` ON `notifications` (`recipient_id`);--> statement-breakpoint
CREATE INDEX `notifications_sender_id_idx` ON `notifications` (`sender_id`);--> statement-breakpoint
CREATE INDEX `notifications_type_idx` ON `notifications` (`type`);--> statement-breakpoint
CREATE INDEX `notifications_entity_idx` ON `notifications` (`entity_type`,`entity_id`);--> statement-breakpoint
CREATE INDEX `notifications_read_status_idx` ON `notifications` (`is_read`);--> statement-breakpoint
CREATE INDEX `notifications_priority_idx` ON `notifications` (`priority`);--> statement-breakpoint
CREATE INDEX `notifications_group_key_idx` ON `notifications` (`group_key`);--> statement-breakpoint
CREATE INDEX `notifications_scheduled_idx` ON `notifications` (`scheduled_for`);--> statement-breakpoint
CREATE INDEX `notifications_expires_idx` ON `notifications` (`expires_at`);--> statement-breakpoint
CREATE INDEX `notifications_created_at_idx` ON `notifications` (`created_at`);--> statement-breakpoint
CREATE INDEX `notifications_recipient_unread_idx` ON `notifications` (`recipient_id`,`is_read`,`created_at`);--> statement-breakpoint
CREATE INDEX `notifications_recipient_type_idx` ON `notifications` (`recipient_id`,`type`);--> statement-breakpoint
CREATE INDEX `conversation_participants_conversation_id_idx` ON `conversation_participants` (`conversation_id`);--> statement-breakpoint
CREATE INDEX `conversation_participants_user_id_idx` ON `conversation_participants` (`user_id`);--> statement-breakpoint
CREATE INDEX `conversation_participants_active_idx` ON `conversation_participants` (`conversation_id`,`left_at`);--> statement-breakpoint
CREATE INDEX `conversation_participants_joined_at_idx` ON `conversation_participants` (`joined_at`);--> statement-breakpoint
CREATE INDEX `conversations_type_idx` ON `conversations` (`type`);--> statement-breakpoint
CREATE INDEX `conversations_name_idx` ON `conversations` (`name`);--> statement-breakpoint
CREATE INDEX `conversations_description_idx` ON `conversations` (`description`);--> statement-breakpoint
CREATE INDEX `conversations_created_by_idx` ON `conversations` (`created_by`);--> statement-breakpoint
CREATE INDEX `conversations_last_message_idx` ON `conversations` (`last_message_at`);--> statement-breakpoint
CREATE INDEX `message_attachments_message_id_idx` ON `message_attachments` (`message_id`);--> statement-breakpoint
CREATE INDEX `message_mentions_message_id_idx` ON `message_mentions` (`message_id`);--> statement-breakpoint
CREATE INDEX `message_mentions_mentioned_user_id_idx` ON `message_mentions` (`mentioned_user_id`);--> statement-breakpoint
CREATE INDEX `message_reactions_message_id_idx` ON `message_reactions` (`message_id`);--> statement-breakpoint
CREATE INDEX `message_reactions_user_id_idx` ON `message_reactions` (`user_id`);--> statement-breakpoint
CREATE INDEX `message_read_receipts_message_id_idx` ON `message_read_receipts` (`message_id`);--> statement-breakpoint
CREATE INDEX `message_read_receipts_user_id_idx` ON `message_read_receipts` (`user_id`);--> statement-breakpoint
CREATE INDEX `messages_conversation_created_idx` ON `messages` (`conversation_id`,`created_at`);--> statement-breakpoint
CREATE INDEX `messages_sender_id_idx` ON `messages` (`sender_id`);--> statement-breakpoint
CREATE INDEX `messages_reply_to_id_idx` ON `messages` (`reply_to_id`);--> statement-breakpoint
CREATE INDEX `messages_active_idx` ON `messages` (`conversation_id`,`is_deleted`,`created_at`);--> statement-breakpoint
CREATE INDEX `reviews_user_id_idx` ON `reviews` (`user_id`);--> statement-breakpoint
CREATE INDEX `reviews_business_id_idx` ON `reviews` (`business_id`);--> statement-breakpoint
CREATE INDEX `reviews_post_id_idx` ON `reviews` (`post_id`);--> statement-breakpoint
CREATE INDEX `reviews_rating_idx` ON `reviews` (`rating`);--> statement-breakpoint
CREATE INDEX `reviews_status_idx` ON `reviews` (`status`);--> statement-breakpoint
CREATE INDEX `subscription_plans_slug_idx` ON `subscription_plans` (`slug`);--> statement-breakpoint
CREATE INDEX `subscription_plans_active_idx` ON `subscription_plans` (`is_active`);--> statement-breakpoint
CREATE INDEX `subscriptions_user_id_idx` ON `subscriptions` (`user_id`);--> statement-breakpoint
CREATE INDEX `subscriptions_plan_id_idx` ON `subscriptions` (`plan_id`);--> statement-breakpoint
CREATE INDEX `subscriptions_status_idx` ON `subscriptions` (`status`);--> statement-breakpoint
CREATE INDEX `subscriptions_period_end_idx` ON `subscriptions` (`current_period_end`);--> statement-breakpoint
CREATE INDEX `advertisement_attachments_advertisement_id_idx` ON `advertisement_attachments` (`advertisement_id`);--> statement-breakpoint
CREATE INDEX `advertisement_attachments_media_id_idx` ON `advertisement_attachments` (`media_id`);--> statement-breakpoint
CREATE INDEX `advertisement_attachments_created_at_idx` ON `advertisement_attachments` (`created_at`);--> statement-breakpoint
CREATE INDEX `advertisement_targeting_advertisement_id_idx` ON `advertisement_targeting` (`advertisement_id`);--> statement-breakpoint
CREATE INDEX `advertisement_targeting_gender_idx` ON `advertisement_targeting` (`gender`);--> statement-breakpoint
CREATE INDEX `advertisement_targeting_min_age_idx` ON `advertisement_targeting` (`min_age`);--> statement-breakpoint
CREATE INDEX `advertisement_targeting_max_age_idx` ON `advertisement_targeting` (`max_age`);--> statement-breakpoint
CREATE INDEX `advertisement_targeting_age_group_idx` ON `advertisement_targeting` (`age_group`);--> statement-breakpoint
CREATE INDEX `advertisements_status_idx` ON `advertisements` (`status`);--> statement-breakpoint
CREATE INDEX `advertisements_type_idx` ON `advertisements` (`type`);--> statement-breakpoint
CREATE INDEX `advertisements_user_id_idx` ON `advertisements` (`user_id`);--> statement-breakpoint
CREATE INDEX `advertisements_placement_idx` ON `advertisements` (`placement`);--> statement-breakpoint
CREATE INDEX `advertisements_target_gender_idx` ON `advertisements` (`target_gender`);--> statement-breakpoint
CREATE INDEX `advertisements_target_age_start_idx` ON `advertisements` (`target_age_start`);--> statement-breakpoint
CREATE INDEX `advertisements_target_age_end_idx` ON `advertisements` (`target_age_end`);
ALTER TABLE `users` ADD FULLTEXT INDEX (bio) WITH PARSER MULTILINGUAL ADD_COLUMNAR_REPLICA_ON_DEMAND;
ALTER TABLE `posts` ADD FULLTEXT INDEX (content) WITH PARSER MULTILINGUAL ADD_COLUMNAR_REPLICA_ON_DEMAND;
ALTER TABLE `post_comments` ADD FULLTEXT INDEX (content) WITH PARSER MULTILINGUAL ADD_COLUMNAR_REPLICA_ON_DEMAND;
ALTER TABLE `business_profiles` ADD FULLTEXT INDEX (business_name) WITH PARSER MULTILINGUAL ADD_COLUMNAR_REPLICA_ON_DEMAND;
ALTER TABLE `business_profiles` ADD FULLTEXT INDEX (business_type) WITH PARSER MULTILINGUAL ADD_COLUMNAR_REPLICA_ON_DEMAND;
ALTER TABLE `locations` ADD FULLTEXT INDEX (name) WITH PARSER MULTILINGUAL ADD_COLUMNAR_REPLICA_ON_DEMAND;
ALTER TABLE `locations` ADD FULLTEXT INDEX (address) WITH PARSER MULTILINGUAL ADD_COLUMNAR_REPLICA_ON_DEMAND;