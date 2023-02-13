## Helpers

### Dumping / Importing using MAMP
/applications/MAMP/library/bin/mysql -u root -p aus-galleries < ./wwwaust2_australiangallerieswp_DUMP.sql
/Applications/MAMP/library/bin/mysqldump -u root -p aus-galleries > ./aus-galleries-local_DUMP.sql

## Find and replace
`update <TABLE_NAME> set <TABLE_COLUMN> = replace(<TABLE_COLUMN>, '<STRING_TO_FIND>', '<STRING_TO_REPLACE>');`

/Applications/MAMP/library/bin/mysqldump -u root -p sigma-healthcare <> ./sigma_wp_staging.sql