const ipfsClient = require("ipfs-http-client");

const PATH = process.argv[2];

async function upload(path) {
  const ipfs = ipfsClient({
    host: "ipfs.infura.io",
    port: "5001",
    protocol: "https"
  });

  const options = {
    recursive: true,
    wrapWithDirectory: true
  };

  try {
    result = await ipfs.addFromFs(path, options);
    console.log(result);
    let url = `https://ipfs.io/ipfs/${result.pop().hash}`;
    console.log(url);
  } catch (err) {
    console.log(err);
  }
}

upload(PATH);
