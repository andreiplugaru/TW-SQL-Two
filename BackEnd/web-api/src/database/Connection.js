const oracledb = require('oracledb');
const cs = `(description= (retry_count=20)(retry_delay=3)(address=(protocol=tcps)(port=1522)(host=adb.eu-paris-1.oraclecloud.com))(connect_data=(service_name=g38bfaa0689ce89_sqltwodb_high.adb.oraclecloud.com))(security=(ssl_server_dn_match=yes)))`
oracledb.initOracleClient({libDir: 'C:\\instantclient_21_10'});

async function init() {
    try {
        await oracledb.createPool({
            user: 'ADMIN',
            password: '1uJ$!ZRGo1Tazqka',
            connectString: cs
        });
    } catch (err) {
    }
}

async function selectAllFromTable(tableName) {
    let connection;
    try {
        connection = await oracledb.getConnection();
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
        connection = await oracledb.getConnection();
        const options = {outFormat: oracledb.OUT_FORMAT_OBJECT, autoCommit: true};
        const result = await connection.execute(query, binds, options);
        connection.commit();
        return result.lastRowid
    } catch (err) {
        //  console.error(err);
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
        connection = await oracledb.getConnection();
        const options = {outFormat: oracledb.OUT_FORMAT_OBJECT};
        const dbResult = await connection.execute(query, binds, options)
        return Object.values(dbResult.rows)
    } catch (err) {
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
        connection = await oracledb.getConnection();
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
    selectByIdFromTable
}