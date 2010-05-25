CREATE TABLE IF NOT EXISTS `customers` (
  `id` int(11) unsigned NOT NULL auto_increment,
  `name` varchar(255) NOT NULL,
  `description` text NOT NULL,
  PRIMARY KEY  (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT AUTO_INCREMENT=11 ;
ALTER TABLE `orders` ADD `customer_id` INT UNSIGNED NULL DEFAULT NULL AFTER `id` , ADD INDEX ( customer_id );
ALTER TABLE `orders` ADD FOREIGN KEY ( `customer_id` ) REFERENCES `customers` (`id`);
INSERT INTO `customers` (`name`) SELECT DISTINCT `customer` FROM `orders` WHERE `customer` IS NOT NULL AND `customer` != '';
UPDATE `orders` SET `customer_id` = (SELECT `id` FROM `customers` WHERE `customers`.`name` = `orders`.`customer`);
ALTER TABLE `orders` DROP `customer`; 