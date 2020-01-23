FROM node:10.18.1-stretch

WORKDIR /home/node

RUN apt-get update && apt-get install -y git python build-essential
RUN git config --global url."https://github.com/".insteadOf git@github.com: && git config --global url."https://".insteadOf git://

#install ipfs
COPY deps/go-ipfs_v0.4.22_linux-amd64.tar.gz /tmp
RUN cd /tmp && tar -xzf go-ipfs_v0.4.22_linux-amd64.tar.gz  && cd ./go-ipfs && ./install.sh

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

ENV PATH /home/node/eth/node_modules/.bin:${PATH}

COPY . .


