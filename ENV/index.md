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

## CRON jobs
A detailed video about how to use and setup cron jobs can be found (here)[https://www.youtube.com/watch?v=7cbP7fzn0D8].

When editing the `crontab -e`, there are comments relating to how to schedule a cron. See below:
```
# m h  dom mon dow   command
* * * * *
```
This example runs every minute (m), every hour (h), every day of the month (dom), every month (mon) and all days of the week (dow).

There are other options to use `@` options for events like:
- hourly
- daily
- reboot (runs when rebooting the system)

Its not recommended to run cron jobs from a generic user. The best way is to specify the root user like so: `crontab -u root -e`

* Important: A full path to the executable script should be added as some users may not have access to services and files.

(This site)[https://crontab-generator.org/] generates the crontab schedule by using the interface.