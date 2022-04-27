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
It creates a docker network and then creates the containers. this way you can have multiple containers running in the same network.

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