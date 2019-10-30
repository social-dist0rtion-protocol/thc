const ethers = require("ethers");
const solutionsFile = process.argv[2];

function buildAddress(sol) {
	let solutionBytes = ethers.utils.toUtf8Bytes(sol);
  let solutionDigest = ethers.utils.keccak256(solutionBytes);
  let wallet = new ethers.Wallet(solutionDigest);

	return wallet.address;
}

var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(solutionsFile)
});

lineReader.on('line', function (line) {
  console.log(buildAddress(line));
});

//console.log(hash(solution));
