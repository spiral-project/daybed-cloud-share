#!/bin/bash

SERVER_URL=https://daybed.io/v1

http -v PUT ${SERVER_URL}/models/daybed:cloud_share:pubkey_store @public-key-store-definition.json
http -v PUT ${SERVER_URL}/models/daybed:cloud_share:document @document-definition.json
