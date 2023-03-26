#!/bin/bash

###################################################################
# Script Name : start.sh
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
cd /app
pip install -r ./requirements.txt

#apt update
#apt install gunicorn -y

python mq_worker.py &

#gunicorn --workers=4 --threads=5 -b 0.0.0.0:5000 app:app
#gunicorn --worker-class gevent --threads=5 -b 0.0.0.0:5000 app:app

python app.py
