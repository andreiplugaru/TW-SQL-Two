const {XMLBuilder} =  require('fast-xml-parser');

const UnknownFormatException = require('../exceptions/UnknownFormatException.js')

function exportProblems(problems, format) {
    if (format === 'json') return exportToJSON(problems)
    if (format === 'xml') return exportToXML(problems)
    throw new UnknownFormatException()
}

function exportToXML(problems) {
    const builder = new XMLBuilder({
        arrayNodeName: "problem"
    });
    const xmlContent = `<?xml version="1.0"?>
<problems>
  ${builder.build(problems)}
</problems>`
    return xmlContent
}

function exportToJSON(problems) {
    return JSON.stringify(problems)
}

module.exports = {exportProblems}