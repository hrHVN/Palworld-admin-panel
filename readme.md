# Palworld Admin Panel
Palworld Admin Panel is a simple server that interfaces with your gameserver's REST-API. The purpose is then to provide a safer way for users and server owners to administrate thir Palworld server.

**Presequites:**

You should have some knowledge or be capable of figuring out how to: launch a docker image or install nodeJs and launch a node server. 

This repo provides two options for launching the server.
I recomend you to use [Portainer]("https://docs.portainer.io/start/install-ce/server/docker") to manage your Docker images if you are new to Docker.

Alternativly on windows use [Docker Desktop]("https://www.docker.com/products/docker-desktop/")


### Server variables:
The server need certain values to connect propperly to your Palworld server.

`WEB_PORT=3000` This variable isn't used for the Docker image, but if you download the repo and set it up your self, you may want to change the webserver port.

`PAL_USER=admin` Currently the default API user is `admin` but this might change in the future and if it does, change this variable to a suting username.

`PAL_PWD=admin` The API password is the same as the password `AdminPassword` you set in the `PalWorldSettings.ini` when configuring the server.

`REST_PORT=8212`
This has to match `RESTAPIPort` in the `PalWorldSettings.ini`, if you changed it when configuring the server set the new port here also.

`PAL_IP=127.0.0.0` This is the ip of your Palworld server, preferably you are runing this server(`Palworld-Admin-Panel`) in the same network as your game server. 
<small>[127.0.0.0 is the same as localhost no need to change this if everything is on the same machine]</small>

# Deployment
## Using docker
Remember you HAVE-TO set a password on creation.

**Default variables all the way**
```bash
docker run -d -p 3000:3000 -e PAL_PWD="admin" palworld-admin-panel
```

**Custome varables**

_Only include the variables you need_
```bash
docker run -d -p 3000:3000 -e PAL_USER="admin" -e PAL_PWD="admin" -e REST_PORT="8212" -e PAL_IP="[xxx.xxx.xxx.xxx]"  palworld-admin-panel
```

## Using NodeJS standalone
Download the repo from github and extract the files to where you want the server to be stored.

### .ENV
In the repo you'll find a file named `example.env`, rename this to `.env` and update the values with your own values.

_See the explanation up above if you have questions about the variables._

### Start comand
Open a CLI tool and navigate to the server directory then write `npm start` in the comand line. 
Now the server is running and ready to use.
