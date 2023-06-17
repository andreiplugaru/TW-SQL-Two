const xml2js = require('xml2js');
const UnknownFormatException = require('../exceptions/UnknownFormatException.js')
const {js2xml} = require("xml-js");

function exportProblems(problems, format) {
    if (format === 'json') return exportToJSON(problems)
    if (format === 'xml') return exportToXML(problems)
    throw new UnknownFormatException()
}

function exportToXML(problems) {
    const builder = new xml2js.Builder();
    return builder.buildObject({root: {problem: problems}});
}

function exportToJSON(problems) {
    return JSON.stringify(problems)
}

module.exports = {exportProblems}