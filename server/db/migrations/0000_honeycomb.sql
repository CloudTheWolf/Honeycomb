CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`username` varchar(150) NOT NULL,
	`email` varchar(150) NOT NULL,
	`password` varchar(255) NOT NULL,
	`auth_provider` varchar(50) NOT NULL DEFAULT 'local',
	`enabled` tinyint NOT NULL DEFAULT 1,
	`role` int NOT NULL DEFAULT 1,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_username_unique` UNIQUE(`username`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `version` (
	`item` varchar(50) NOT NULL,
	`version_str` varchar(50) NOT NULL,
	CONSTRAINT `version_item_unique` UNIQUE(`item`)
);
