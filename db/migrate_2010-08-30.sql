ALTER TABLE `orders` CHANGE `creator_id` `creator_id` INT( 11 ) UNSIGNED NULL ;
ALTER TABLE `orders` ADD FOREIGN KEY ( `creator_id` ) REFERENCES `accounts` (`id`) ON DELETE SET NULL ;