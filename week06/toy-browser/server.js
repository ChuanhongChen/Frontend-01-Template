const http = require('http')

const server = http.createServer((req, res) => {
  console.log('request received')
  console.log(req.headers)
  res.setHeader('Content-Type', 'text/html')
  res.setHeader('X-Foo', 'bar')
  res.setHeader('X-cch-header', 'lovefather');
  res.writeHead(200, { 'Content-Type': 'text/plain' })
  //res.end('good day, commander。日安，指挥官。ajdfoaghoi@gmail.com;adfjoajsfdion_)(*&^%$;')
  res.end(
`<html custom-attribute=ca>
<head>
  <style>
  body div #myid{
    width:100px;
    background-color:#f50;
  }
  body div img{
    width:100px;
    background-color:#f11;
  }
  </style>
</head>
<body>
  <div>
    <img id="myid"/>
    <img />
  </div>
</body>
</html>`)
})

server.listen(8088)
