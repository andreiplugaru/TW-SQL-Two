const {XMLParser} = require('fast-xml-parser');
const UnknownFormatException = require('../exceptions/UnknownFormatException.js')

function convertToJson(problems, inputFormat) {
    if (inputFormat === 'json') return JSON.parse(problems)
    if (inputFormat === 'xml') return convertToXML(problems)
    throw new UnknownFormatException()
}

function convertToXML(problems) {
    const parser = new XMLParser();
    return parser.parse(problems)
}

module.exports = {convertToJson}
