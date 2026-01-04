# 🎓 Assignment Evaluator - AI-Powered Grading System

[![Hackathon](https://img.shields.io/badge/Hackathon-Group%20190-blue)](https://github.com/aashapovalov/assignment-evaluator-copilot)

Automated grading system for Jupyter notebooks using AI. Evaluates student code against assignment requirements and provides detailed feedback with scores.

![Demo Screenshot](./docs/screenshots/demo.png)

## 🚀 Features

- **Automated Grading** - Evaluates notebooks in 30-60 seconds
- **Semantic Search** - Uses embeddings (MiniLM) + FAISS for intelligent code matching
- **Detailed Feedback** - Shows PASS/PARTIAL/FAIL for each requirement with evidence quotes
- **Confidence Scores** - Indicates reliability of each evaluation
- **Downloadable Reports** - JSON format for easy integration

## 🏗️ Architecture
```
┌─────────────────┐
│ React Frontend  │  ← File upload, results display
│  (Port 5173)    │
└────────┬────────┘
         │ HTTP/REST
         ↓
┌─────────────────┐
│ Node.js Backend │  ← Orchestration, file handling
│  (Port 5051)    │
└────────┬────────┘
         │ HTTP/REST
         ↓
┌─────────────────┐
│ Python ML Svc   │  ← Flan-T5, MiniLM, FAISS
│ (Google Colab)  │     Cloudflare Tunnel
└─────────────────┘
```

**Tech Stack:**
- Frontend: React + Vite
- Backend: Node.js + Express (MVC pattern)
- ML Service: Python + Flask + Transformers + FAISS
- Deployment: Google Colab + Cloudflare Tunnel

## 📋 Prerequisites

- Node.js 16+ and npm
- Google Account (for Colab)
- Test files: `.ipynb` notebook and `.txt` assignment

## 🛠️ Setup Instructions

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/assignment-evaluator.git
cd assignment-evaluator
```

### 2. Start ML Service (Google Colab)

1. Open the Colab notebook: [Open in Colab](https://colab.research.google.com/drive/1I4pgsMC3UJjvpl6-YkPvhJSJ9_sQFWR2?usp=sharing)
2. Click **Runtime → Run all**
3. Wait ~2 minutes for models to load
4. Copy the Cloudflare URL from output (e.g., `https://xxx.trycloudflare.com`)

### 3. Configure Backend

Update `backend/config/index.js` with your Colab URL:
```javascript
export const config = {
  mlServiceUrl: 'https://your-colab-url.trycloudflare.com',
  // ... other config
};
```

### 4. Install Dependencies
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 5. Run the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm start
# Runs on http://localhost:5051
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# Runs on http://localhost:5173
```

### 6. Test the System

1. Open browser: `http://localhost:5173`
2. Upload test files from `data/` folder:
    - Assignment: `data/test_assignment.txt`
    - Notebook: `data/test_notebook.ipynb`
3. Click **Evaluate**
4. View results (should show ~90% score)

## 🧪 Testing

### Quick Test via cURL
```bash
curl -X POST http://localhost:5051/api/evaluate \
  -F "assignment=@data/test_assignment.txt" \
  -F "notebook=@data/test_notebook.ipynb" \
  | jq '.breakdown'
```

Expected output:
```json
{
  "overall_score": 90,
  "requirements_met": 13,
  "requirements_partial": 3,
  "requirements_missing": 1
}
```

### Health Check
```bash
# Check backend
curl http://localhost:5051/health

# Check if ML service is connected
curl http://localhost:5051/health | jq '.ml_service'
```

## 📁 Project Structure
```
assignment-evaluator/
├── frontend/              # React UI
│   ├── src/
│   │   ├── App.jsx       # Main component
│   │   ├── config.js     # API configuration
│   │   └── App.css       # Styles
│   └── package.json
│
├── backend/               # Node.js API
│   ├── controllers/      # Request handlers
│   │   ├── health.controller.js
│   │   └── evaluation.controller.js
│   ├── services/         # Business logic
│   │   └── ml-service.js
│   ├── routes/           # API routes
│   ├── middleware/       # Error handling, file upload
│   ├── utils/            # Notebook parsing
│   └── config/           # Configuration
│
├── colab/
│   └── ml_service.ipynb  # Python ML service
│
└── data/                 # Test files
    ├── test_assignment.txt
    └── test_notebook.ipynb
```

## 🎯 How It Works

1. **Rubric Extraction**: Parses assignment text to extract requirements (template-based)
2. **Chunk Extraction**: Splits notebook into semantic chunks (code cells, markdown)
3. **Embedding Generation**: Converts chunks to vectors using MiniLM
4. **Semantic Search**: Uses FAISS to find relevant code for each requirement
5. **Evidence Matching**: Rule-based matching to determine PASS/PARTIAL/FAIL
6. **Report Generation**: Compiles scores, confidence, and feedback

## 🚧 Known Limitations

- **Colab URL changes**: Cloudflare tunnel URL resets when Colab restarts (~12 hours)
- **Single assignment format**: Optimized for Jupyter assignments
- **Evidence quotes**: May show partial code in some cases


## 👤 Author

**Aleksei Shapovalov**
- Contact: aleksei.a.shapovalov@gmail.com
