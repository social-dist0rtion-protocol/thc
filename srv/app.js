const express = require("express");
const tokens = require("./tokens");
const app = express();
const port = 3000;

app.get("/", (req, res) => res.send("Hello World!"));

app.get("/tokens", async function(req, res) {
  let hash = await tokens.send(req.query.address, process.env.AMOUNT);
  res.send(hash);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
