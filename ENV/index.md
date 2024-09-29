## Ownership and permission defaults
*Note* In many scenarios, its best to do composer installs with a sudo user. To set things back after a successfull install, we need to revert the file ownership and permissions using these commands:
```
chown -R www-data:www-data *
chmod -R 775 *
```

[More details about this here.](https://kb.iu.edu/d/abdb)

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
A detailed video about how to use and setup cron jobs can be found [here](https://www.youtube.com/watch?v=7cbP7fzn0D8).

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

[This site](https://crontab-generator.org/) generates the crontab schedule by using the interface.

## Apache server setup
`.conf` settings can be found [here](https://www.udemy.com/course/master-linux-administration/learn/lecture/23099810#overview)

SSL settings found [here](https://www.udemy.com/course/master-linux-administration/learn/lecture/23099822#overview)

Install the certificate package:
`apt update && apt install certbot python3-certbot-apache`

Issue a certificate for the domain:
`certbot -d DOMAIN_NAME`

This generates a `.conf` file in `/etc/apache2/sites-available` for the ssl connection.

Let’s encrypt certificates are valid for only 90 days.
The service updates certificates. We can check that its running by the following command:
`systemctl status certbot.timer`

To test the renewal process run this command:
`certbot renew —dry-run`

Running the following will provide info on what commands are available with certbot:
`certbot —help`

Installing PHP
`apt update && apt install php p:hp-mysql libapache2-mod-php`

This is required to allow apache to handle PHP files.

Run a restart after installation:
`systemctl restart apache2`

Installing MySQL
`apt update && apt install mysql-server`

Check it is installed by running:
`systemctl status mysql`

Remove insecure settings using the following:
`mysql_secure_installation`

Choose yes for all options and 3 for password strength.
We can login to mysql as root APACHE user without a password in the server by simply running: 
`mysql`

To create a new user:
```
CREATE USER 'wordpressuser'@'localhost' IDENTIFIED BY '***STRONG_PASSWORD***';
GRANT ALL PRIVILEGES ON wordpress.* TO 'wordpressuser'@'localhost';
FLUSH PRIVILEGES;
```

Installing Wordpress
cd to the tmp directory and download Wordpress zip like so: `wget https://wordpress.org/latest.tar.gz`

Unzip the file like so:
`tar -xzvf latest.tar.gz`

And move the folder to the document root.

## Show reserved ports
`less /etc/services`

## Auto update shell packages
`sudo apt install unattended-upgrades`
Then run the package:
`sudo dpkg-reconfigure --priority=low unattended-upgrade`
The low priority means it will only run when the server is not doing many processes.

## Bash scripting
`|` can be used to pass the output of one command as input to another.
eg: `ls | grep '.jpg'` will list jpeg files using ls and grep combined with the pipe.
`content > FILENAME` will add content to a file
`more content >> FILENAME` will append content to a file

`2>&1` will redirect standard input

## Find files
`find /var/log -type f -name "*.log"`

## Find directories
`sudo find / -type d  -name log`