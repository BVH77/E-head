ALTER TABLE `storage_requests` 
    ADD `processed` INT( 1 ) NOT NULL DEFAULT '0', 
    ADD `description` TEXT NULL DEFAULT NULL ; 