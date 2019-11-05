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

  await ipfs.addFromFs(path, options, (err, result) => {
    // Upload buffer to IPFS
    if (err) {
      console.log(err);
      return;
    }
    let url = `https://ipfs.io/ipfs/${result.pop().hash}`;
    console.log(url);
  });
}

upload(PATH);
