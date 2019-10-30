var ipfsClient = require("ipfs-http-client");
var fs = require("fs");
const FILE_PATH = process.argv[2];

async function upload(contentBuffer) {
  const ipfs = ipfsClient({
    host: "ipfs.infura.io",
    port: "5001",
    protocol: "https"
  });
  return new Promise(resolve => {
    ipfs.add(contentBuffer, (err, result) => {
      // Upload buffer to IPFS
      if (err) {
        console.error(err);
        return;
      }
      let url = `https://ipfs.io/ipfs/${result[0].hash}`;
      resolve(url);
      console.log(url);
    });
  });
}

fs.readFile(FILE_PATH, "utf8", async function(err, contents) {
  await upload(contents);
});
