const ipfsClient = require("ipfs-http-client");

const PATH = process.argv[2];
const IPFS_PROTOCOL = process.env["IPFS_PROTCOL"];
const IPFS_HOST = process.env["IPFS_HOST"];
const IPFS_PORT = process.env["IPFS_PORT"];
const IPFS_LOCATION = process.env["IPFS_LOCATION"];

async function upload(path) {
  const ipfs = ipfsClient({
    host: IPFS_HOST,
    port: IPFS_PORT,
    protocol: IPFS_PROTOCOL
  });

  const options = {
    recursive: true,
    wrapWithDirectory: true
  };

  try {
    result = await ipfs.addFromFs(path, options);
    console.log(result);
    let url = IPFS_LOCATION + result.pop().hash;
    console.log(url);
  } catch (err) {
    console.log(err);
  }
}

upload(PATH);
