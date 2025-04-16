const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const {
    createClickhouseClient,
    pingClickhouse,
    fetchClickhouseTables,
    fetchClickhouseTableSchema,
    fetchDataFromClickhouse
} = require('./utils/clickhouseUtils');

const app = express();
const port = process.env.PORT || 3000;

app.use(
    cors({
      origin: ["http://localhost:5173"]
    })
  );


app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('ClickHouse Server is Running');
});

app.post('/ping', async (req, res) => {
    try {
        const client = createClickhouseClient(req.body);
        const result = await pingClickhouse(client);
        res.json({ status: result ? 'alive' : 'unreachable' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/tables', async (req, res) => {
    try {
        const client = createClickhouseClient(req.body);
        const tables = await fetchClickhouseTables(client);
        res.json({ tables });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/table-schema', async (req, res) => {
    const { tableName, ...connection } = req.body;
    if (!tableName) return res.status(400).json({ error: "Missing 'tableName'" });

    try {
        const client = createClickhouseClient(connection);
        const schema = await fetchClickhouseTableSchema(client, tableName);
        res.json({ schema });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/fetch', async (req, res) => {
    const { tableName, ...connection } = req.body;
    if (!tableName) return res.status(400).json({ error: "Missing 'tableName'" });

    try {
        const client = createClickhouseClient(connection);
        const data = await fetchDataFromClickhouse(client, tableName);
        res.json({ data });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/insert', async (req, res) => {
    const { tableName, values, ...connection } = req.body;

    console.log('Received values:', values); // Debugging line

    if (!tableName || !values) {
        return res.status(400).json({ error: 'Missing tableName or values' });
    }

    try {
        const client = createClickhouseClient(connection);

        // Check if values is a string before processing
        if (typeof values !== 'string') {
            return res.status(400).json({ error: 'Values should be a valid string' });
        }

        // Convert CSV string into an array of arrays
        const formattedValues = values.trim().split('\n').map(row => row.split(',').map(item => item.trim()));

        if (formattedValues.length === 0 || formattedValues[0].length === 0) {
            return res.status(400).json({ error: 'Values cannot be empty or invalid' });
        }

        const query = `INSERT INTO ${tableName} FORMAT CSV`;

        // Insert values as an array of arrays
        await client.insert({
            query,
            format: 'CSV',
            values: formattedValues, // Pass the array of arrays
        });

        res.send({ status: 'Inserted successfully using CSV format' });

    } catch (err) {
        console.error('Insert error:', err);
        res.status(500).json({ error: err.message });
    }
});

app.listen(port, () => {
    console.log(`ClickHouse server listening on port ${port}`);
});
