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


## Hosts file
We can point an ip address to a specific domain by updating the hosts file. On Mac it is located in `/etc/hosts`
An example is below:
```
20.211.192.185 ipa.com.au
20.211.192.185 www.ipa.com.au
```

Once the IP / Domain settings have beed added, we need to flush the domain cache.

`sudo killall -HUP mDNSResponder`


## Symlinks
`ln -s /path/to/source/directory /path/to/destination/symlink`
