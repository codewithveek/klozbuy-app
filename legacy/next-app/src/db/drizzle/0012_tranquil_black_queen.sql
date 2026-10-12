RENAME TABLE `audio` TO `audios`;--> statement-breakpoint
ALTER TABLE `audios` DROP FOREIGN KEY `audio_media_id_media_id_fk`;
--> statement-breakpoint
ALTER TABLE `audios` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `audios` ADD PRIMARY KEY(`id`);--> statement-breakpoint
ALTER TABLE `audios` ADD CONSTRAINT `audios_media_id_media_id_fk` FOREIGN KEY (`media_id`) REFERENCES `media`(`id`) ON DELETE cascade ON UPDATE no action;