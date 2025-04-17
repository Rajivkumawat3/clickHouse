import React, { useState } from 'react';
import axios from 'axios';

const App = () => {
  const [source, setSource] = useState('clickhouse');
  const [status, setStatus] = useState('');
  const [recordCount, setRecordCount] = useState(null);
  const [columns, setColumns] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [query, setQuery] = useState('');
  const [queryResult, setQueryResult] = useState('');

  const [chConfig, setChConfig] = useState({
    host: '',
    port: '',
    database: '',
    user: '',
    password: ''
  });

  const [fileConfig, setFileConfig] = useState({
    fileName: '',
    delimiter: ','
  });

  const handleConnect = async () => {
    setStatus('Connecting...');
    try {
      if (source === 'clickhouse') {
        const response = await axios.get('http://localhost:3000/ping');
        if (response.data === 'ok') setStatus('Connected to ClickHouse');
        else setStatus('Ping failed');
      } else {
        setStatus('Flat File ready');
      }
    } catch (err) {
      setStatus('Connection failed: ' + err.message);
    }
  };

  const handleRunQuery = async () => {
    setStatus('Running query...');
    try {
      const response = await axios.post('http://localhost:3000/api/run-query', { query });
      setQueryResult(JSON.stringify(response.data, null, 2));
      setStatus('Query executed successfully');
    } catch (err) {
      setQueryResult('');
      setStatus('Query failed: ' + err.message);
    }
  };

  return (
    <div style={{
      padding: '12rem',
      fontFamily: 'Segoe UI, sans-serif',
      maxWidth: '1000px',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center'
    }}>
      <h2>ClickHouse ↔ Flat File Ingestion Tool</h2>
  
      <div style={{ marginBottom: '2rem' }}>
        <label>
          <strong>Source:</strong>
          <select value={source} onChange={e => setSource(e.target.value)} style={{ marginLeft: '1rem', padding: '0.3rem' }}>
            <option value="clickhouse">ClickHouse</option>
            <option value="flatfile">Flat File</option>
          </select>
        </label>
      </div>
  
      <div style={{
        display: 'flex',
        gap: '1rem',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginBottom: '1rem'
      }}>
        {source === 'clickhouse' ? (
          <>
            <input placeholder="Host" value={chConfig.host}
              onChange={e => setChConfig({ ...chConfig, host: e.target.value })}
              style={{ padding: '0.5rem', width: '150px' }} />
            <input placeholder="Port" value={chConfig.port}
              onChange={e => setChConfig({ ...chConfig, port: e.target.value })}
              style={{ padding: '0.5rem', width: '100px' }} />
            <input placeholder="Database" value={chConfig.database}
              onChange={e => setChConfig({ ...chConfig, database: e.target.value })}
              style={{ padding: '0.5rem', width: '150px' }} />
            <input placeholder="User" value={chConfig.user}
              onChange={e => setChConfig({ ...chConfig, user: e.target.value })}
              style={{ padding: '0.5rem', width: '120px' }} />
            <input placeholder="Password" type="password" value={chConfig.password}
              onChange={e => setChConfig({ ...chConfig, password: e.target.value })}
              style={{ padding: '0.5rem', width: '150px' }} />
          </>
        ) : (
          <>
            <input placeholder="File Name" value={fileConfig.fileName}
              onChange={e => setFileConfig({ ...fileConfig, fileName: e.target.value })}
              style={{ padding: '0.5rem', width: '200px' }} />
            <input placeholder="Delimiter" value={fileConfig.delimiter}
              onChange={e => setFileConfig({ ...fileConfig, delimiter: e.target.value })}
              style={{ padding: '0.5rem', width: '80px' }} />
          </>
        )}
      </div>
  
      <div style={{ marginBottom: '1rem' }}>
        <button onClick={handleConnect} style={{ padding: '0.5rem 1rem' }}>Connect</button>
      </div>
  
      <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
        <textarea
          placeholder="Write your SQL query here..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          style={{
            width: '80%',
            height: '150px',
            padding: '1rem',
            fontSize: '1rem',
            fontFamily: 'monospace',
            marginBottom: '1rem',
            border: '1px solid #ccc',
            borderRadius: '6px'
          }}
        />
      </div>
  
      <button onClick={handleRunQuery} style={{
        padding: '0.75rem 2rem',
        fontSize: '1rem',
        backgroundColor: '#4CAF50',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        marginBottom: '1rem'
      }}>
        Run Query
      </button>
  
      <div style={{
        width: '80%',
        whiteSpace: 'pre-wrap',
        padding: '1rem',
        border: '1px solid #ddd',
        borderRadius: '6px',
        minHeight: '120px',
        textAlign: 'left'
      }}>
        <strong>Status:</strong> {status}<br /><br />
        <strong>Result:</strong><br />
        <code>{queryResult}</code>
      </div>
    </div>
  );
  
};

export default App;
