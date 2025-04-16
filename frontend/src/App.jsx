import React, { useState } from 'react';
import axios from 'axios';

export default function App() {
  const [form, setForm] = useState({
    host: '',
    port: '',
    user: '',
    password: '',
    database: '',
    tableName: '',
    values: '', // Values should be a JSON string (array of arrays)
  });
  const [status, setStatus] = useState('');
  const [tables, setTables] = useState([]);
  const [schema, setSchema] = useState([]);
  const [data, setData] = useState([]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    // Basic validation to ensure all fields are provided
    const requiredFields = ['host', 'port', 'user', 'password', 'database', 'tableName'];
    for (const field of requiredFields) {
      if (!form[field]) {
        setStatus(`Error: Missing ${field}`);
        return false;
      }
    }
    return true;
  };

  const connectClickhouse = async () => {
    if (!validateForm()) return;

    try {
      setStatus('Connecting...');
      const res = await axios.post('http://localhost:3000/ping', form);
      setStatus(`Status: ${res.data.status}`);
    } catch (err) {
      setStatus(`Error: ${err.response?.data?.error || err.message}`);
    }
  };

  const loadTables = async () => {
    if (!validateForm()) return;

    try {
      setStatus('Fetching Tables...');
      const res = await axios.post('http://localhost:3000/tables', form);
      setTables(res.data.tables);
      setStatus('Tables Loaded');
    } catch (err) {
      setStatus(`Error: ${err.response?.data?.error || err.message}`);
    }
  };

  const loadSchema = async () => {
    if (!validateForm()) return;

    try {
      setStatus('Fetching Schema...');
      const res = await axios.post('http://localhost:3000/table-schema', form);
      setSchema(res.data.schema);
      setStatus('Schema Loaded');
    } catch (err) {
      setStatus(`Error: ${err.response?.data?.error || err.message}`);
    }
  };

  const previewData = async () => {
    if (!validateForm()) return;

    try {
      setStatus('Fetching Data...');
      const res = await axios.post('http://localhost:3000/fetch', form);
      setData(res.data.data);
      setStatus(`Fetched ${res.data.data.length} records.`);
    } catch (err) {
      setStatus(`Error: ${err.response?.data?.error || err.message}`);
    }
  };

  const startIngestion = async () => {
    if (!validateForm()) return;
  
    try {
      setStatus('Running query...');
  
      const parsedValues = form.values.trim();
  
      if (!parsedValues || !parsedValues.includes(',')) {
        setStatus('Error: values must be a non-empty CSV formatted string');
        return;
      }
  
      const payload = {
        host: form.host,
        port: form.port,
        user: form.user,
        password: form.password,
        database: form.database,
        tableName: form.tableName,
        values: parsedValues,
      };
  
      const res = await axios.post('http://localhost:3000/insert', payload);
      setStatus(res.data.status);
      console.log(res.data); // Optional debug
    } catch (err) {
      setStatus(`Error: ${err.response?.data?.error || err.message}`);
    }
  };
  
  return (
    <div className="p-6 max-w-5xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">ClickHouse Data UI</h1>

      <div className="grid grid-cols-2 gap-4">
        {['host', 'port', 'user', 'password', 'database', 'tableName', 'values'].map((field) => (
          <input
            key={field}
            name={field}
            value={form[field]}
            onChange={handleChange}
            placeholder={field}
            className="p-2 border rounded"
            type={field === 'password' ? 'password' : 'text'}
          />
        ))}
      </div>

      <div className="flex gap-2">
        <button onClick={connectClickhouse} className="bg-blue-500 text-white px-4 py-2 rounded">Connect</button>
        <button onClick={loadTables} className="bg-green-500 text-white px-4 py-2 rounded">Load Tables</button>
        <button onClick={loadSchema} className="bg-yellow-500 text-white px-4 py-2 rounded">Load Columns</button>
        <button onClick={previewData} className="bg-purple-500 text-white px-4 py-2 rounded">Preview</button>
        <button onClick={startIngestion} className="bg-red-500 text-white px-4 py-2 rounded">Start Ingestion</button>
      </div>

      <div className="bg-gray-100 p-4 rounded shadow">
        <p><strong>Status:</strong> {status}</p>
      </div>

      {tables.length > 0 && (
        <div>
          <h2 className="font-bold">Tables:</h2>
          <ul className="list-disc pl-5">
            {tables.map((t, i) => <li key={i}>{typeof t === 'string' ? t : t.name}</li>)}
          </ul>
        </div>
      )}

      {schema.length > 0 && (
        <div>
          <h2 className="font-bold">Schema:</h2>
          <ul className="list-disc pl-5">
            {schema.map((col, i) => <li key={i}>{col.name} — {col.type}</li>)}
          </ul>
        </div>
      )}

      {data.length > 0 && (
        <div>
          <h2 className="font-bold">Preview Data:</h2>
          <pre className="bg-white p-2 border overflow-x-auto text-sm">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
