#!/bin/bash

###################################################################
# Script Name : prod_run.sh
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

cd Front_end
./build.sh
cd -
rm -rf WORKSPACE/*
docker-compose up
