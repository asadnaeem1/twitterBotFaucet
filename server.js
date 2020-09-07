const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.status(200).send("Server Status: Running.");
});

app.listen(3000, () => {
  console.log(`Listening at ${PORT}.`);
});
