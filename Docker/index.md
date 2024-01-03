## Docker commands

- `docker run` -> creates a container from an image (if not present locally it pulls from remote)
- `docker stop <container_id>` -> stops the container
- `docker start <container_id>` -> starts the container of an existing container
- `docker ps` -> Check all containers running
- `docker ps -a`` -> Check all containers running and not running
- `docker rm <container_id>` -> removes the container
- `docker rmi <image_id>` -> removes the image

## Debugging

- `docker logs <container_id>` -> logs of the container
- `docker exec -it <container_id> /bin/bash` -> enter bash in the container
*You can replace container_id with custom names...*

## Parameters

- `-d` -> detach mode which means you can run the container in the background
- `-p <localport>:<containerport>` -> port mapping to allow access to the container
- `-f` -> force remove the container if it exists
- `--name <name>` -> name of the container

## Versions

```<image>:<version>```

### Docker compose

The idea of docker compose is to create a docker-compose.yml file and then run it.
Inside the docker-compose.yml file you can define the images, ports, volumes, and other parameters.
It creates a docker network and then creates the containers. This way you can have multiple containers running in the same network.

## Docker compose commands

- `docker-compose -f <filename> up` -> starts the containers
- `docker-compose down` -> stops the containers
- `docker-compose build` -> builds the containers
- `docker-compose run <container_name>` -> runs the container
- `docker-compose logs <container_name>` -> logs of the container

## Mostly used for cleanup or regenerating all containers

Remove all docker containers in order to rebuild by running
`docker-compose down`

then to clean up containers

`docker container prune`

then to clean up images

`docker image prune -a`

then to clean up volumes (Getting rid of the volumes will lose data. eg local databases. Elastic Search indexes If you need that backup first.)

`docker volume prune`


### Installing an ubuntu image
`docker run -dit -p <LOCAL_PORT>:80 ubuntu:22.04`

Go to docker desktop, open Containers > name of container > exec then choose open in terminal.

Run these commands while bashed in the container:
```
apt update
apt install nginx
```

Run the nginx server with this path / command
`/etc/init.d/nginx start`

With the server running we can visit the server on the browser specified by the port.

To add the packages larval requires running the following:

`apt install php-cli nano unzip php8.1-fpm php-mysql php-mbstring php-xml php-bcmath php-curl php8.1-gd`

*These installs do not work with 8.2*

Install composer
```
cd ~
curl -sS https://getcomposer.org/installer -o /tmp/composer-setup.php
```
Then run composer with PHP and add the install to a specific directory:

`php /tmp/composer-setup.php --install-dir=/usr/local/bin --filename=composer`

Check composer is running:
`composer --version`

## Install MySQL
Install the mysql module:
`apt install mysql-server`

Start the MySQL server:
`/etc/init.d/mysql start`

Update root user pw after opening mysql:
```
mysql
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password by "qwertyqwerty";
exit
```
Run the secure MySQL module:
`mysql_secure_installation`

Login with the root user using the password we defined previously:
`mysql -u root -p`

Create a new database for the app:
`CREATE DATABSE ourlaravelapp;`

Create a new user to access the database:
`CREATE USER 'ourappuser'@'%' IDENTIFIED WITH mysql_native_password BY 'qwertyqwerty';`

Grant all privileges to that user for that database:
`GRANT ALL ON ourlaravelapp.* TO 'ourappuser'@'%';`

### Move the project files
Move all the Laravel files to the container by building up this command:
- Get the local path to the project files.
- In docker desktop, retrieve the name of the container.
- Specify the path to where the files should be placed in the container / server:
`docker cp <PATH_TO_LOCAL_FILES> <CONTAINER_NAME>:/var/www/ourapp`

Back in the container running Nginx, change the default settings
`nano /etc/nginx/sites-available/default`

Copy over the settings file available (here)[https://github.com/LearnWebCode/laravel-course/blob/main/html-templates/docker-nginx.txt].
Restart nginx to make the changes occur:
`/etc/init.d/nginx restart`

Start the php service
`/etc/init.d/php8.1-fpm start`

Change the storage directory ownership to www-data and the .env database details and its good to go.

## Building a start up file to initialize services
Rather than starting all the services for the server one by one, for local development we can set up an init file on the root of the server to start up all the services required.

```
/etc/init.d/php8.1-fpm start
/etc/init.d/mysql start
/etc/init.d/redis start
/etc/init.d/cron start
/etc/init.d/nginx start
```

### Crontab
We can schedule tasks using this command:
`crontab -e`

We need to reference the services required to run eg PHP using a relative path like so:
`* * * * * /usr/bin/php /var/www/ourapp/artisan queue:work --max-time=60`

We then need to run the cron:
`/etc/init.d/cron start`