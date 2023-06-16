const oracledb = require('oracledb');
const cs = process.env.CONNECTION_STRING
oracledb.initOracleClient({libDir: 'C:\\instantclient_21_10'});

async function init() {
    try {
        await oracledb.createPool({
            user: 'ADMIN',
            password: '1uJ$!ZRGo1Tazqka',
            connectString: cs,
            poolMin: 1,
            poolMax: 5,
            poolTimeout: 300,
            poolAlias: 'default'

        });
        console.log('Connection pool started');
    } catch (err) {
    }
}

async function selectAllFromTable(tableName) {
    let connection;
    try {
        connection = await oracledb.getConnection('default');
        const sql = `SELECT * FROM ` + tableName;
        const options = {outFormat: oracledb.OUT_FORMAT_OBJECT};
        const result = await connection.execute(sql, {}, options);
        return result.rows
    } catch (err) {
        console.error(err);
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

async function insertInTable(query, binds) {
    let connection;
    try {
        connection = await oracledb.getConnection('default');
        const options = {outFormat: oracledb.OUT_FORMAT_OBJECT, autoCommit: true};
        const result = await connection.execute(query, binds, options);
        connection.commit();
        return result.lastRowid
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

async function executeQuery(query, binds) {
    let connection;
    try {
        connection = await oracledb.getConnection('default');
        const options = {outFormat: oracledb.OUT_FORMAT_OBJECT, autoCommit: true};
        const dbResult = await connection.execute(query, binds, options)
        return Object.values(dbResult.rows)
    } catch (err) {
      //  CONNECTION_STRING_STUDENTconsole.error(err);
        const {errorNum} = err;
        console.log(err)
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
async function executeQueryWithOutVar(query, binds) {
    let connection;
    try {
        connection = await oracledb.getConnection('default');
     //   const options =  { ret: {dir: oracledb.BIND_OUT,type: oracledb.STRING} };
        const dbResult = await connection.execute(query, binds)
        return dbResult.outBinds.problem_id
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
async function selectByIdFromTable(tableName, id) {
    let connection;
    try {
        connection = await oracledb.getConnection('default');
        const sql = `SELECT * FROM ` + tableName + ` WHERE id = ` + id;
        const options = {outFormat: oracledb.OUT_FORMAT_OBJECT};
        const result = await connection.execute(sql, {}, options);
        return result.rows
    } catch (err) {
        console.error(err);
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

async function closePoolAndExit() {
    console.log('\nTerminating');
    try {
        await oracledb.getPool().close();
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
}

process
    .once('SIGTERM', closePoolAndExit)
    .once('SIGINT', closePoolAndExit);

init();

module.exports = {
    selectAllFromTable,
    insertInTable,
    executeQuery,
    selectByIdFromTable,
    executeQueryWithOutVar
}