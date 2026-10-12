DROP INDEX `post_media_primary_idx` ON `post_media`;--> statement-breakpoint
DROP INDEX `post_media_caption_idx` ON `product_media`;--> statement-breakpoint
DROP INDEX `post_media_caption_idx` ON `service_media`;--> statement-breakpoint
ALTER TABLE `post_media` MODIFY COLUMN `alt_text` varchar(500);--> statement-breakpoint
ALTER TABLE `product_media` MODIFY COLUMN `alt_text` varchar(500);--> statement-breakpoint
ALTER TABLE `service_media` MODIFY COLUMN `alt_text` varchar(500);--> statement-breakpoint
CREATE INDEX `post_media_alt_text_idx` ON `post_media` (`alt_text`);--> statement-breakpoint
CREATE INDEX `post_media_is_primary_idx` ON `post_media` (`is_primary`);--> statement-breakpoint
ALTER TABLE `post_media` DROP COLUMN `caption`;--> statement-breakpoint
ALTER TABLE `product_media` DROP COLUMN `caption`;--> statement-breakpoint
ALTER TABLE `service_media` DROP COLUMN `caption`;