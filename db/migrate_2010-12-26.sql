CREATE TABLE `storage_availability` (
  `id` int(10) unsigned NOT NULL auto_increment,
  `asset_id` int(10) unsigned NOT NULL,
  `qty` int(10) unsigned NOT NULL,
  PRIMARY KEY  (`id`),
  KEY `asset_id` (`asset_id`)
) ENGINE=InnoDB;

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

ALTER TABLE `storage_availability` ADD FOREIGN KEY ( `asset_id` ) 
REFERENCES `storage_assets` (`id`) ON DELETE RESTRICT ;

ALTER TABLE `storage_requests` ADD FOREIGN KEY ( `asset_id` ) 
REFERENCES `storage_assets` (`id`) ON DELETE RESTRICT ;

ALTER TABLE `storage_requests` ADD FOREIGN KEY ( `account_id` ) 
REFERENCES `accounts` (`id`) ON DELETE RESTRICT ;