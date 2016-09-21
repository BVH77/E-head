ALTER TABLE `orders_payments` ADD `bill` TEXT NOT NULL AFTER `order_id`;
ALTER TABLE `orders_payments` ADD `date_pay` DATE NULL AFTER `date`;
ALTER TABLE `orders_payments` ADD `summ_pay` DOUBLE(10,2) NOT NULL AFTER `summ`;

UPDATE `orders_payments` SET `bill`=`date`;
UPDATE `orders_payments` SET `date_pay`=`date`, `summ_pay`=`summ` WHERE `status`=1;

ALTER TABLE `orders_payments` DROP `status`;