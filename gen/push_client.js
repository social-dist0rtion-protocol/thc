const ipfsClient = require("ipfs-http-client");

const PATH = process.argv[2];
const IPFS_PROTOCOL = process.env["IPFS_PROTOCOL"];
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
    const result = await ipfs.addFromFs(path, options);
    console.log(result);
    const hash = result.pop().hash;
    await ipfs.pin.add(hash);
    let url = IPFS_LOCATION + hash;
    console.log(url);
  } catch (err) {
    console.log(err);
  }
}

upload(PATH);
