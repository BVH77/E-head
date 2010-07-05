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

ALTER TABLE `suppliers` ADD `subcontractor_id` INT( 11 ) UNSIGNED NOT NULL ;
INSERT INTO `suppliers` (`subcontractor_id`, `name`, `description`) SELECT `id`, `name`, `description` FROM `subcontractors` ;
INSERT INTO `orders_suppliers` (`success`, `date`, `order_id`, `supplier_id`) SELECT `success`, `date`, `order_id`, `suppliers`.`id` FROM `orders_subcontractors` JOIN `suppliers` ON `suppliers`.`subcontractor_id`=`orders_subcontractors`.`subcontractor_id` ;
ALTER TABLE `suppliers` DROP `subcontractor_id` ;
DROP TABLE `orders_subcontractors` ;
DROP TABLE `subcontractors` ;

ALTER TABLE `orders_suppliers` ADD `cost` INT NULL ;
ALTER TABLE `orders_suppliers` ADD `note` TEXT NULL ;
ALTER TABLE `orders_suppliers` DROP PRIMARY KEY ;
ALTER TABLE `orders_suppliers` DROP FOREIGN KEY `orders_suppliers_ibfk_1`  ;
ALTER TABLE `orders_suppliers` DROP FOREIGN KEY `orders_suppliers_ibfk_2` ;
ALTER TABLE `orders_suppliers` ADD `id` INT( 11 ) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY FIRST ;
ALTER TABLE `orders_suppliers` DROP INDEX `order_id` ;
ALTER TABLE `orders_suppliers` DROP INDEX `supplier_id` ;
ALTER TABLE `orders_suppliers` ADD INDEX ( `order_id` );
ALTER TABLE `orders_suppliers` ADD INDEX ( `supplier_id` );
ALTER TABLE `orders_suppliers` ADD UNIQUE ( `order_id`, `supplier_id` );
ALTER TABLE `orders_suppliers` ADD FOREIGN KEY ( `order_id` ) REFERENCES `pms`.`orders` (`id`) ON DELETE CASCADE ;
ALTER TABLE `orders_suppliers` ADD FOREIGN KEY ( `supplier_id` ) REFERENCES `pms`.`suppliers` (`id`) ON DELETE CASCADE ;