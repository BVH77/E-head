-- Migrated on: pms_quarant & pms_demo

CREATE TABLE `storage_assets_categories` (
`id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY ,
`asset_id` INT UNSIGNED NOT NULL ,
`category_id` INT UNSIGNED NOT NULL ,
INDEX ( `asset_id` ), 
INDEX (`category_id` )
) ENGINE = InnoDB;
ALTER TABLE `storage_assets_categories` ADD UNIQUE `pair` ( `asset_id` , `category_id` );
ALTER TABLE `storage_assets_categories` ADD FOREIGN KEY ( `asset_id` ) REFERENCES `storage_assets` (`id`) ON DELETE CASCADE ;
ALTER TABLE `storage_assets_categories` ADD FOREIGN KEY ( `category_id` ) REFERENCES `storage_categories` (`id`) ON DELETE CASCADE ;

INSERT INTO `storage_assets_categories` (`asset_id`, `category_id`) SELECT `id`, `category_id` FROM `storage_assets` WHERE `category_id` IS NOT NULL;

ALTER TABLE `storage_assets` DROP `category_id`;

ALTER TABLE `storage_assets` ADD `checked` TINYINT( 1 ) NOT NULL ;