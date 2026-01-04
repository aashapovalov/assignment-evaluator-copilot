import { useState } from 'react';
import './main-page.css';

// Import images
import appLogoDark from '../assets/logo/app_logo_dark.png';
import btnUploadIpynb from '../assets/logo/btn_upload_ipynb.png';
import btnUploadTxt from '../assets/logo/btn_upload_txt.png';
import iconReadAssignment from '../assets/logo/icon_read_assignment.png';
import iconReadSolution from '../assets/logo/icon_read_solution.png';
import iconGetEvaluation from '../assets/logo/icon_get_evaluation.png';
import {appTitleDark} from "../assets/logo/index.js";

export function MainPage({ onEvaluate }) {
  const [notebookFile, setNotebookFile] = useState(null);
  const [assignmentFile, setAssignmentFile] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (notebookFile && assignmentFile) {
      onEvaluate(notebookFile, assignmentFile);
    }
  };

  const handleNotebookChange = (event) => {
    const file = event.target.files[0];
    if (file) setNotebookFile(file);
  };

  const handleAssignmentChange = (event) => {
    const file = event.target.files[0];
    if (file) setAssignmentFile(file);
  };

  return (
      <div className="main-page">

        {/* Header */}
        <header className="header">
          <div className="header-logo-title">
            <img src={appLogoDark} alt="DidYouEvenCode Logo" className="logo" />
            <img src={appTitleDark} alt="DidYouEvenCode" className="title-image" />
          </div>
          <p className="subtitle">
            An AI that actually checks.<br />
            Not vibes. Not intentions. <span className="highlight">Your code.</span>
          </p>
        </header>

        {/* Hero Section */}
        <main className="hero-section">
          <div className="hero-content">
            {/* Upload Form */}
            <form onSubmit={handleSubmit} className="upload-form">
              <div className="upload-grid">
                {/* Notebook Upload */}
                <label className="upload-card" htmlFor="notebook-input">
                  <input
                      type="file"
                      id="notebook-input"
                      accept=".ipynb"
                      onChange={handleNotebookChange}
                      className="file-input"
                  />
                  <div className="upload-icon">
                    <img src={btnUploadIpynb} alt="Upload notebook" />
                  </div>
                  <h3 className="upload-title">Upload notebook (.ipynb)</h3>
                  <p className="upload-subtitle">
                    {notebookFile ? `✓ ${notebookFile.name}` : 'Yes, the actual notebook.'}
                  </p>
                </label>

                {/* Assignment Upload */}
                <label className="upload-card" htmlFor="assignment-input">
                  <input
                      type="file"
                      id="assignment-input"
                      accept=".pdf,.txt"
                      onChange={handleAssignmentChange}
                      className="file-input"
                  />
                  <div className="upload-icon">
                    <img src={btnUploadTxt} alt="Upload assignment" />
                  </div>
                  <h3 className="upload-title">Upload assignment (.pdf / .txt)</h3>
                  <p className="upload-subtitle">
                    {assignmentFile ? `✓ ${assignmentFile.name}` : 'Requirements. Not vibes.'}
                  </p>
                </label>
              </div>

              {/* Submit Button */}
              <button
                  type="submit"
                  className="submit-button"
                  disabled={!notebookFile || !assignmentFile}
              >
                Evaluate my suffering
              </button>
            </form>

            {/* Process Steps */}
            <div className="process-grid">
              <div className="process-card">
                <div className="process-icon">
                  <img src={iconReadAssignment} alt="Read assignment" />
                </div>
                <h3 className="process-title">We read the assignment</h3>
                <p className="process-description">
                  Extracting the requirements.<br />
                  No guesswork involved.
                </p>
              </div>

              <div className="process-card">
                <div className="process-icon">
                  <img src={iconReadSolution} alt="Search notebook" />
                </div>
                <h3 className="process-title">We search your notebook</h3>
                <p className="process-description">
                  Semantic code analysis.<br />
                  Finding what you wrote.
                </p>
              </div>

              <div className="process-card">
                <div className="process-icon">
                  <img src={iconGetEvaluation} alt="Get receipts" />
                </div>
                <h3 className="process-title">You get receipts</h3>
                <p className="process-description">
                  Pass. Partial. Fail.<br />
                  Proof from your own code.
                </p>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="footer">
          <p>Built by an AI that doesn't care about excuses.</p>
        </footer>
      </div>
  );
}
