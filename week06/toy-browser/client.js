const net = require("net")
const parser = require("./parserWithCSScomputing.js")
class Request {
  constructor(options) {
    this.method = options.method || 'GET'
    this.host = options.host
    this.port = options.port || 80
    this.path = options.path || '/'
    this.body = options.body || {}
    this.headers = options.headers || {}
    if (!this.headers['Content-Type']) {
      this.headers['Content-Type'] = 'application/x-www-form-urlencoded'
    }

    if (this.headers['Content-Type'] === 'application/json') {
      this.bodyText = JSON.stringify(this.body)
    } else if (this.headers['Content-Type'] === 'application/x-www-form-urlencoded') {
      this.bodyText = Object.entries(this.body).map(([key, value]) => `${key}=${encodeURIComponent(value)}`).join('&')
    }

    this.headers['Content-Length'] = this.bodyText.length
  }

  toString() {
    return `${this.method} ${this.path} HTTP/1.1\r
${Object.entries(this.headers).map(([key, value]) => `${key}: ${value}`).join('\r\n')}\r
\r
${this.bodyText}`
  }

  send(connection) {
    return new Promise((resolve, reject) => {
      const parser = new ResponseParse
      if (connection) {
        connection.write(this.toString())
      } else {
        connection = net.createConnection({
          host: this.host,
          port: this.port
        }, () => {
          connection.write(this.toString())
        })
      }
      connection.on('data', (data) => {
        parser.receive(data.toString())
        if (parser.isFinished) {
          resolve(parser.response)
        }
        connection.end()
      })
      connection.on('error', (err) => {
        reject(err)
        connection.end()
      })
      connection.on('end', () => {
        console.log('完成{end}，断开连接')
      })
    })
  }
}
class Response { }
class ResponseParse {
  constructor() {
    this.WAITING_STATUS_LINE = 0
    this.WAITING_STATUS_LINE_END = 1
    this.WAITING_HEADER_NAME = 2
    this.WAITING_HEADER_SPACE = 3
    this.WAITING_HEADER_VALUE = 4
    this.WAITING_HEADER_LING_END = 5
    this.WAITING_HEADER_BLOCK_END = 6
    this.WAITING_BODY = 7

    this.current = this.WAITING_STATUS_LINE
    this.statusLine = ''
    this.headers = {}
    this.headerName = ''
    this.headerValue = ''
    this.bodyParser = null
  }

  get isFinished() {
    return this.bodyParser && this.bodyParser.isFinished
  }
  get response() {
    this.statusLine.match(/HTTP\/1.1 ([0-9]+) ([\s\S]+)/)
    return {
      statusCode: RegExp.$1,
      statusText: RegExp.$2,
      headers: this.headers,
      body: this.bodyParser.content.join('')
    }
  }
  receive(string) {
    for (let i = 0; i < string.length; i++) {
      this.receiveChar(string.charAt(i))
    }
  }
  receiveChar(c) {
    if (this.current === this.WAITING_STATUS_LINE) {
      if (c === '\r') {
        this.current = this.WAITING_STATUS_LINE_END
      } else if (c === '\n') {
        this.current = this.WAITING_HEADER_NAME
      } else {
        this.statusLine += c
      }
    } 
    
    else if (this.current === this.WAITING_STATUS_LINE_END) {
      if (c === '\n') {
        this.current = this.WAITING_HEADER_NAME
      }
    } 
    
    else if (this.current === this.WAITING_HEADER_NAME) {
      if (c === ':') {
        this.current = this.WAITING_HEADER_SPACE
      } else if (c === '\r') {
        this.current = this.WAITING_HEADER_BLOCK_END
        if (this.headers['Transfer-Encoding'] === 'chunked') {
          this.bodyParser = new ChunkedBodyParser()
        }
      } else {
        this.headerName += c
      }
    } 
    
    else if (this.current === this.WAITING_HEADER_SPACE) {
      if (c === ' ') {
        this.current = this.WAITING_HEADER_VALUE
      }
    } 
    
    else if (this.current === this.WAITING_HEADER_VALUE) {
      if (c === '\r') {
        this.current = this.WAITING_HEADER_LING_END
        this.headers[this.headerName] = this.headerValue
        this.headerName = ''
        this.headerValue = ''
      } else {
        this.headerValue += c
      }
    } 
    
    else if (this.current === this.WAITING_HEADER_LING_END) {
      if (c === '\n') {
        this.current = this.WAITING_HEADER_NAME
      }
    } 
    
    else if (this.current === this.WAITING_HEADER_BLOCK_END) {
      if (c === '\n') {
        this.current = this.WAITING_BODY
      }
    } 
    
    else if (this.current === this.WAITING_BODY) {
      this.bodyParser.receiveChar(c)
    }
  }
}

class ChunkedBodyParser {
  constructor() {
    this.WAITING_LENGTH = 0
    this.WAITING_LENGTH_LINE_END = 1
    this.READING_CHUNK = 2
    this.WAITING_NEW_LINE = 3
    this.WAITING_NEW_LINE_END = 4

    this.length = 0
    this.content = []
    this.isFinished = false
    this.current = this.WAITING_LENGTH
  }
  receiveChar(c) {
    if (this.current === this.WAITING_LENGTH) {
      if (c === '\r') {
        if (this.length === 0) {
          this.isFinished = true
        } else {
          this.current = this.WAITING_LENGTH_LINE_END
        }
      } else {
        // 一个坑：这里的长度其实是十六进制
        // 已修正
        this.length *= 16
        this.length += parseInt(c, 16)
      }
    }

    else if (this.current === this.WAITING_LENGTH_LINE_END) {
      //console.log("this.current === this.WAITING_LENGTH_LINE_END")
      if (c === '\n') {
        this.current = this.READING_CHUNK
      }
    }

    else if (this.current === this.READING_CHUNK) {
      // 一个坑：由于使用的是UTF8的编码方式，所以如果使用中文或者超过一个字节的字符，这里的长度会统计失败
      // 已修正
      this.content.push(c)
      this.length -= getUTF8Length(c)
      if (this.length === 0) {
        this.current = this.WAITING_NEW_LINE
      }
    }

    else if (this.current === this.WAITING_NEW_LINE) {
      if (c === '\r') {
        this.current = this.WAITING_NEW_LINE_END
      }
    }

    else if (this.current === this.WAITING_NEW_LINE_END) {
      if (c === '\n') {
        this.current = this.WAITING_LENGTH
      }
    }
  }

}

function getUTF8Length(c) {
  let length = c.codePointAt().toString(2).length
  //按UTF-8的编码规则，大于1个字节的编码方式可提供的最大二进制位数可计算为（设字节长度为n）:
//8n - n - 1 - 2( n - 1) = 5n + 1
//即当要编码的字符的二进制字符长度为len时，len <= 5n + 1，或者(len - 1) / 5 <= n
//所以字节长度的计算方式为Math.ceil((len - 1) / 5)
  return length <= 7 ? 1 : Math.ceil((length - 1) / 5)
}

void async function () {
  let request = new Request({
    method: 'POST',
    host: '127.0.0.1',
    port: '8088',
    path: '/',
    headers: {
      ['X-Foo2']: 'customed'
    },
    body: {
      name: 'Richard'
    }
  })

  let response = await request.send()

  let dom = parser.parseHTML(response.body)

  console.log(dom)
}()

