CREATE TABLE IF NOT EXISTS `orders_payments` (
  `id` int(10) unsigned NOT NULL auto_increment,
  `order_id` int(10) unsigned NOT NULL,
  `date` date NOT NULL,
  `summ` double(10,2) NOT NULL,
  `status` int(10) unsigned NOT NULL,
  PRIMARY KEY  (`id`),
  KEY `order_id` (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

ALTER TABLE `orders_payments`
  ADD CONSTRAINT `order_id` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE;


UPDATE `acl_resources` SET `title` = 'Платежи' WHERE `name` = 'payments';