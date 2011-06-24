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
  `account_id` int(10) unsigned NOT NULL,
  `order_id` int(11) unsigned default NULL,
  `request_id` int(11) unsigned default NULL,
  `qty` int(11) NOT NULL,
  `created` timestamp NOT NULL default CURRENT_TIMESTAMP,
  PRIMARY KEY  (`id`),
  KEY `asset_id` (`asset_id`),
  KEY `account_id` (`account_id`),
  KEY `order_id` (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

ALTER TABLE `storage_history`
  ADD CONSTRAINT `storage_history_ibfk_4` FOREIGN KEY (`request_id`) REFERENCES `storage_requests` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `storage_history_ibfk_1` FOREIGN KEY (`asset_id`) REFERENCES `storage_assets` (`id`),
  ADD CONSTRAINT `storage_history_ibfk_2` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`id`),
  ADD CONSTRAINT `storage_history_ibfk_3` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE SET NULL;


-- apllied on quarant

