const http = require("http");
const fs = require("fs");
const archiver = require("archiver");

let packageName = "./package";

let archive = archiver("zip", {
  zlib: { level: 9 }, // compression level
});

// fs.stat(filename, (err, stats) => {
const options = {
  host: "localhost",
  port: 8081,
  path: "/?filename=" + "package.zip",
  method: "POST",
  header: {
    "Content-Type": "application/x-www-form-urlencoded",
    // "Content-Length": stats.size,
  },
};

// Make a request
const req = http.request(options, (res) => {
  console.log(res);
});

req.on("error", (err) => {
  console.error(err);
});

archive.directory(packageName, false);
archive.pipe(req);
archive.finalize();

archive.on("end", () => {
  req.end();
});

// // Write data to request body
// let readStream = fs.createReadStream("./cat.jpg");
// readStream.pipe(req);
// readStream.on("end", () => {
//   req.end();
// });
// });
