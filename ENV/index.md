## Ownership and permission defaults
*Note* In many scenarios, its best to do composer installs with a sudo user. To set things back after a successfull install, we need to revert the file ownership and permissions using these commands:
```
chown -R www-data:www-data *
chmod -R 775 *
```

(More details about this here.)[https://kb.iu.edu/d/abdb]


## Zip up files from a Mac on Linux system
```
zip -vr folder.zip folder/ -x "*.DS_Store"
```