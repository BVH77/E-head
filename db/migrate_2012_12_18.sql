ALTER TABLE  `orders` 
ADD  `delivery` TINYINT(1) UNSIGNED NOT NULL AFTER  `print` ,
ADD  `delivery_start_planned` DATE NULL AFTER  `mount_end_fact` ,
ADD  `delivery_start_fact` DATE NULL AFTER  `delivery_start_planned` ,
ADD  `delivery_end_planned` DATE NULL AFTER  `delivery_start_fact` ,
ADD  `delivery_end_fact` DATE NULL AFTER  `delivery_end_planned`;

ALTER TABLE  `staff_payments` ADD  `comment` TEXT NULL;