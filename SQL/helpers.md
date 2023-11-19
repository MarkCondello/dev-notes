## Helpers

## Add mysql to PATH
`echo 'export PATH="/usr/local/mysql/bin:$PATH"' >> ~/.zshrc`
*Replace .zshrc with the profile you want to use*

### Importing using MAMP
/applications/MAMP/library/bin/mysql -u root -p aus-galleries < ./wwwaust2_australiangallerieswp_DUMP.sql

### Dumping using MAMP
/Applications/MAMP/library/bin/mysqldump -u root -p aus-galleries > ./aus-galleries-local_DUMP.sql

## Find and replace
`update <TABLE_NAME> set <TABLE_COLUMN> = replace(<TABLE_COLUMN>, '<STRING_TO_FIND>', '<STRING_TO_REPLACE>');`

/Applications/MAMP/library/bin/mysqldump -u root -p sigma-healthcare <> ./sigma_wp_staging.sql

## LOCK TABLES
If there is an issue with uploading a database due to `LOCK TABLES`; comment out the `UNLOCK TABLES` and the `LOCK TABLES` scripts.
