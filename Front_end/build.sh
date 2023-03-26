#!/bin/bash

###################################################################
# Script Name : build.sh
#
# Description :
#
# Args :
#
# Creation Date : 05-12-2022
# Last Modified : 25-03-23 13:32:55S
#
# Created By :
# Email : nbmaiti83@gmail.com
###################################################################

#docker run -it --rm -v "$PWD":/app -w /app --name node-build node:gallium-bullseye bash -c "npm install && npm run build"
echo "To build react "
pwd
alias
unameOut="$(uname -s)"
case "${unameOut}" in
    Linux*)     machine=Linux;;
    Darwin*)    machine=Mac;;
    CYGWIN*)    machine=Cygwin;;
    MINGW*)     machine=MinGw;;
    *)          machine="UNKNOWN:${unameOut}"
esac
echo ${machine}

# windows build
if [[ "$machine" == "MinGw" ]]
then
    DOCKERCMD=~/bin/docker-window.sh
else
    DOCKERCMD=docker
fi

#~/bin/docker-window.sh run -it --rm -v "$PWD":'/app2' -w //app --name node-build node:gallium-bullseye bash
#$DOCKERCMD run -it --rm -v "$PWD":'/app2' -w //app --name node-build node:gallium-bullseye bash
$DOCKERCMD run -it --rm -v "$PWD":/app -w //app --name node-build node:gallium-bullseye npm install
$DOCKERCMD run -it --rm -v "$PWD":/app -w //app --name node-build node:gallium-bullseye npm run build

#docker image rm node:gallium-bullseye
