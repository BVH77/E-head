ALTER TABLE `storage_requests` ADD FOREIGN KEY ( `asset_id` ) REFERENCES `storage_assets` (`id`) ON DELETE RESTRICT ;
ALTER TABLE `storage_requests` ADD FOREIGN KEY ( `account_id` ) REFERENCES `accounts` (`id`) ON DELETE CASCADE ;

UPDATE `acl_resources` SET `title` = 'Приказы и объявления' WHERE `name` = 'notice';

CREATE TABLE `notice` (
`id` INT( 10 ) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY ,
`title` VARCHAR( 250 ) NOT NULL ,
`text` TEXT NOT NULL ,
`account_id` INT( 10 ) UNSIGNED NOT NULL ,
`date` TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ,
INDEX ( `account_id` )
) ENGINE = InnoDB;

ALTER TABLE `notice` ADD FOREIGN KEY ( `account_id` ) REFERENCES `accounts` (`id`) ON DELETE RESTRICT ;
ALTER TABLE `notice` CHANGE `created` `date` TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ;
ALTER TABLE `notice` DROP `title`;
ALTER TABLE `notice` ADD `type` ENUM( 'объявление', 'приказ' ) NOT NULL AFTER `id`;
ALTER TABLE `notice` ADD `is_personal` TINYINT( 1 ) NOT NULL DEFAULT '0' AFTER `type`;

CREATE TABLE `notice_dst` (
`id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY ,
`notice_id` INT UNSIGNED NOT NULL ,
`account_id` INT UNSIGNED NOT NULL ,
`date` TIMESTAMP NULL DEFAULT NULL ,
INDEX ( `notice_id` ) ,
INDEX ( `account_id` ),
UNIQUE `notice_account` ( `notice_id`, `account_id` ) 
) ENGINE = InnoDB ;

ALTER TABLE `notice_dst` ADD FOREIGN KEY ( `notice_id` ) REFERENCES `notice` (`id`) ON DELETE CASCADE ;
ALTER TABLE `notice_dst` ADD FOREIGN KEY ( `account_id` ) REFERENCES `accounts` (`id`) ON DELETE CASCADE ;

-- Updated on quarant, kovshilov

CREATE TABLE `staff` (
`id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY ,
`category_id` INT UNSIGNED NOT NULL ,
`name` VARCHAR( 250 ) NOT NULL ,
`function` VARCHAR( 250 ) NOT NULL ,
`hire_date` DATE NOT NULL ,
`pay_period` ENUM( 'hour', 'day', 'month' ) NOT NULL ,
`pay_rate` INT UNSIGNED NOT NULL ,
`cv_file` VARCHAR( 250 ) NULL,
INDEX ( category_id )
) ENGINE = InnoDB ;

CREATE TABLE `staff_categories` (
`id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY ,
`name` VARCHAR( 250 ) NOT NULL ,
`parent_id` INT UNSIGNED NULL DEFAULT NULL
) ENGINE = InnoDB ;

ALTER TABLE `staff` ADD FOREIGN KEY ( `category_id` ) REFERENCES `staff_categories` (`id`) ON DELETE RESTRICT ;

CREATE TABLE `staff_hr` (
`id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY ,
`staff_id` INT UNSIGNED NOT NULL ,
`date` DATE NOT NULL ,
`value` INT UNSIGNED NOT NULL ,
`pay_period` ENUM( 'hour', 'day', 'month' ) NOT NULL ,
`pay_rate` INT UNSIGNED NOT NULL ,
INDEX ( `staff_id` ),
INDEX ( `date` ),
UNIQUE `hr` ( `staff_id`, `date` ) 
) ENGINE = InnoDB ;

ALTER TABLE `staff_hr` ADD FOREIGN KEY ( `staff_id` ) REFERENCES `staff` (`id`) ON DELETE CASCADE ;


-- Updated on quarant
