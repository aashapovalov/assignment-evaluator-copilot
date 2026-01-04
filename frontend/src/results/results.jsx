import './results.css';

export function ResultsPage({ result, onReset }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'PASS': return 'pass';
      case 'PARTIAL': return 'partial';
      case 'FAIL': return 'fail';
      default: return 'unknown';
    }
  };

  const getStatusEmoji = (status) => {
    switch (status) {
      case 'PASS': return '✅';
      case 'PARTIAL': return '⚠️';
      case 'FAIL': return '❌';
      default: return '❓';
    }
  };

  const downloadReport = () => {
    const blob = new Blob([JSON.stringify(result, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `evaluation-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
      <div className="results-page">
        {/* Header with Actions */}
        <header className="results-header">
          <h1 className="results-title">Evaluation Results</h1>
          <div className="results-actions">
            <button onClick={downloadReport} className="download-button">
              📥 Download Report
            </button>
            <button onClick={onReset} className="reset-button">
              ← Evaluate Another
            </button>
          </div>
        </header>

        {/* Overall Score Card */}
        <div className="score-section">
          <div className="score-card">
            <h2 className="score-label">Overall Score</h2>
            <div className={`score-value ${result.overall_score >= 70 ? 'high' : result.overall_score >= 40 ? 'medium' : 'low'}`}>
              {result.overall_score}%
            </div>
            <div className="score-breakdown">
              <div className="breakdown-item pass">
                <span className="breakdown-count">{result.breakdown.requirements_met}</span>
                <span className="breakdown-label">Met</span>
              </div>
              <div className="breakdown-item partial">
                <span className="breakdown-count">{result.breakdown.requirements_partial}</span>
                <span className="breakdown-label">Partial</span>
              </div>
              <div className="breakdown-item fail">
                <span className="breakdown-count">{result.breakdown.requirements_missing}</span>
                <span className="breakdown-label">Missing</span>
              </div>
            </div>
            {result.breakdown.critical_failures > 0 && (
                <div className="critical-warning">
                  🔴 {result.breakdown.critical_failures} Critical Failure{result.breakdown.critical_failures > 1 ? 's' : ''}
                </div>
            )}
          </div>
        </div>

        {/* Requirements Details */}
        <div className="requirements-section">
          <h2 className="section-title">Detailed Feedback</h2>

          <div className="requirements-list">
            {result.per_requirement_status.map((req) => (
                <div
                    key={req.requirement_id}
                    className={`requirement-card ${getStatusColor(req.status)}`}
                >
                  {/* Header */}
                  <div className="requirement-header">
                    <div className="requirement-meta">
                      <span className="requirement-id">{req.requirement_id}</span>
                      {req.category && (
                          <span className="requirement-category">{req.category}</span>
                      )}
                    </div>
                    <div className="requirement-status-info">
                  <span className={`status-badge ${getStatusColor(req.status)}`}>
                    {getStatusEmoji(req.status)} {req.status}
                  </span>
                      <span className="confidence-badge">
                    {(req.confidence * 100).toFixed(0)}% confident
                  </span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="requirement-description">{req.description}</p>

                  {/* Evidence */}
                  {req.evidence_quote && req.evidence_quote.trim() && (
                      <div className="evidence-section">
                        <div className="evidence-label">📝 Evidence Found:</div>
                        <pre className="evidence-code">{req.evidence_quote}</pre>
                      </div>
                  )}

                  {/* Feedback */}
                  {req.feedback && (
                      <div className="feedback-section">
                        <div className="feedback-label">💬 Feedback:</div>
                        <p className="feedback-text">{req.feedback}</p>
                      </div>
                  )}

                  {/* Points */}
                  <div className="points-section">
                <span className="points-earned">
                  {req.points_earned.toFixed(1)} / {req.points_possible.toFixed(1)} points
                </span>
                  </div>
                </div>
            ))}
          </div>
        </div>

        {/* Summary Stats */}
        <div className="summary-section">
          <div className="summary-card">
            <h3>📊 Summary Statistics</h3>
            <div className="summary-grid">
              <div className="summary-item">
                <div className="summary-value">{result.per_requirement_status.length}</div>
                <div className="summary-label">Total Requirements</div>
              </div>
              <div className="summary-item">
                <div className="summary-value">
                  {((result.breakdown.requirements_met / result.per_requirement_status.length) * 100).toFixed(0)}%
                </div>
                <div className="summary-label">Completion Rate</div>
              </div>
              <div className="summary-item">
                <div className="summary-value">
                  {(result.per_requirement_status.reduce((sum, req) => sum + req.confidence, 0) / result.per_requirement_status.length * 100).toFixed(0)}%
                </div>
                <div className="summary-label">Avg Confidence</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="results-footer">
          <p className="timestamp">
            Evaluated on {new Date(result.timestamp).toLocaleString()}
          </p>
        </footer>
      </div>
  );
}
