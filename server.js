require("dotenv").config();

const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const { fetchAddressesFromTweetsAndFund } = require("./monitorTwitter");

app.get("/", (req, res) => {
  res.status(200).send("Server Status: Running.");
});

app.listen(3000, () => {
  console.log(`Listening at ${PORT}.`);
});

setInterval(fetchAddressesFromTweetsAndFund, 60000);
