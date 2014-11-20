#!/bin/bash

SERVER_URL=https://daybed.io/v1

http -v PUT ${SERVER_URL}/models/daybed:cloud-share:pubkey-store @public-key-store-definition.json
http -v PUT ${SERVER_URL}/models/daybed:cloud-share:document @document-definition.json
