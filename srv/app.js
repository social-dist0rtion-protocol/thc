require("dotenv").config();
const fs = require("fs");
const https = require("https");
const express = require("express");
const cors = require("cors");
const tokens = require("./tokens");
const app = express();
const port = 3000;

const options = {
  key: fs.readFileSync(process.env.SSL_KEY_FILE),
  cert: fs.readFileSync(process.env.SSL_CERT_FILE)
};


app.use(cors());
app.get("/", (req, res) => res.send("Hello World!"));

app.get("/tokens", async function (req, res) {
  try {
    let address = req.query.address;
    // AMOUNT is in ETHER
    let amount = process.env.AMOUNT;
    let hash = await tokens.send(address, amount);
    console.log("Amount " + amount + " → " + address + " tx " + hash);
    res.send(
      "Amount " +
        amount +
        " transferred to " +
        address +
        "<br>Transaction hash " +
        hash
    );
  } catch (error) {
    res.send(error);
  }
});

const server = https.createServer(options, app);

server.listen(port, () => console.log(`Ready to send you shittons of money at ${port}!`));
