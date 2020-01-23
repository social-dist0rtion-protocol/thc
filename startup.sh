#!/bin/bash

if [[ ! -e /root/.ipfs ]]
then
    ipfs init
fi

ipfs daemon &> /tmp/ipfs.log &
