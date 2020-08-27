var express = require('express');

var express = require("express");
var router = express.Router();
const fs = require("fs");

/* GET home page. */
router.post('/', function(request, res, next) {
  // let body = [];
  // request.on("data", (data) => {
  //   body += data;
  //   console.log(data);
  // })
  fs.writeFileSync("../server/public/" + request.query.filename, request.body.content);
  console.log(request);
  // res.send('');
  // res.end();
});

module.exports = router;
