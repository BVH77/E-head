ALTER TABLE `storage_requests` ADD FOREIGN KEY ( `asset_id` ) REFERENCES `storage_assets` (`id`) ON DELETE RESTRICT ;
ALTER TABLE `storage_requests` ADD FOREIGN KEY ( `account_id` ) REFERENCES `accounts` (`id`) ON DELETE CASCADE ;

UPDATE `acl_resources` SET `title` = 'Приказы и объявления' WHERE `name` = 'notice';

CREATE TABLE `notice` (
`id` INT( 10 ) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY ,
`title` VARCHAR( 250 ) NOT NULL ,
`text` TEXT NOT NULL ,
`account_id` INT( 10 ) UNSIGNED NOT NULL ,
`created` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ,
INDEX ( `account_id` )
) ENGINE = InnoDB;

ALTER TABLE `notice` ADD FOREIGN KEY ( `account_id` ) REFERENCES `accounts` (`id`) ON DELETE RESTRICT ;

-- Updated on quarant, kovshilov, kosorilov

ALTER TABLE `notice` DROP `title`;
ALTER TABLE `notice` ADD `type` ENUM( 'объявление', 'уведомление', 'приказ' ) NOT NULL AFTER `id`;
ALTER TABLE `notice` ADD `dst_type` ENUM( 'all', 'roles', 'users' ) NOT NULL AFTER `type`;