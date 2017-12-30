#!/bin/sh

FABRIC_TAG=x86_64-1.0.3

hash docker || (echo "Please install docker first"; exit 1;)
hash docker-compose || (echo "Please install docker-compose first"; exit 1;)

dockerFabricPull() {
  for IMAGES in peer orderer ca couchdb ccenv javaenv kafka zookeeper tools; do
      echo "==> FABRIC IMAGE: $IMAGES"
      echo
      docker pull hyperledger/fabric-$IMAGES:$FABRIC_TAG
      docker tag hyperledger/fabric-$IMAGES:$FABRIC_TAG hyperledger/fabric-$IMAGES
  done
}

echo "Pulling Fabric images..."
dockerFabricPull

echo "

Done! Start with:
docker-compose up -d

You can clean your environment anytime with:
./script/clean.js

Enjoy :)"