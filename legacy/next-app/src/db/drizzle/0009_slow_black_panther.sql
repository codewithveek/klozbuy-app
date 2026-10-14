CREATE INDEX `business_profiles_address_idx` ON `business_profiles` (`address`);

ALTER TABLE `business_profiles` ADD FULLTEXT INDEX (address) WITH PARSER MULTILINGUAL ADD_COLUMNAR_REPLICA_ON_DEMAND;