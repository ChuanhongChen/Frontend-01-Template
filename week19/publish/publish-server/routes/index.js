var express = require("express");
var router = express.Router();
const fs = require("fs");
const unzipper = require("unzipper");

/* GET home page. */
router.post("/", function (request, response, next) {
  // if (!request.query.filename) return;
  // let writeStream = fs.createWriteStream("../server/public/" + request.query.filename);

  let writeStream = unzipper.Extract({ path: "../server/public" });
  request.pipe(writeStream);

  request.on("end", () => {
    response.writeHead(200, { "Content-Type": "text/plain" });
    response.end("okay");
  });
});

module.exports = router;
