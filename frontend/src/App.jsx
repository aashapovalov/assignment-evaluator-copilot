import { useState } from 'react';
import axios from 'axios';

import { MainPage } from './main-page/index.js';
import { ResultsPage } from './results/index.js';
import './App.css';

function App() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleEvaluate = async (notebookFile, assignmentFile) => {
    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append('notebook', notebookFile);
    formData.append('assignment', assignmentFile);

    try {
      const response = await axios.post(`http://localhost:5051/api/evaluate`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 120000,
      });

      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
  };

  if (loading) {
    return (
        <div className="loading-screen">
          <div className="spinner"></div>
          <h2>Evaluating your code...</h2>
          <p>This may take 30-60 seconds</p>
        </div>
    );
  }

  if (error) {
    return (
        <div className="error-screen">
          <h2>❌ Error</h2>
          <p>{error}</p>
          <button onClick={handleReset}>Try Again</button>
        </div>
    );
  }

  if (result) {
    return <ResultsPage result={result} onReset={handleReset} />;
  }

  return <MainPage onEvaluate={handleEvaluate} />;
}

export default App;