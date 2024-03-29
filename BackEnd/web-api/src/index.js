const http = require('node:http')
const dotenv = require('dotenv');
dotenv.config();
const Handler = require('./handler')

const PORT = process.env.PORT || 3000
http.createServer((req, response) => Handler.handler(req, response))
    .listen(PORT, () => console.log(`server is running at ${PORT}`))
