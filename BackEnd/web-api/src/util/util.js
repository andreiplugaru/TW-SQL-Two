const DEFAULT_HEADER = {
    'content-type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': '*',
    'Access-Control-Allow-Methods': '*',
    'Access-Control-Expose-Headers' : "Content-Disposition"
}

function errorHandler(error, response) {
    try {
        response.writeHead(error.errorCode, DEFAULT_HEADER)
        response.write(JSON.stringify({'message': error.message}))
    } catch (err) {
        response.writeHead(500, DEFAULT_HEADER)
        console.log(err)
    }
}

module.exports = {DEFAULT_HEADER, errorHandler}