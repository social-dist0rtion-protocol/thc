const ipfsClient = require("ipfs-http-client");

const PATH = process.argv[2];

import NETWORK_CONFIG from "network_config.json";

async function upload(path) {
  const ipfs = ipfsClient({
    host: NETWORK_CONFIG["IPFS_HOST"],
    port: NETWORK_CONFIG["IPFS_PORT"],
    protocol: NETWORK_CONFIG["IPFS_PROTOCOL"]
  });

  const options = {
    recursive: true,
    wrapWithDirectory: true
  };

  try {
    result = await ipfs.addFromFs(path, options);
    console.log(result);
    let url = NETWORK_CONFIG["IPFS_LOCATION"] + result.pop().hash;
    console.log(url);
  } catch (err) {
    console.log(err);
  }
}

upload(PATH);
