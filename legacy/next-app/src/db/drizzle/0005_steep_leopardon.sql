CREATE TABLE `post_comment_mentions` (
	`id` varchar(36) NOT NULL,
	`comment_id` varchar(36) NOT NULL,
	`mentioned_user_id` varchar(36) NOT NULL,
	`position_start` int,
	`position_end` int,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `post_comment_mentions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `post_mentions` (
	`id` varchar(36) NOT NULL,
	`post_id` varchar(36) NOT NULL,
	`mentioned_user_id` varchar(36) NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `post_mentions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
DROP INDEX `comments_mentioned_users_idx` ON `post_comments`;--> statement-breakpoint
ALTER TABLE `post_comment_mentions` ADD CONSTRAINT `post_comment_mentions_comment_id_post_comments_id_fk` FOREIGN KEY (`comment_id`) REFERENCES `post_comments`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `post_comment_mentions` ADD CONSTRAINT `post_comment_mentions_mentioned_user_id_users_id_fk` FOREIGN KEY (`mentioned_user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `post_mentions` ADD CONSTRAINT `post_mentions_post_id_posts_id_fk` FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `post_mentions` ADD CONSTRAINT `post_mentions_mentioned_user_id_users_id_fk` FOREIGN KEY (`mentioned_user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `comment_mentions_comment_id_idx` ON `post_comment_mentions` (`comment_id`);--> statement-breakpoint
CREATE INDEX `comment_mentions_user_id_idx` ON `post_comment_mentions` (`mentioned_user_id`);--> statement-breakpoint
ALTER TABLE `post_comments` DROP COLUMN `mentioned_users`;