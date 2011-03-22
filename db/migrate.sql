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
ALTER TABLE `notice` ADD `type` ENUM( 'объявление', 'уведомление', 'приказ' ) NOT NULL AFTER `id`;
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