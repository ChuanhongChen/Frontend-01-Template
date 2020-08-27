const http = require('http')
const fs = require('fs')
const unzip = require('unzipper')
const https = require('https')

// Create an HTTP server
const server = http.createServer((req, res) => {
  if (req.url.match(/^\/auth/)) {
    return auth(req, res)
  }
  if (req.url.match(/^\/favicon.ico/)) {
    res.writeHead(404, { 'Content-Type': 'text/plain' })
    res.end('okay')
    return 
  }
  // let matched = req.url.match(/filename=([^&]+)/);
  // let filename = matched && matched[1];
  // if(!filename) return ;
  // let writeStream = fs.createWriteStream("../server/public/" + filename);
  // req.pipe(writeStream);



  
  const options = {
    hostname: 'api.github.com',
    port: 443,
    path: '/user',
    method: 'GET',
    headers: {
      Authorization: `token ${req.headers.token}`,
      'User-Agent': 'toy-publish',
    },
  }

  const request = https.request(options, (response) => {
    let body = '';
    response.on('data', (d) => {
      if (d) {
        body += d.toString();
      }
    });

    response.on('end', () => {
      let user = JSON.parse(body);
      console.log("github-user-info", user);
      // TODO 权限检查
      let writeStream = unzip.Extract({ path: '../server/public' })
      req.pipe(writeStream)
      req.on('end', () => {
        res.writeHead(200, { 'Content-Type': 'text/plain' })
        res.end('okay')
      })
    });
  })

  request.on('error', (e) => {
    console.error(e)
  })
  request.end('okay')

})

function auth(req, res) {
  let code = req.url.match(/code=([^&]+)/)[1]
  let state = '123456'
  let client_secret = 'd4baa2dab7e2eee0a879d2cd9cc4df0d69b38bbc'
  let client_id = 'Iv1.c0b7f36b0f0d8b03'
  let redirect_uri = encodeURIComponent('http://localhost:8081/auth')

  let params = `code=${code}&state=${state}&client_secret=${client_secret}&client_id=${client_id}&redirect_uri=${redirect_uri}`
  let url = `https://github.com/login/oauth/access_token?${params}`
  const options = {
    hostname: 'github.com',
    port: 443,
    path: `/login/oauth/access_token?${params}`,
    method: 'POST',
  }

  const request = https.request(options, (response) => {
    // console.log('statusCode:', res.statusCode)
    // console.log('headers:', res.headers)

    response.on('data', (d) => {
      // process.stdout.write(d)
      let result = d.toString().match(/access_token=([^&]+)/);
      if (result) {
        let token = result[1];
        res.writeHead(200, { 
          'Content-Type': 'text/html',
          "access_token": token
        });
        // console.log(token);
        // res.end('okay');
        res.end(`<a href="http://localhost:8080/publish?token=${token}">publish</a>`);
      } else {
        res.writeHead(200, { 
          'Content-Type': 'text/plain',
        });
        res.end('error');
      }
    })
  })

  request.on('error', (e) => {
    console.error(e)
  })
  request.end('okay')
  // console.log(code);
  // res.writeHead(200, { 'Content-Type': 'text/plain' });
}

// Now that server is running
server.listen(8081)
