CREATE TABLE IF NOT EXISTS `orders_budget_groups` (
  `id` int(10) unsigned NOT NULL auto_increment,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY  (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=6 ;

INSERT INTO `orders_budget_groups` (`id`, `name`) VALUES
(1, 'Выезд на замеры (Москва и обл.)'),
(2, 'Выезд на замеры (другой город)'),
(3, 'Монтаж (Москва)'),
(4, 'Монтаж (другой город)'),
(5, 'Командировочные (если монтаж в другом городе)');

CREATE TABLE IF NOT EXISTS `orders_budget` (
  `id` int(10) unsigned NOT NULL auto_increment,
  `order_id` int(10) unsigned NOT NULL,
  `group_id` int(10) unsigned NOT NULL,
  `name` varchar(255) NOT NULL,
  `measure` varchar(255) NOT NULL,
  `qty` int(10) NOT NULL,
  `price` double(10,2) NOT NULL,
  `margin` double(10,2) NOT NULL,
  PRIMARY KEY  (`id`),
  KEY `order_id` (`order_id`),
  KEY `group_id` (`group_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

ALTER TABLE `orders_budget`
  ADD CONSTRAINT `orders_budget_ibfk_2` FOREIGN KEY (`group_id`) REFERENCES `orders_budget_groups` (`id`),
  ADD CONSTRAINT `orders_budget_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;