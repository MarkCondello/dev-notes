## Ownership and permission defaults
*Note* In many scenarios, its best to do composer installs with a sudo user. To set things back after a successfull install, we need to revert the file ownership and permissions using these commands:
```
chown -R www-data:www-data *
chmod -R 775 *
```