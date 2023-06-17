function parseRequestBody(stringBody, boundary) {
    const boundaryString = '--' + boundary;
    const rawData = stringBody.split(boundaryString);
    const fileData = rawData[1];
    const fileDataArray = fileData.split('\r\n\r\n');
    const fileHeader = fileDataArray[0];
    const fileBody = fileDataArray[1];
    const fileHeaderArray = fileHeader.split('\r\n');
    const fileName = fileHeaderArray[1].split(';')[2].trim().split('=')[1].replace(/"/g, '');
    const fileContentType = fileHeaderArray[2].split(':')[1].trim();


    return {
        fileName,
        fileContentType,
        fileBody
    }
}

function getBoundary(request) {
    let contentType = request.headers['content-type'];
    const contentTypeArray = contentType.split(';').map(item => item.trim());
    const boundaryPrefix = 'boundary=';
    let boundary = contentTypeArray.find(item => item.startsWith(boundaryPrefix));
    if (!boundary) return null;
    boundary = boundary.slice(boundaryPrefix.length);
    if (boundary) boundary = boundary.trim();
    return boundary;
}

module.exports = {parseRequestBody, getBoundary}