ALTER TABLE `orders` ADD `customer_id` INT UNSIGNED NULL DEFAULT NULL AFTER `id` , ADD INDEX ( customer_id );
ALTER TABLE `orders` ADD FOREIGN KEY ( `customer_id` ) REFERENCES `customers` (`id`);
INSERT INTO `customers` (`name`) SELECT DISTINCT `customer` FROM `orders` WHERE `customer` IS NOT NULL AND `customer` != '';
UPDATE `orders` SET `customer_id` = (SELECT `id` FROM `customers` WHERE `customers`.`name` = `orders`.`customer`);
ALTER TABLE `orders` DROP `customer`; 