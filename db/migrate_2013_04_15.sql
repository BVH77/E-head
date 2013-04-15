SET FOREIGN_KEY_CHECKS=0;
SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";

CREATE TABLE IF NOT EXISTS `organizer` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `ondate` date NOT NULL,
  `ontime` time NOT NULL,
  `text` text NOT NULL,
  `account_id` int(11) unsigned NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `closed` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `account_id` (`account_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

ALTER TABLE `organizer`
  ADD CONSTRAINT `organizer_ibfk_1` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`id`);
SET FOREIGN_KEY_CHECKS=1;