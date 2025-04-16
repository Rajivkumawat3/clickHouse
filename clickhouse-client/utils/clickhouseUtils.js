// utils/clickhouseUtils.js
const { createClient } = require('@clickhouse/client');

function createClickhouseClient({ host, port, user, password, database }) {
    const url = `http://${host}:${port}?database=${database}`
    return createClient({
        url: `http://${host}:${port}`, 
        username: user || 'default',
        password: password || '',
        database: database || 'default',
    });
}

async function pingClickhouse(client) {
    try {
        await client.ping();
        return true;
    } catch (err) {
        return false;
    }
}

async function fetchClickhouseTables(client) {
    const result = await client.query({
        query: 'SHOW TABLES',
        format: 'JSONEachRow'
    });
    return (await result.json()).map(row => row.name);
}

async function fetchClickhouseTableSchema(client, tableName) {
    const result = await client.query({
        query: `DESCRIBE TABLE ${tableName}`,
        format: 'JSONEachRow'
    });
    return await result.json();
}

  

async function fetchDataFromClickhouse(client, tableName) {
    const result = await client.query({
        query: `SELECT * FROM ${tableName}`,
        format: 'JSONEachRow'
    });
    return await result.json();
}

module.exports = {
    createClickhouseClient,
    pingClickhouse,
    fetchClickhouseTables,
    fetchClickhouseTableSchema,
    fetchDataFromClickhouse
};
