const ethers = require("ethers");
const URI = process.env.ETH_ENDPOINT;

module.exports = {
  send: async function send(to, value) {
    try {
      ethers.utils.getAddress(to);
      let wallet = new ethers.Wallet(process.env.PRIVATE_KEY);
      let provider = new ethers.providers.JsonRpcProvider(URI);
      wallet = wallet.connect(provider);

      let tx = {
        to,
        value: ethers.utils.parseEther(value),
      };

      try {
        let transaction = await wallet.sendTransaction(tx);
        return transaction.hash;
      } catch (err) {
        throw "Transaction failed";
      }
    } catch (err) {
      throw "Invalid address";
    }
  },
};
