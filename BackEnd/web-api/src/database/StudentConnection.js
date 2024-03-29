const oracledb = require('oracledb');
const cs = process.env.CONNECTION_STRING

async function executeQuery(query, binds) {
    let connection;
    try {
        connection = await oracledb.getConnection({
            user: 'APP_USER',
            password: '1uJ$!ZRGo1Tazqka',
            connectString: cs
        });
        const options = {outFormat: oracledb.OUT_FORMAT_OBJECT, autoCommit: true};
        const dbResult = await connection.execute(query, binds, options)
        return Object.values(dbResult.rows)
    } catch (err) {
        console.error(err);
        const {errorNum} = err;
        return `-${errorNum}`;
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
}
module.exports = {
    executeQuery
}