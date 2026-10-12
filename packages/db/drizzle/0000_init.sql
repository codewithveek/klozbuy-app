CREATE TABLE `categories` (
	`id` char(16) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
	`parent_id` char(16) CHARACTER SET ascii COLLATE ascii_bin,
	`slug` varchar(80) NOT NULL,
	`name` varchar(80) NOT NULL,
	`type` varchar(16) NOT NULL,
	`position` smallint unsigned NOT NULL DEFAULT 0,
	`created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updated_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	CONSTRAINT `categories_id` PRIMARY KEY(`id`),
	CONSTRAINT `categories_slug_uq` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `listing_media` (
	`id` char(16) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
	`listing_id` char(16) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
	`object_key` varchar(255) NOT NULL,
	`width` int unsigned NOT NULL,
	`height` int unsigned NOT NULL,
	`position` smallint unsigned NOT NULL DEFAULT 0,
	`created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updated_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	CONSTRAINT `listing_media_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `listings` (
	`id` char(16) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
	`shop_id` char(16) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
	`slug` varchar(80) NOT NULL,
	`type` varchar(16) NOT NULL,
	`title` varchar(120) NOT NULL,
	`description` text,
	`price_ngn` bigint unsigned NOT NULL,
	`negotiable` boolean NOT NULL DEFAULT false,
	`condition` varchar(16),
	`stock_status` varchar(16) NOT NULL DEFAULT 'in_stock',
	`stock_confirmed_at` datetime(3),
	`status` varchar(16) NOT NULL DEFAULT 'draft',
	`category_id` char(16) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
	`created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updated_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	CONSTRAINT `listings_id` PRIMARY KEY(`id`),
	CONSTRAINT `listings_slug_uq` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `areas` (
	`id` char(16) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
	`slug` varchar(80) NOT NULL,
	`name` varchar(80) NOT NULL,
	`city` varchar(80) NOT NULL,
	`state` varchar(40) NOT NULL,
	`lat` double NOT NULL,
	`lng` double NOT NULL,
	`created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updated_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	CONSTRAINT `areas_id` PRIMARY KEY(`id`),
	CONSTRAINT `areas_slug_uq` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `listing_search` (
	`listing_id` char(16) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
	`slug` varchar(80) NOT NULL,
	`type` varchar(16) NOT NULL,
	`title` varchar(120) NOT NULL,
	`price_ngn` bigint unsigned NOT NULL,
	`negotiable` boolean NOT NULL,
	`condition` varchar(16),
	`cover_image_key` varchar(255),
	`category_id` char(16) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
	`status` varchar(16) NOT NULL,
	`shop_id` char(16) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
	`shop_slug` varchar(80) NOT NULL,
	`shop_name` varchar(100) NOT NULL,
	`verified` boolean NOT NULL,
	`rating_avg` double,
	`rating_count` int unsigned NOT NULL DEFAULT 0,
	`area_id` char(16) CHARACTER SET ascii COLLATE ascii_bin,
	`landmark` varchar(150) NOT NULL,
	`lat` double NOT NULL,
	`lng` double NOT NULL,
	`h3r7` char(15) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
	`h3r8` char(15) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
	`rank` int NOT NULL DEFAULT 0,
	`boosted_until` datetime(3),
	`created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updated_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	CONSTRAINT `listing_search_listing_id` PRIMARY KEY(`listing_id`)
);
--> statement-breakpoint
CREATE TABLE `search_terms` (
	`term` varchar(40) NOT NULL,
	`h3r7` char(15) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
	`listing_id` char(16) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
	`created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updated_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	CONSTRAINT `search_terms_pk` PRIMARY KEY(`term`,`h3r7`,`listing_id`)
);
--> statement-breakpoint
CREATE TABLE `accounts` (
	`id` char(16) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
	`user_id` char(16) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
	`account_id` varchar(255) NOT NULL,
	`provider_id` varchar(64) NOT NULL,
	`access_token` text,
	`refresh_token` text,
	`id_token` text,
	`access_token_expires_at` datetime(3),
	`refresh_token_expires_at` datetime(3),
	`scope` varchar(500),
	`password` varchar(255),
	`created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updated_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	CONSTRAINT `accounts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` char(16) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
	`user_id` char(16) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
	`token` varchar(255) NOT NULL,
	`expires_at` datetime(3) NOT NULL,
	`ip_address` varchar(45),
	`user_agent` varchar(500),
	`created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updated_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	CONSTRAINT `sessions_id` PRIMARY KEY(`id`),
	CONSTRAINT `sessions_token_uq` UNIQUE(`token`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` char(16) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
	`name` varchar(100) NOT NULL,
	`email` varchar(255) NOT NULL,
	`email_verified` boolean NOT NULL DEFAULT false,
	`image` varchar(500),
	`phone_number` varchar(16),
	`phone_number_verified` boolean NOT NULL DEFAULT false,
	`role` varchar(16) NOT NULL DEFAULT 'buyer',
	`consented_at` datetime(3),
	`created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updated_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_phone_number_uq` UNIQUE(`phone_number`),
	CONSTRAINT `users_email_uq` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `verifications` (
	`id` char(16) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
	`identifier` varchar(255) NOT NULL,
	`value` varchar(255) NOT NULL,
	`expires_at` datetime(3) NOT NULL,
	`created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updated_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	CONSTRAINT `verifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `lead_events` (
	`id` char(16) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
	`listing_id` char(16) CHARACTER SET ascii COLLATE ascii_bin,
	`shop_id` char(16) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
	`buyer_id` char(16) CHARACTER SET ascii COLLATE ascii_bin,
	`channel` varchar(16) NOT NULL,
	`outcome` varchar(16) NOT NULL DEFAULT 'unknown',
	`followed_up_at` datetime(3),
	`created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updated_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	CONSTRAINT `lead_events_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `shop_daily_stats` (
	`shop_id` char(16) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
	`day` date NOT NULL,
	`views` int unsigned NOT NULL DEFAULT 0,
	`whatsapp_taps` int unsigned NOT NULL DEFAULT 0,
	`calls` int unsigned NOT NULL DEFAULT 0,
	`directions` int unsigned NOT NULL DEFAULT 0,
	`created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updated_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	CONSTRAINT `shop_daily_stats_pk` PRIMARY KEY(`shop_id`,`day`)
);
--> statement-breakpoint
CREATE TABLE `reports` (
	`id` char(16) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
	`reporter_id` char(16) CHARACTER SET ascii COLLATE ascii_bin,
	`target_type` varchar(16) NOT NULL,
	`target_id` char(16) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
	`reason` varchar(32) NOT NULL,
	`details` varchar(1000),
	`status` varchar(16) NOT NULL DEFAULT 'open',
	`created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updated_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	CONSTRAINT `reports_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `idempotency_keys` (
	`scope` varchar(64) NOT NULL,
	`key` varchar(64) NOT NULL,
	`request_hash` varchar(64) NOT NULL,
	`response_status` smallint unsigned NOT NULL,
	`response_body` json NOT NULL,
	`expires_at` datetime(3) NOT NULL,
	`created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updated_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	CONSTRAINT `idempotency_keys_pk` PRIMARY KEY(`scope`,`key`)
);
--> statement-breakpoint
CREATE TABLE `outbox` (
	`id` char(16) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
	`topic` varchar(64) NOT NULL,
	`payload` json NOT NULL,
	`attempts` smallint unsigned NOT NULL DEFAULT 0,
	`sent_at` datetime(3),
	`created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updated_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	CONSTRAINT `outbox_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `buyer_requests` (
	`id` char(16) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
	`buyer_id` char(16) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
	`text` varchar(500) NOT NULL,
	`category_id` char(16) CHARACTER SET ascii COLLATE ascii_bin,
	`budget_ngn` bigint unsigned,
	`lat` double NOT NULL,
	`lng` double NOT NULL,
	`h3r7` char(15) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
	`status` varchar(16) NOT NULL DEFAULT 'open',
	`expires_at` datetime(3) NOT NULL,
	`created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updated_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	CONSTRAINT `buyer_requests_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `request_offers` (
	`id` char(16) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
	`request_id` char(16) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
	`shop_id` char(16) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
	`listing_id` char(16) CHARACTER SET ascii COLLATE ascii_bin,
	`price_ngn` bigint unsigned NOT NULL,
	`message` varchar(500),
	`created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updated_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	CONSTRAINT `request_offers_id` PRIMARY KEY(`id`),
	CONSTRAINT `request_offers_one_per_shop_uq` UNIQUE(`request_id`,`shop_id`)
);
--> statement-breakpoint
CREATE TABLE `reviews` (
	`id` char(16) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
	`shop_id` char(16) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
	`lead_id` char(16) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
	`buyer_id` char(16) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
	`rating` tinyint unsigned NOT NULL,
	`body` text,
	`status` varchar(16) NOT NULL DEFAULT 'published',
	`created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updated_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	CONSTRAINT `reviews_id` PRIMARY KEY(`id`),
	CONSTRAINT `reviews_lead_uq` UNIQUE(`lead_id`)
);
--> statement-breakpoint
CREATE TABLE `shop_locations` (
	`id` char(16) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
	`shop_id` char(16) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
	`lat` double NOT NULL,
	`lng` double NOT NULL,
	`h3r7` char(15) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
	`h3r8` char(15) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
	`landmark` varchar(150) NOT NULL,
	`address` varchar(255),
	`area_id` char(16) CHARACTER SET ascii COLLATE ascii_bin,
	`is_primary` boolean NOT NULL DEFAULT true,
	`created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updated_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	CONSTRAINT `shop_locations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `shop_verifications` (
	`id` char(16) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
	`shop_id` char(16) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
	`agent_id` char(16) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
	`scheduled_for` datetime(3),
	`visited_at` datetime(3),
	`result` varchar(16),
	`notes` text,
	`created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updated_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	CONSTRAINT `shop_verifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `shops` (
	`id` char(16) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
	`owner_id` char(16) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
	`slug` varchar(80) NOT NULL,
	`name` varchar(100) NOT NULL,
	`category_id` char(16) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
	`description` varchar(500),
	`whatsapp_number` varchar(16) NOT NULL,
	`verification_status` varchar(16) NOT NULL DEFAULT 'unverified',
	`verified_at` datetime(3),
	`rating_avg` double,
	`rating_count` int unsigned NOT NULL DEFAULT 0,
	`created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updated_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	CONSTRAINT `shops_id` PRIMARY KEY(`id`),
	CONSTRAINT `shops_slug_uq` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE INDEX `categories_parent_idx` ON `categories` (`parent_id`,`position`);--> statement-breakpoint
CREATE INDEX `listing_media_listing_idx` ON `listing_media` (`listing_id`,`position`);--> statement-breakpoint
CREATE INDEX `listings_shop_status_idx` ON `listings` (`shop_id`,`status`,`updated_at`);--> statement-breakpoint
CREATE INDEX `listing_search_r7_idx` ON `listing_search` (`h3r7`,`status`,`category_id`);--> statement-breakpoint
CREATE INDEX `listing_search_r8_idx` ON `listing_search` (`h3r8`,`status`,`category_id`);--> statement-breakpoint
CREATE INDEX `listing_search_area_idx` ON `listing_search` (`area_id`,`category_id`,`status`,`rank`);--> statement-breakpoint
CREATE INDEX `listing_search_shop_idx` ON `listing_search` (`shop_id`);--> statement-breakpoint
CREATE INDEX `listing_search_status_idx` ON `listing_search` (`status`,`updated_at`);--> statement-breakpoint
CREATE INDEX `search_terms_listing_idx` ON `search_terms` (`listing_id`);--> statement-breakpoint
CREATE INDEX `accounts_user_idx` ON `accounts` (`user_id`);--> statement-breakpoint
CREATE INDEX `sessions_user_idx` ON `sessions` (`user_id`);--> statement-breakpoint
CREATE INDEX `verifications_identifier_idx` ON `verifications` (`identifier`);--> statement-breakpoint
CREATE INDEX `lead_events_shop_idx` ON `lead_events` (`shop_id`,`created_at`);--> statement-breakpoint
CREATE INDEX `lead_events_follow_up_idx` ON `lead_events` (`followed_up_at`,`created_at`);--> statement-breakpoint
CREATE INDEX `lead_events_buyer_idx` ON `lead_events` (`buyer_id`,`created_at`);--> statement-breakpoint
CREATE INDEX `reports_queue_idx` ON `reports` (`status`,`created_at`);--> statement-breakpoint
CREATE INDEX `reports_target_idx` ON `reports` (`target_type`,`target_id`);--> statement-breakpoint
CREATE INDEX `idempotency_keys_expiry_idx` ON `idempotency_keys` (`expires_at`);--> statement-breakpoint
CREATE INDEX `outbox_unsent_idx` ON `outbox` (`sent_at`,`created_at`);--> statement-breakpoint
CREATE INDEX `buyer_requests_area_idx` ON `buyer_requests` (`h3r7`,`status`,`category_id`,`created_at`);--> statement-breakpoint
CREATE INDEX `buyer_requests_buyer_idx` ON `buyer_requests` (`buyer_id`,`created_at`);--> statement-breakpoint
CREATE INDEX `request_offers_request_idx` ON `request_offers` (`request_id`,`created_at`);--> statement-breakpoint
CREATE INDEX `reviews_shop_idx` ON `reviews` (`shop_id`,`status`,`created_at`);--> statement-breakpoint
CREATE INDEX `shop_locations_shop_idx` ON `shop_locations` (`shop_id`);--> statement-breakpoint
CREATE INDEX `shop_locations_h3r7_idx` ON `shop_locations` (`h3r7`);--> statement-breakpoint
CREATE INDEX `shop_verifications_shop_idx` ON `shop_verifications` (`shop_id`,`created_at`);--> statement-breakpoint
CREATE INDEX `shop_verifications_agent_idx` ON `shop_verifications` (`agent_id`,`scheduled_for`);--> statement-breakpoint
CREATE INDEX `shops_owner_idx` ON `shops` (`owner_id`);--> statement-breakpoint
CREATE INDEX `shops_verification_idx` ON `shops` (`verification_status`,`created_at`);