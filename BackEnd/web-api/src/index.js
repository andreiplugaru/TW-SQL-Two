const http = require('node:http')
var Handler = require('./handler')


const PORT = process.env.PORT || 3000

http.createServer((req, response) => Handler.handler(req, response)).listen(PORT, () => console.log(`server is runnign at ${PORT}`))
