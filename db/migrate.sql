ALTER TABLE `storage_assets` ADD `qty` INT( 11 ) UNSIGNED NOT NULL;
ALTER TABLE `storage_assets` ADD `unit_price` DOUBLE( 10, 2 ) NOT NULL;
UPDATE `storage_assets` SET `qty` = (SELECT `qty` FROM `storage_availability` WHERE `asset_id`=`storage_assets`.`id` LIMIT 1);
DROP TABLE `storage_availability`;

CREATE TABLE `storage_measures` (
`name` VARCHAR( 50 ) NOT NULL ,
PRIMARY KEY ( `name` )
) ENGINE = InnoDB;

INSERT INTO `storage_measures` (`name`) VALUES ('шт.'), ('л'), ('кг'), ('м'), ('кв.м'), ('куб.м');

RENAME TABLE `storage_assets_categories` TO `storage_categories`;

-- Migrated on: pms_quarant & pms_demo