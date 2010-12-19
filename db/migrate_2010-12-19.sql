CREATE TABLE `storage_assets` (
`id` INT( 11 ) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY ,
`name` VARCHAR( 250 ) NOT NULL ,
`measure` VARCHAR( 50 ) NULL DEFAULT NULL,
`category_id` INT( 11 ) UNSIGNED NULL,
INDEX ( `category_id` )
) ENGINE = InnoDB;

CREATE TABLE `storage_assets_categories` (
`id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY ,
`name` VARCHAR( 250 ) NOT NULL ,
`parent_id` INT UNSIGNED NULL DEFAULT NULL ,
INDEX ( `parent_id` )
) ENGINE = InnoDB;