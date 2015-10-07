SET FOREIGN_KEY_CHECKS=0;

ALTER TABLE `orders` ADD `mount_budget` DOUBLE(10,2) UNSIGNED NULL AFTER `success_date_fact`;