const http = require('http')
const fs = require('fs')
const querystring = require('querystring')
const child_process = require('child_process')

var archiver = require('archiver')
let redirect_uri = encodeURIComponent('http://localhost:8081/auth')
child_process.exec(
  `open https://github.com/login/oauth/authorize?client_id=Iv1.c0b7f36b0f0d8b03&redirect_uri=${redirect_uri}&scope=read%3Auser&state=123456`
)
const server = http.createServer((request, res) => {
  console.log("req.url", request.url);
  console.log("real publish~~~~~~~");

  let packname = './package'
  let token = request.url.match(/token=([^&]+)/)[1];
  // console.log("token", token);
  const options = {
    host: 'localhost',
    port: 8081,
    path: '/?filename=' + 'package.zip',
    method: 'POST',
    headers: {
      'Content-Type': 'application/octet-stream',
      "token": token
    },
  }
  
  var archive = archiver('zip', {
    zlib: { level: 9 }, // Sets the compression level.
  })
  
  const req = http.request(options, (res) => {
    // console.log(`STATUS: ${res.statusCode}`)
    // console.log(`HEADERS: ${JSON.stringify(res.headers)}`)
    res.setEncoding('utf8')
    res.on('data', (chunk) => {
      console.log(`BODY: ${chunk}`)
    })
    res.on('end', () => {
      console.log('No more data in response.')
    })
  })
  
  req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`)
  })
  
  archive.directory(packname, false)
  
  archive.finalize()
  
  archive.pipe(req)
  
  archive.on('end', () => {
    req.end()
    console.log('archive ---- end')
    req.end("publish success!!")
    console.log("publish success!!");
    server.close()
  })
})
// Now that server is running
server.listen(8080)
/************** 唤起浏览器
const postData = querystring.stringify({
  content: 'Hello World!2222',
})

let packname = './package'
// fs.stat(filename, (error, stat) => {

const options = {
  host: 'localhost',
  port: 8081,
  path: '/?filename=' + 'package.zip',
  method: 'POST',
  headers: {
    'Content-Type': 'application/octet-stream',
  },
}

var archive = archiver('zip', {
  zlib: { level: 9 }, // Sets the compression level.
})

const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`)
  console.log(`HEADERS: ${JSON.stringify(res.headers)}`)
  res.setEncoding('utf8')
  res.on('data', (chunk) => {
    console.log(`BODY: ${chunk}`)
  })
  res.on('end', () => {
    console.log('No more data in response.')
  })
})

req.on('error', (e) => {
  console.error(`problem with request: ${e.message}`)
})

archive.directory(packname, false)

archive.finalize()

archive.pipe(req)

archive.on('end', () => {
  console.log('end')
  req.end()
  let redirect_uri = encodeURIComponent('http://localhost:8081/auth')
  child_process.exec(
    `open https://github.com/login/oauth/authorize?client_id=Iv1.c0b7f36b0f0d8b03&redirect_uri=${redirect_uri}&scope=read%3Auser&state=123456`
  )
})
*/

/*
    let readStream = fs.createReadStream("./" + filename);
    readStream.pipe(req);
    readStream.on("end", () => {
        req.end();
    });
    */

// Write data to request body
// req.write(postData);
// req.end();
// })
