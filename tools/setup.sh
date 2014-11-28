#!/bin/bash

SERVER_URL=http://localhost:8000/v1

http -v PUT ${SERVER_URL}/models/daybed:cloud_share:pubkey_store @public-key-store-definition.json --auth-type=hawk --auth 93bfb8833aedfae115feaf781fdbf6da0768095946db102efd187e4566b5bb43:
http -v PUT ${SERVER_URL}/models/daybed:cloud_share:document @document-definition.json --auth-type=hawk --auth 93bfb8833aedfae115feaf781fdbf6da0768095946db102efd187e4566b5bb43:
