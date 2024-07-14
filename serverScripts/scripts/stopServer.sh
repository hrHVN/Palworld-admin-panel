#!/bin/bash

curl -L -X GET 'http://127.0.0.0:8212/v1/api/save' -H 'Accept: application/json' -H 'Authorization: Basic '

sudo systemctl stop palworld
systemctl status palworld