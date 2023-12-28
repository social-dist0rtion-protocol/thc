require("dotenv").config();
const express = require("express");
const tokens = require("./tokens");
const app = express();
const port = 3000;

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

app.listen(port, () => console.log(`Ready to send you shittons of money at ${port}!`));
