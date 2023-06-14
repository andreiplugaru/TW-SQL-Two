const DEFAULT_HEADER = require('../util/util.js');
const ForbiddenException = require('../exceptions/ForbiddenException.js');
const jwt = require('jsonwebtoken')

async function checkToken(studentService, req) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) throw new ForbiddenException()
    let id
    await jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
        console.log(err)
        if (err) throw new ForbiddenException()
        let studentFromDB = await studentService.findByUsername(user.username)
        if (studentFromDB === undefined || studentFromDB.length === 0) throw new ForbiddenException()
        id = studentFromDB[0].ID_USER
        console.log(id)
    })
    return id
}

module.exports = {checkToken};