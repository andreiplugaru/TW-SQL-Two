const DEFAULT_HEADER = {
    'content-type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': '*',
    'Access-Control-Allow-Methods': '*'
}

function errorHandler (error, response)  {
    response.writeHead(error.errorCode, DEFAULT_HEADER)
    response.write(JSON.stringify({'message': error.message}))
}

module.exports = {DEFAULT_HEADER, errorHandler}