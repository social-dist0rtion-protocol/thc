# Deploy
ssh root@45.55.58.235

docker pull dist0rtionproto/gas-station
docker ps -q | xargs -n1 docker rm -f 

docker run -d -p 80:3000 -e MNEMONIC="your mnemonic" -e AMOUNT="0.0001" --name gas-station dist0rtionproto/gas-station
