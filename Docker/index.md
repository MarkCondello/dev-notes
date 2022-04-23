
## Docker commands
Mostly used for cleanup or regenerating all containers

Remove all docker containers in order to rebuild by running
`docker-compose down`

then to clean up containers

`docker container prune`

then to clean up images

`docker image prune -a`

then to clean up volumes (Getting rid of the volumes will lose data. eg local databases. Elastic Search indexes If you need that backup first,)

`docker volume prune`

Then run lara again and all will be rebuilt.

In order to rebuild a container run

`docker-compose build --no-cache laravel-horizon`