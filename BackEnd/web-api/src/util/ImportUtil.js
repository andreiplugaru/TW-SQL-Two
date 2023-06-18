const {Parser} = require('xml2js');
const UnknownFormatException = require('../exceptions/UnknownFormatException.js')

function convertToJson(problems, inputFormat) {
    if (inputFormat === 'json') return JSON.parse(problems)
    if (inputFormat === 'xml') return convertToXML(problems)
    throw new UnknownFormatException()
}

function convertToXML(problems) {
    problems = problems.replace(/\\(n|r)\s*/g, "").replace(/\\"/g, "")
    problems = problems.substring(1, problems.length - 1);
    const parser = new Parser({explicitArray: false, tagNameProcessors: [tagName => tagName.toLowerCase()]});

// Parse the XML to JSON
    parser.parseString(problems, (err, result) => {
        if (err) {
            console.error(err);
        } else {
            // Access the parsed JSON
            problems = JSON.stringify(result.root.problem);
        }
    });
    return problems;
}

module.exports = {convertToJson}
