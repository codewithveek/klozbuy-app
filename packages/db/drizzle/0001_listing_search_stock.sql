ALTER TABLE `listing_search` ADD `stock_status` varchar(16) DEFAULT 'in_stock' NOT NULL;--> statement-breakpoint
ALTER TABLE `listing_search` ADD `stock_confirmed_at` datetime(3);