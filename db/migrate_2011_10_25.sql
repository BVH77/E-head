DROP TABLE IF EXISTS `staff_payments`;
CREATE TABLE IF NOT EXISTS `staff_payments` (
  `id` int(10) unsigned NOT NULL auto_increment,
  `staff_id` int(10) unsigned NOT NULL,
  `date` date NOT NULL,
  `value` int(10) unsigned NOT NULL,
  PRIMARY KEY  (`id`),
  KEY `staff_id` (`staff_id`),
  KEY `date` (`date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

ALTER TABLE `staff_payments` ADD CONSTRAINT `staff_payments_ibfk_1` FOREIGN KEY (`staff_id`) REFERENCES `staff` (`id`) ON DELETE CASCADE;

ALTER TABLE `staff` ADD `archive` TINYINT( 1 ) UNSIGNED NOT NULL DEFAULT '0', ADD `archive_date` DATE NULL ;

DROP TABLE IF EXISTS `staff_vacations`;
CREATE TABLE IF NOT EXISTS `staff_vacations` (
  `id` int(10) unsigned NOT NULL auto_increment,
  `staff_id` int(10) unsigned NOT NULL,
  `from` date NOT NULL,
  `to` date NOT NULL,
  PRIMARY KEY  (`id`),
  KEY `staff_id` (`staff_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

ALTER TABLE `staff_vacations` ADD CONSTRAINT `staff_vacations_ibfk_1` FOREIGN KEY (`staff_id`) REFERENCES `staff` (`id`) ON DELETE CASCADE;

ALTER TABLE `storage_requests` ADD `name` VARCHAR( 250 ) NULL DEFAULT NULL AFTER `id`;
ALTER TABLE `storage_requests` ADD `measure` VARCHAR( 250 ) NULL DEFAULT NULL AFTER `name`;
ALTER TABLE `storage_requests` CHANGE `asset_id` `asset_id` INT( 10 ) UNSIGNED NULL DEFAULT NULL; 
ALTER TABLE `storage_requests` ADD `order_id` INT UNSIGNED NULL DEFAULT NULL AFTER `account_id`, ADD INDEX ( order_id );
ALTER TABLE `storage_requests` ADD FOREIGN KEY ( `order_id` ) REFERENCES `orders` (`id`) ON DELETE SET NULL;

DROP TABLE IF EXISTS `storage_history`;
CREATE TABLE IF NOT EXISTS `storage_history` (
  `id` int(10) unsigned NOT NULL auto_increment,
  `asset_id` int(10) unsigned NOT NULL,
  `order_id` int(11) unsigned DEFAULT NULL,
  `request_id` int(11) unsigned default NULL,
  `qty` int(11) NOT NULL,
  `unit_price` DOUBLE( 10, 2 ) NOT NULL,
  `created` timestamp NOT NULL default CURRENT_TIMESTAMP,
  `sender_id` int unsigned DEFAULT NULL,
  `reciever_id` int unsigned DEFAULT NULL,
  PRIMARY KEY  (`id`),
  KEY `asset_id` (`asset_id`),
  KEY `order_id` (`order_id`),
  KEY `sender_id` (`sender_id`),
  KEY `reciever_id` (`reciever_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

ALTER TABLE `storage_history`
  ADD CONSTRAINT `asset` FOREIGN KEY (`asset_id`) REFERENCES `storage_assets` (`id`),
  ADD CONSTRAINT `order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `request` FOREIGN KEY (`request_id`) REFERENCES `storage_requests` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `sender` FOREIGN KEY (`sender_id`) REFERENCES `accounts` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `reciever` FOREIGN KEY (`reciever_id`) REFERENCES `accounts` (`id`) ON DELETE SET NULL;

ALTER TABLE `staff_hr` ADD `paid` INT( 10 ) UNSIGNED NOT NULL ;

UPDATE `acl_resources` SET `title` = 'Мониторинг автотранспорта' WHERE `name`='map';

DROP TABLE IF EXISTS `orders_suppliers`;
DROP TABLE IF EXISTS `suppliers`;

DROP TABLE IF EXISTS `fixed_assets`;
CREATE TABLE `fixed_assets` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY ,
  `inventory_number` VARCHAR( 255 ) NULL ,
  `name` VARCHAR( 255 ) NOT NULL ,
  `qty` INT NOT NULL ,
  `price` INT NOT NULL ,
  `staff_id` INT UNSIGNED NULL ,
  `description` TEXT NOT NULL ,
  INDEX ( `staff_id` )
) ENGINE = InnoDB;

ALTER TABLE `fixed_assets` ADD FOREIGN KEY ( `staff_id` ) REFERENCES `staff` (`id`) ON DELETE SET NULL ;

DROP TABLE IF EXISTS `fixed_assets_files`;
CREATE TABLE IF NOT EXISTS `fixed_assets_files` (
  `id` int(11) unsigned NOT NULL auto_increment,
  `item_id` int(11) unsigned NOT NULL default '0',
  `filename` varchar(255) NOT NULL default '',
  `description` varchar(255) default NULL,
  `is_photo` tinyint(1) unsigned NOT NULL default '0',
  `original_name` varchar(255) default NULL,
  PRIMARY KEY  (`id`),
  KEY `item_id` (`item_id`)
) ENGINE=InnoDB ;

ALTER TABLE `fixed_assets_files` ADD FOREIGN KEY (`item_id`) REFERENCES `fixed_assets` (`id`) ON DELETE CASCADE ;

UPDATE `acl_roles` SET `alias` = 'admin' WHERE `name` = 'Директор';
UPDATE `acl_roles` SET `alias` = 'guest' WHERE `name` = 'Гости';
UPDATE `acl_roles` SET `alias` = 'manager' WHERE `name` = 'Менеджер';
UPDATE `acl_roles` SET `alias` = 'production' WHERE `name` = 'Производство';
UPDATE `acl_roles` SET `alias` = 'mount' WHERE `name` = 'Монтаж';
UPDATE `acl_roles` SET `alias` = 'bookkeeper' WHERE `name` = 'Бухгалтер';
UPDATE `acl_roles` SET `alias` = 'store' WHERE `name` = 'Кладовщик';
UPDATE `acl_roles` SET `alias` = 'print' WHERE `name` = 'Печать';

-- special for quarant

ALTER TABLE `orders` 
    ADD `print` TINYINT(1) UNSIGNED NOT NULL DEFAULT '1' AFTER `production`,
    ADD `print_start_planned` DATE NULL DEFAULT NULL AFTER `production_end_fact` ,
    ADD `print_start_fact` DATE NULL DEFAULT NULL AFTER `print_start_planned` ,
    ADD `print_end_planned` DATE NULL DEFAULT NULL AFTER `print_start_fact` ,
    ADD `print_end_fact` DATE NULL DEFAULT NULL AFTER `print_end_planned` ;

UPDATE `acl_resources` SET `title` = 'Печать' WHERE `name` = 'print';
UPDATE `acl_resources` SET `title` = 'Начало (план)' WHERE `name` = 'start_planned';
UPDATE `acl_resources` SET `title` = 'Начало (факт)' WHERE `name` = 'start_fact';
UPDATE `acl_resources` SET `title` = 'Конец (план)' WHERE `name` = 'end_planned';
UPDATE `acl_resources` SET `title` = 'Конец (факт)' WHERE `name` = 'end_fact';
UPDATE `acl_resources` SET `title` = 'Скрывать заказы без печати' WHERE `name` = 'hideprint';

-- special for quarant