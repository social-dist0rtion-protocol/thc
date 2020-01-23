FROM node:13.7.0-stretch-slim

WORKDIR /home/node

RUN apt-get update && apt-get install -y git python build-essential
RUN git config --global url."https://github.com/".insteadOf git@github.com: && git config --global url."https://".insteadOf git://

#install deps first to prevent cache being hammered on every change
RUN for d in app eth gen srv; do mkdir $d; done

COPY app/package.json app/
COPY eth/package.json eth/
COPY gen/package.json gen/
COPY srv/package.json srv/

COPY app/package-lock.json app/
COPY eth/package-lock.json eth/
COPY gen/package-lock.json gen/
COPY srv/package-lock.json srv/

RUN for d in app eth gen srv; do cd $d; npm install; cd ..; done


