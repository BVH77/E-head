-- phpMyAdmin SQL Dump
-- version 2.8.2.4
-- http://www.phpmyadmin.net
-- 
-- Хост: localhost:3306
-- Время создания: Окт 18 2010 г., 23:34
-- Версия сервера: 5.0.32
-- Версия PHP: 5.2.6

SET FOREIGN_KEY_CHECKS=0;
-- 
-- БД: `pms_demo`
-- 

-- --------------------------------------------------------

-- 
-- Структура таблицы `accounts`
-- 

DROP TABLE IF EXISTS `accounts`;
CREATE TABLE IF NOT EXISTS `accounts` (
  `id` int(11) unsigned NOT NULL auto_increment,
  `login` varchar(100) NOT NULL,
  `password` varchar(32) character set utf8 collate utf8_bin NOT NULL,
  `role_id` int(11) unsigned NOT NULL,
  `name` varchar(255) default NULL,
  `email` varchar(255) default NULL,
  `phone` varchar(20) default NULL,
  `state` text COMMENT 'store user interface state',
  `active` tinyint(1) NOT NULL default '1',
  PRIMARY KEY  (`id`),
  UNIQUE KEY `login` (`login`),
  KEY `fk_role_id` (`role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=3 ;

-- 
-- Дамп данных таблицы `accounts`
-- 

INSERT INTO `accounts` (`id`, `login`, `password`, `role_id`, `name`, `email`, `phone`, `state`, `active`) VALUES (1, 'admin', 0x6264346432626130613063633164313539393237313534303666373534313231, 1, 'Администратор', 'admin@e-head.ru', '', NULL, 1);

-- --------------------------------------------------------

-- 
-- Структура таблицы `acl_permissions`
-- 

DROP TABLE IF EXISTS `acl_permissions`;
CREATE TABLE IF NOT EXISTS `acl_permissions` (
  `id` int(11) NOT NULL auto_increment,
  `role_id` int(11) unsigned NOT NULL,
  `resource_id` int(11) unsigned NOT NULL,
  `privilege_id` tinyint(3) unsigned NOT NULL,
  PRIMARY KEY  (`id`),
  UNIQUE KEY `role_id_2` (`role_id`,`resource_id`,`privilege_id`),
  KEY `fk_role_id` (`role_id`),
  KEY `fk_resource_id` (`resource_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1593 ;

-- 
-- Дамп данных таблицы `acl_permissions`
-- 

INSERT INTO `acl_permissions` (`id`, `role_id`, `resource_id`, `privilege_id`) VALUES (1094, 1, 50, 1),
(1095, 1, 50, 2),
(1096, 1, 50, 3),
(1097, 1, 50, 4),
(1102, 1, 123, 1),
(1103, 1, 123, 2),
(1104, 1, 123, 3),
(1105, 1, 123, 4),
(1114, 1, 126, 1),
(1115, 1, 126, 2),
(1116, 1, 126, 3),
(1117, 1, 126, 4),
(1133, 1, 127, 1),
(1135, 1, 127, 2),
(1137, 1, 127, 3),
(1139, 1, 127, 4),
(1154, 1, 129, 1),
(1159, 1, 129, 2),
(1169, 1, 129, 3),
(1170, 1, 129, 4),
(1318, 1, 130, 1),
(1160, 1, 130, 2),
(1168, 1, 130, 3),
(1171, 1, 130, 4),
(1156, 1, 131, 1),
(1161, 1, 131, 2),
(1167, 1, 131, 3),
(1172, 1, 131, 4),
(1157, 1, 132, 1),
(1162, 1, 132, 2),
(1165, 1, 132, 3),
(1173, 1, 132, 4),
(1158, 1, 133, 1),
(1163, 1, 133, 2),
(1166, 1, 133, 3),
(1174, 1, 133, 4),
(1319, 1, 136, 1),
(1326, 1, 136, 2),
(1327, 1, 136, 3),
(1331, 1, 136, 4),
(1320, 1, 137, 1),
(1325, 1, 137, 2),
(1328, 1, 137, 3),
(1332, 1, 137, 4),
(1321, 1, 138, 1),
(1324, 1, 138, 2),
(1329, 1, 138, 3),
(1333, 1, 138, 4),
(1335, 1, 139, 1),
(1342, 1, 139, 2),
(1343, 1, 139, 3),
(1350, 1, 139, 4),
(1322, 1, 140, 1),
(1323, 1, 140, 2),
(1330, 1, 140, 3),
(1334, 1, 140, 4),
(1337, 1, 142, 1),
(1340, 1, 142, 2),
(1345, 1, 142, 3),
(1348, 1, 142, 4),
(1338, 1, 143, 1),
(1339, 1, 143, 2),
(1346, 1, 143, 3),
(1347, 1, 143, 4),
(1351, 1, 144, 1),
(1353, 1, 144, 2),
(1355, 1, 144, 3),
(1357, 1, 144, 4),
(1352, 1, 145, 1),
(1354, 1, 145, 2),
(1356, 1, 145, 3),
(1358, 1, 145, 4),
(1486, 1, 146, 1),
(1487, 1, 146, 2),
(1488, 1, 146, 3),
(1489, 1, 146, 4),
(1511, 1, 147, 1),
(1512, 1, 147, 2),
(1513, 1, 147, 3),
(1514, 1, 147, 4),
(1515, 1, 148, 1),
(1516, 1, 148, 2),
(1517, 1, 148, 3),
(1518, 1, 148, 4),
(1577, 1, 149, 1),
(1578, 1, 149, 2),
(1579, 1, 149, 3),
(1580, 1, 149, 4),
(1249, 3, 123, 1),
(1119, 3, 123, 2),
(1250, 3, 123, 3),
(1121, 3, 123, 4),
(1261, 3, 126, 1),
(1127, 3, 126, 2),
(1262, 3, 126, 3),
(1129, 3, 126, 4),
(1206, 3, 127, 1),
(1264, 3, 129, 1),
(1176, 3, 129, 2),
(1263, 3, 129, 3),
(1178, 3, 129, 4),
(1301, 3, 130, 1),
(1571, 3, 130, 2),
(1572, 3, 130, 3),
(1573, 3, 130, 4),
(1302, 3, 131, 1),
(1574, 3, 131, 2),
(1575, 3, 131, 3),
(1576, 3, 131, 4),
(1255, 3, 132, 1),
(1183, 3, 132, 2),
(1256, 3, 132, 3),
(1187, 3, 132, 4),
(1254, 3, 133, 1),
(1184, 3, 133, 2),
(1253, 3, 133, 3),
(1188, 3, 133, 4),
(1590, 3, 134, 1),
(1589, 3, 134, 3),
(1419, 3, 136, 1),
(1420, 3, 137, 1),
(1421, 3, 138, 1),
(1423, 3, 139, 1),
(1422, 3, 140, 1),
(1425, 3, 142, 1),
(1426, 3, 143, 1),
(1427, 3, 144, 1),
(1429, 3, 144, 2),
(1430, 3, 144, 3),
(1433, 3, 144, 4),
(1428, 3, 145, 1),
(1432, 3, 145, 2),
(1431, 3, 145, 3),
(1434, 3, 145, 4),
(1495, 3, 146, 1),
(1583, 3, 146, 2),
(1524, 3, 147, 1),
(1525, 3, 147, 2),
(1526, 3, 147, 3),
(1527, 3, 147, 4),
(1528, 3, 148, 1),
(1529, 3, 148, 2),
(1530, 3, 148, 3),
(1531, 3, 148, 4),
(1570, 3, 149, 1),
(1289, 4, 123, 1),
(1149, 4, 123, 3),
(1150, 4, 127, 1),
(1151, 4, 127, 2),
(1152, 4, 127, 3),
(1153, 4, 127, 4),
(1290, 4, 129, 1),
(1291, 4, 130, 1),
(1201, 4, 130, 3),
(1292, 4, 131, 1),
(1295, 4, 132, 1),
(1293, 4, 133, 1),
(1294, 4, 133, 3),
(1440, 4, 136, 1),
(1509, 4, 136, 3),
(1441, 4, 137, 1),
(1438, 4, 137, 3),
(1442, 4, 138, 1),
(1439, 4, 138, 3),
(1444, 4, 139, 1),
(1443, 4, 140, 1),
(1510, 4, 140, 3),
(1446, 4, 142, 1),
(1447, 4, 143, 1),
(1448, 4, 144, 1),
(1449, 4, 145, 1),
(1496, 4, 146, 1),
(1535, 4, 147, 1),
(1534, 4, 148, 1),
(1582, 4, 148, 3),
(1581, 4, 149, 1),
(1584, 4, 150, 1),
(1285, 5, 123, 1),
(1267, 5, 123, 3),
(1299, 5, 127, 1),
(1536, 5, 127, 2),
(1539, 5, 127, 3),
(1540, 5, 127, 4),
(1298, 5, 129, 1),
(1296, 5, 130, 1),
(1504, 5, 130, 3),
(1286, 5, 131, 1),
(1268, 5, 131, 3),
(1287, 5, 132, 1),
(1288, 5, 133, 1),
(1450, 5, 136, 1),
(1451, 5, 137, 1),
(1452, 5, 138, 1),
(1454, 5, 139, 1),
(1499, 5, 139, 3),
(1453, 5, 140, 1),
(1456, 5, 142, 1),
(1500, 5, 142, 3),
(1457, 5, 143, 1),
(1461, 5, 143, 3),
(1458, 5, 144, 1),
(1459, 5, 145, 1),
(1494, 5, 146, 1),
(1532, 5, 147, 1),
(1533, 5, 148, 1),
(1566, 5, 149, 1),
(1567, 5, 149, 3),
(1585, 5, 151, 1),
(1462, 7, 123, 1),
(1463, 7, 126, 1),
(1480, 7, 127, 1),
(1464, 7, 129, 1),
(1465, 7, 130, 1),
(1470, 7, 131, 1),
(1475, 7, 132, 1),
(1478, 7, 133, 1),
(1466, 7, 136, 1),
(1467, 7, 137, 1),
(1468, 7, 138, 1),
(1471, 7, 139, 1),
(1469, 7, 140, 1),
(1473, 7, 142, 1),
(1474, 7, 143, 1),
(1476, 7, 144, 1),
(1477, 7, 145, 1),
(1490, 7, 146, 1),
(1491, 7, 146, 2),
(1588, 7, 146, 3),
(1519, 7, 147, 1),
(1523, 7, 148, 1),
(1565, 7, 149, 1),
(1591, 1, 152, 1),
(1592, 1, 152, 3);

-- --------------------------------------------------------

-- 
-- Структура таблицы `acl_resources`
-- 

DROP TABLE IF EXISTS `acl_resources`;
CREATE TABLE IF NOT EXISTS `acl_resources` (
  `id` int(11) unsigned NOT NULL auto_increment,
  `name` varchar(100) NOT NULL,
  `title` varchar(100) default NULL,
  `parent_id` int(11) unsigned default NULL,
  PRIMARY KEY  (`id`),
  UNIQUE KEY `name` (`name`,`parent_id`),
  KEY `fk_parent_id` (`parent_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=153 ;

-- 
-- Дамп данных таблицы `acl_resources`
-- 

INSERT INTO `acl_resources` (`id`, `name`, `title`, `parent_id`) VALUES (50, 'admin', 'Администрирование', NULL),
(123, 'orders', 'Заказы', NULL),
(126, 'cost', 'Стоимость', 123),
(127, 'suppliers', 'Поставщики', NULL),
(129, 'address', 'Адрес', 123),
(130, 'production', 'Производство', 123),
(131, 'mount', 'Монтаж', 123),
(132, 'success', 'Выполнено', 123),
(133, 'description', 'Описание', 123),
(134, 'owncheck', 'Скрывать не свои заказы', 123),
(136, 'start_planned', 'Начало (план)', 130),
(137, 'start_fact', 'Начало (факт)', 130),
(138, 'end_fact', 'Конец (факт)', 130),
(139, 'start_planned', 'Начало (план)', 131),
(140, 'end_planned', 'Конец (план)', 130),
(142, 'end_planned', 'Конец (план)', 131),
(143, 'end_fact', 'Конец (факт)', 131),
(144, 'planned', 'План', 132),
(145, 'fact', 'Факт', 132),
(146, 'archive', 'Архив', NULL),
(147, 'customers', 'Заказчики', NULL),
(148, 'files', 'Файлы', 123),
(149, 'start_fact', 'Начало (факт)', 131),
(150, 'hideproduction', 'Скрывать заказы без производства', 123),
(151, 'hidemount', 'Скрывать заказы без монтажа', 123),
(152, 'storage', 'Склад', NULL);

-- --------------------------------------------------------

-- 
-- Структура таблицы `acl_roles`
-- 

DROP TABLE IF EXISTS `acl_roles`;
CREATE TABLE IF NOT EXISTS `acl_roles` (
  `id` int(11) unsigned NOT NULL auto_increment,
  `name` varchar(50) NOT NULL,
  `alias` varchar(40) default NULL,
  PRIMARY KEY  (`id`),
  UNIQUE KEY `name` (`name`),
  UNIQUE KEY `alias` (`alias`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=8 ;

-- 
-- Дамп данных таблицы `acl_roles`
-- 

INSERT INTO `acl_roles` (`id`, `name`, `alias`) VALUES (1, 'Директор', NULL),
(3, 'Менеджер', NULL),
(4, 'Производство', NULL),
(5, 'Монтаж', NULL),
(7, 'Бухгалтер', NULL);

-- --------------------------------------------------------

-- 
-- Структура таблицы `customers`
-- 

DROP TABLE IF EXISTS `customers`;
CREATE TABLE IF NOT EXISTS `customers` (
  `id` int(11) unsigned NOT NULL auto_increment,
  `name` varchar(255) NOT NULL,
  `description` text NOT NULL,
  PRIMARY KEY  (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- 
-- Дамп данных таблицы `customers`
-- 


-- --------------------------------------------------------

-- 
-- Структура таблицы `files`
-- 

DROP TABLE IF EXISTS `files`;
CREATE TABLE IF NOT EXISTS `files` (
  `id` int(11) unsigned NOT NULL auto_increment,
  `order_id` int(11) unsigned NOT NULL default '0',
  `filename` varchar(255) NOT NULL default '',
  `description` varchar(255) default NULL,
  `is_photo` tinyint(1) unsigned NOT NULL default '0',
  `original_name` varchar(255) default NULL,
  PRIMARY KEY  (`id`),
  KEY `order_id` (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- 
-- Дамп данных таблицы `files`
-- 


-- --------------------------------------------------------

-- 
-- Структура таблицы `languages`
-- 

DROP TABLE IF EXISTS `languages`;
CREATE TABLE IF NOT EXISTS `languages` (
  `id` int(11) NOT NULL default '0',
  `abbreviation` varchar(5) default NULL,
  `caption` varchar(75) default NULL,
  PRIMARY KEY  (`id`),
  UNIQUE KEY `abbreviation` (`abbreviation`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

-- 
-- Дамп данных таблицы `languages`
-- 

INSERT INTO `languages` (`id`, `abbreviation`, `caption`) VALUES (1, 'en', 'English');

-- --------------------------------------------------------

-- 
-- Структура таблицы `notes`
-- 

DROP TABLE IF EXISTS `notes`;
CREATE TABLE IF NOT EXISTS `notes` (
  `id` int(10) unsigned NOT NULL auto_increment,
  `order_id` int(10) unsigned NOT NULL,
  `name` varchar(255) NOT NULL,
  `text` text NOT NULL,
  `time` timestamp NOT NULL default CURRENT_TIMESTAMP,
  PRIMARY KEY  (`id`),
  KEY `order_id` (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- 
-- Дамп данных таблицы `notes`
-- 


-- --------------------------------------------------------

-- 
-- Структура таблицы `orders`
-- 

DROP TABLE IF EXISTS `orders`;
CREATE TABLE IF NOT EXISTS `orders` (
  `id` int(11) unsigned NOT NULL auto_increment,
  `customer_id` int(10) unsigned default NULL,
  `address` text,
  `description` text,
  `mount` tinyint(1) unsigned NOT NULL default '1',
  `production` tinyint(1) unsigned NOT NULL default '1',
  `production_start_planned` date default NULL,
  `production_start_fact` date default NULL,
  `production_end_planned` date default NULL,
  `production_end_fact` date default NULL,
  `mount_start_planned` date default NULL,
  `mount_start_fact` date default NULL,
  `mount_end_planned` date default NULL,
  `mount_end_fact` date default NULL,
  `success_date_planned` date default NULL,
  `success_date_fact` date default NULL,
  `cost` int(10) unsigned default NULL,
  `advanse` int(10) unsigned default NULL,
  `created` timestamp NULL default CURRENT_TIMESTAMP,
  `creator_id` int(11) unsigned default NULL,
  `archive` tinyint(1) unsigned NOT NULL default '0',
  `archive_date` timestamp NULL default NULL,
  `invoice_number` varchar(255) default NULL,
  `invoice_date` date default NULL,
  `act_number` varchar(255) default NULL,
  `act_date` date default NULL,
  PRIMARY KEY  (`id`),
  KEY `creator_id` (`creator_id`),
  KEY `customer_id` (`customer_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- 
-- Дамп данных таблицы `orders`
-- 


-- --------------------------------------------------------

-- 
-- Структура таблицы `orders_suppliers`
-- 

DROP TABLE IF EXISTS `orders_suppliers`;
CREATE TABLE IF NOT EXISTS `orders_suppliers` (
  `id` int(11) unsigned NOT NULL auto_increment,
  `order_id` int(11) unsigned NOT NULL,
  `supplier_id` int(11) unsigned NOT NULL,
  `success` tinyint(1) NOT NULL,
  `date` date NOT NULL,
  `cost` int(11) default NULL,
  `note` text,
  PRIMARY KEY  (`id`),
  UNIQUE KEY `order_id-supplier_id` (`order_id`,`supplier_id`),
  KEY `supplier_id` (`supplier_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=5 ;

-- 
-- Дамп данных таблицы `orders_suppliers`
-- 


-- --------------------------------------------------------

-- 
-- Структура таблицы `suppliers`
-- 

DROP TABLE IF EXISTS `suppliers`;
CREATE TABLE IF NOT EXISTS `suppliers` (
  `id` int(10) unsigned NOT NULL auto_increment,
  `name` varchar(255) NOT NULL,
  `description` text NOT NULL,
  PRIMARY KEY  (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- 
-- Дамп данных таблицы `suppliers`
-- 

DROP TABLE IF EXISTS `storage_assets`;
CREATE TABLE `storage_assets` (
    `id` INT( 11 ) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY ,
    `name` VARCHAR( 250 ) NOT NULL ,
    `measure` VARCHAR( 50 ) NULL DEFAULT NULL,
    `category_id` INT( 11 ) UNSIGNED NULL,
    INDEX ( `category_id` )
) ENGINE = InnoDB;

DROP TABLE IF EXISTS `storage_assets_categories`;
CREATE TABLE `storage_assets_categories` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY ,
    `name` VARCHAR( 250 ) NOT NULL ,
    `parent_id` INT UNSIGNED NULL DEFAULT NULL ,
    INDEX ( `parent_id` )
) ENGINE = InnoDB;

DROP TABLE IF EXISTS `storage_availability`;
CREATE TABLE `storage_availability` (
     `id` int(10) unsigned NOT NULL auto_increment,
     `asset_id` int(10) unsigned NOT NULL,
     `qty` int(10) unsigned NOT NULL,
     PRIMARY KEY  (`id`),
     KEY `asset_id` (`asset_id`)
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `storage_requests`; 
CREATE TABLE `storage_requests` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY ,
    `asset_id` INT UNSIGNED NOT NULL ,
    `account_id` INT UNSIGNED NOT NULL,
    `qty` REAL NOT NULL ,
    `created` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ,
    `request_on` DATE NOT NULL ,
    INDEX ( `asset_id`), 
    INDEX ( `account_id` )
) ENGINE = InnoDB;

-- 
-- Constraints for dumped tables
-- 

-- 
-- Constraints for table `accounts`
-- 
ALTER TABLE `accounts`
  ADD CONSTRAINT `accounts_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `acl_roles` (`id`);

-- 
-- Constraints for table `acl_permissions`
-- 
ALTER TABLE `acl_permissions`
  ADD CONSTRAINT `acl_permissions_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `acl_roles` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `acl_permissions_ibfk_2` FOREIGN KEY (`resource_id`) REFERENCES `acl_resources` (`id`) ON DELETE CASCADE;

-- 
-- Constraints for table `acl_resources`
-- 
ALTER TABLE `acl_resources`
  ADD CONSTRAINT `acl_resources_ibfk_1` FOREIGN KEY (`parent_id`) REFERENCES `acl_resources` (`id`) ON DELETE CASCADE;

-- 
-- Constraints for table `files`
-- 
ALTER TABLE `files`
  ADD CONSTRAINT `files_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE;

-- 
-- Constraints for table `notes`
-- 
ALTER TABLE `notes`
  ADD CONSTRAINT `notes_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE;

-- 
-- Constraints for table `orders`
-- 
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_3` FOREIGN KEY (`creator_id`) REFERENCES `accounts` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`creator_id`) REFERENCES `accounts` (`id`),
  ADD CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`);

-- 
-- Constraints for table `orders_suppliers`
-- 
ALTER TABLE `orders_suppliers`
  ADD CONSTRAINT `orders_suppliers_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `orders_suppliers_ibfk_2` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers` (`id`) ON DELETE CASCADE;

ALTER TABLE `storage_availability` 
  ADD FOREIGN KEY ( `asset_id` ) REFERENCES `storage_assets` (`id`) ON DELETE RESTRICT ;

ALTER TABLE `storage_requests` 
  ADD FOREIGN KEY ( `asset_id` ) REFERENCES `storage_assets` (`id`) ON DELETE RESTRICT ;

ALTER TABLE `storage_requests` 
  ADD FOREIGN KEY ( `account_id` ) REFERENCES `accounts` (`id`) ON DELETE RESTRICT ;

SET FOREIGN_KEY_CHECKS=1;