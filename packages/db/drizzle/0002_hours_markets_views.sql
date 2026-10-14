CREATE TABLE `listing_daily_stats` (
	`listing_id` char(16) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
	`day` date NOT NULL,
	`shop_id` char(16) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
	`views` int unsigned NOT NULL DEFAULT 0,
	`created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updated_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	CONSTRAINT `listing_daily_stats_pk` PRIMARY KEY(`listing_id`,`day`)
);
--> statement-breakpoint
ALTER TABLE `areas` ADD `kind` varchar(16) DEFAULT 'area' NOT NULL;--> statement-breakpoint
ALTER TABLE `areas` ADD `description` varchar(120);--> statement-breakpoint
ALTER TABLE `listing_search` ADD `summary` varchar(120);--> statement-breakpoint
ALTER TABLE `listing_search` ADD `opens_at` varchar(5);--> statement-breakpoint
ALTER TABLE `listing_search` ADD `closes_at` varchar(5);--> statement-breakpoint
ALTER TABLE `listing_search` ADD `open_days` varchar(16) DEFAULT '1,2,3,4,5,6' NOT NULL;--> statement-breakpoint
ALTER TABLE `lead_events` ADD `distance_km` double;--> statement-breakpoint
ALTER TABLE `lead_events` ADD `offer_id` char(16) CHARACTER SET ascii COLLATE ascii_bin;--> statement-breakpoint
ALTER TABLE `shops` ADD `opens_at` varchar(5);--> statement-breakpoint
ALTER TABLE `shops` ADD `closes_at` varchar(5);--> statement-breakpoint
ALTER TABLE `shops` ADD `open_days` varchar(16) DEFAULT '1,2,3,4,5,6' NOT NULL;--> statement-breakpoint
CREATE INDEX `listing_daily_stats_shop_idx` ON `listing_daily_stats` (`shop_id`,`day`);