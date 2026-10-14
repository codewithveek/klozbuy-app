ALTER TABLE `users` MODIFY COLUMN `bio` varchar(255);--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `display_username` varchar(50);--> statement-breakpoint
ALTER TABLE `advertisements` MODIFY COLUMN `title` varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE `advertisements` MODIFY COLUMN `content` varchar(500) NOT NULL;