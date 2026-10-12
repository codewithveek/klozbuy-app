ALTER TABLE `business_profiles` RENAME COLUMN `business_type` TO `business_category`;--> statement-breakpoint
ALTER TABLE `business_profiles` RENAME COLUMN `rating` TO `average_rating`;--> statement-breakpoint
ALTER TABLE `business_profiles` RENAME COLUMN `established_year` TO `registered_date`;--> statement-breakpoint
ALTER TABLE `users` RENAME COLUMN `avatar_url` TO `profile_picture_url`;--> statement-breakpoint
DROP INDEX `business_profiles_established_year_idx` ON `business_profiles`;--> statement-breakpoint
DROP INDEX `business_profiles_business_type_idx` ON `business_profiles`;--> statement-breakpoint
DROP INDEX `business_profiles_rating_idx` ON `business_profiles`;--> statement-breakpoint
CREATE INDEX `business_profiles_registred_date_idx` ON `business_profiles` (`registered_date`);--> statement-breakpoint
CREATE INDEX `business_profiles_business_category_idx` ON `business_profiles` (`business_category`);--> statement-breakpoint
CREATE INDEX `business_profiles_average_rating_idx` ON `business_profiles` (`average_rating`);