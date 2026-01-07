# DidYouEvenCode?

> An AI that actually checks your code - not vibes or intentions.

[![Hackathon](https://img.shields.io/badge/Hackathon-Group%20190-blue)](https://github.com/yourusername/assignment-evaluator)

---

## ✨ Features

- 🚀 **Fast Evaluation** - Results in 5-15 seconds (GPU) or 10-20 seconds (CPU)
- 🔍 **Semantic Code Search** - Uses MiniLM embeddings + FAISS vector similarity
- 📊 **Detailed Feedback** - PASS/PARTIAL/FAIL per requirement with evidence quotes
- 🤖 **AI Summary** - Natural language evaluation report via Flan-T5
- 📈 **Confidence Scores** - Shows reliability of each evaluation
- 💾 **Downloadable Reports** - JSON format with complete analysis
- ⚡ **Parallel Processing** - Evaluates all requirements simultaneously

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────────┐
│                    Three-Tier System                      │
└──────────────────────────────────────────────────────────┘

┌─────────────────────┐
│   React Frontend    │  ← File upload UI, results dashboard
│   (localhost:5173)  │     Dark theme, drag-and-drop
└──────────┬──────────┘
           │ HTTP/REST
           ↓
┌─────────────────────┐
│   Node.js Backend   │  ← MVC architecture, orchestration
│   (localhost:5051)  │     Express, file handling, pipeline
└──────────┬──────────┘
           │ HTTP/REST
           ↓
┌─────────────────────┐
│  Python ML Service  │  ← Embeddings, search, AI summary
│   (Google Colab)    │     MiniLM, FAISS, Flan-T5
│  Cloudflare Tunnel  │     GPU-accelerated when available
└─────────────────────┘
```

### Tech Stack

**Frontend:**
- React 18 + Vite
- Axios for API calls
- CSS3 (dark theme with gradients)

**Backend:**
- Node.js + Express
- MVC pattern (Controllers → Services → Utils)
- Multer for file uploads
- Environment-based configuration

**ML Service:**
- Python 3 + Flask
- Transformers (MiniLM, Flan-T5)
- FAISS (Facebook AI Similarity Search)
- PyTorch (GPU/CPU compatible)
- Cloudflare Tunnel for public access

---

## 📋 Prerequisites

- **Node.js** 16+ and npm
- **Google Account** (for Colab - free tier works)
- **Test files**: Jupyter notebook (`.ipynb`) and assignment text (`.txt` or `.md`)

---

## 🚀 Quick Start

### 1. Clone Repository

```bash
git clone https://github.com/aashapovalov/assignment-evaluator-copilot
cd assignment-evaluator
```

### 2. Environment Setup

**Backend:**
```bash
cd backend
cp .env.example .env
nano .env  # Update ML_SERVICE_URL after starting Colab
```

**Frontend:**
```bash
cd frontend
cp .env.example .env
# Default settings usually work - edit if needed
```

### 3. Start ML Service (Google Colab)

1. **Open notebook:** [Open in Colab](https://colab.research.google.com/drive/YOUR_NOTEBOOK_ID)

2. **Enable GPU (optional but recommended):**
    - Runtime → Change runtime type → GPU (T4) → Save

3. **Run all cells:**
    - Runtime → Run all
    - Wait ~2 minutes for models to load

4. **Copy Cloudflare URL:**
   ```
   🚀 ML SERVICE IS LIVE!
   📡 URL: https://your-random-url.trycloudflare.com
   ```

5. **Update backend config:**
   ```bash
   # In backend/.env
   ML_SERVICE_URL=https://your-random-url.trycloudflare.com
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

# Output:
# 🚀 Server running on port 5051
# 📡 ML Service: https://your-url.trycloudflare.com
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev

# Output:
# ➜ Local: http://localhost:5173
```

### 6. Test the System

1. **Open browser:** `http://localhost:5173`

2. **Upload test files:**
    - Assignment: `data/test_assignment.txt`
    - Notebook: `data/test_notebook.ipynb`

3. **Click "Evaluate my suffering"**

4. **View results** (should show ~90% score with detailed breakdown)

---

## 🧪 Testing

### Via cURL

```bash
# Full evaluation
curl -X POST http://localhost:5051/api/evaluate \
  -F "assignment=@data/test_assignment.txt" \
  -F "notebook=@data/test_notebook.ipynb" \
  | jq '.'

# Check breakdown only
curl -X POST http://localhost:5051/api/evaluate \
  -F "assignment=@data/test_assignment.txt" \
  -F "notebook=@data/test_notebook.ipynb" \
  | jq '.breakdown'
```

**Expected output:**
```json
{
  "overall_score": 90,
  "breakdown": {
    "requirements_met": 13,
    "requirements_partial": 3,
    "requirements_missing": 1,
    "critical_failures": 0
  }
}
```

### Health Checks

```bash
# Backend health
curl http://localhost:5051/health

# ML service health (through backend)
curl http://localhost:5051/health | jq '.ml_service'
```

---

## 📁 Project Structure

```
didyouevencode/
├── frontend/                  # React application
│   ├── src/
│   │   ├── main-page/        # Landing page component
│   │   ├── results/          # Results display component
│   │   ├── assets/           # Logo and images
│   │   ├── App.jsx           # Main app component
│   │   ├── config.js         # Environment config
│   │   └── App.css           # Global styles
│   ├── .env.example          # Frontend env template
│   └── package.json
│
├── backend/                   # Node.js API (MVC)
│   ├── controllers/          # HTTP request handlers
│   │   └── evaluation.controller.js
│   ├── services/             # Business logic
│   │   ├── evaluation-service.js
│   │   ├── evidence-service.js
│   │   ├── scoring-service.js
│   │   └── ml-service.js
│   ├── routes/               # API route definitions
│   ├── middleware/           # File upload, error handling
│   ├── utils/                # Notebook parsing utilities
│   ├── config/               # Configuration management
│   ├── globals/              # Constants
│   ├── .env.example          # Backend env template
│   └── server.js             # Entry point
│
├── colab/
│   └── ml_service.ipynb      # Python ML service
│
├── data/                     # Test files
│   ├── test_assignment.txt
│   └── test_notebook.ipynb
│
├── docs/                     # Documentation
│   ├── screenshots/
│   ├── architecture.md
│   └── colab-setup.md
│
└── README.md                 # This file
```

---

## 🔧 Configuration

### Environment Variables

#### Backend (`backend/.env`)

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Backend server port | `5051` |
| `ML_SERVICE_URL` | Colab Cloudflare tunnel URL | **Required** |
| `UPLOAD_DIR` | Temporary file storage | `uploads/` |
| `REQUEST_TIMEOUT` | API timeout (milliseconds) | `300000` (5 min) |

#### Frontend (`frontend/.env`)

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API endpoint | `http://localhost:5051` |
| `VITE_REQUEST_TIMEOUT` | Request timeout (ms) | `300000` |

**Note:** Frontend variables must be prefixed with `VITE_` to be exposed by Vite bundler.

### Updating Colab URL

The Cloudflare tunnel URL changes each time you restart Colab (~12 hour sessions). Update it:

```bash
# Method 1: Edit .env file
nano backend/.env
# Change: ML_SERVICE_URL=https://new-url.trycloudflare.com

# Method 2: Environment variable
export ML_SERVICE_URL=https://new-url.trycloudflare.com
npm start
```

---

## 🎯 How It Works

The evaluation pipeline executes in **6 stages**:

### Stage 1: Rubric Compilation
- **Method:** Template-based regex parsing
- **Input:** Assignment text file
- **Output:** List of requirements with weights
- **Time:** ~0.5s

### Stage 2: Chunk Extraction
- **Method:** Parse Jupyter notebook structure
- **Input:** `.ipynb` file
- **Process:**
    - Extract code cells and markdown
    - Split large cells (>40 lines) into 30-line chunks with 10-line overlap
- **Output:** 20-30 semantic code chunks
- **Time:** <0.1s

### Stage 3: Embedding Generation
- **Method:** MiniLM sentence transformer
- **Input:** Code chunks
- **Process:** Convert to 384-dimensional vectors
- **Hardware:** GPU-accelerated when available
- **Output:** Embeddings matrix [N × 384]
- **Time:** 0.3-1s (GPU) / 1-2s (CPU)

### Stage 4: Vector Search
- **Method:** FAISS cosine similarity (IndexFlatIP)
- **Input:** Requirements + embeddings
- **Process:** Find top-3 most relevant chunks per requirement
- **Parallelization:** All 17 requirements processed simultaneously
- **Output:** 51 chunk matches (17 × 3)
- **Time:** 2-3s

### Stage 5: Evidence Extraction
- **Method:** Rule-based pattern matching (no LLM - deterministic)
- **Input:** Requirement text + retrieved code chunks
- **Process:**
    - Keyword matching with stop-word filtering
    - Pattern detection (imports, function definitions, API calls)
    - Match ratio: ≥60% = PASS, ≥30% = PARTIAL, <60% = FAIL
- **Parallelization:** All requirements evaluated simultaneously
- **Output:** PASS/PARTIAL/FAIL + confidence score per requirement
- **Time:** 2-3s

### Stage 6: Report Generation
- **Method:** Flan-T5 text generation + score calculation
- **Input:** All evidence results + scores
- **Process:**
    - Generate natural language summary (1 LLM call)
    - Calculate overall score and breakdown
    - Format JSON report with evidence quotes
- **Hardware:** GPU-accelerated when available
- **Output:** Complete evaluation report with AI feedback
- **Time:** 2-5s (GPU) / 8-15s (CPU)

**Total Pipeline Time:** 5-15 seconds

---

## 🧠 Key Technical Decisions

### Why Rule-Based Evidence Extraction?

Initially used Flan-T5 for evidence extraction, but switched to rule-based for:
- ✅ **Speed:** 0.1s vs 5-50s per requirement
- ✅ **Reliability:** Deterministic, no hallucinations
- ✅ **Cost:** No GPU needed for this stage
- ✅ **Parallelization:** Can process 17 requirements simultaneously

**Trade-off:** Less nuanced understanding, but 95%+ accuracy for common patterns.

### Why FAISS?

- Efficient similarity search for large codebases
- GPU/CPU compatible
- Industry-standard (used by Facebook, OpenAI)
- ~10x faster than naive cosine similarity

### Why Cloudflare Tunnel?

- Free public URL for Colab (no ngrok limits)
- HTTPS by default
- No port forwarding needed
- Perfect for demos and hackathons

---

## 🚧 Known Limitations

1. **Colab URL resets** - Cloudflare tunnel URL changes when Colab restarts (~12 hours)
2. **Single notebook per evaluation** - No batch processing yet
3. **English only** - Assignment text and code comments should be in English
4. **Pattern-based matching** - May miss creative solutions that use unconventional approaches
5. **No authentication** - Open endpoints (fine for hackathon/demo)
6. **File size limits** - 10MB max per file

---

## 🐛 Troubleshooting

### Backend won't start

```bash
# Check if port is in use
lsof -i :5051

# Try different port
PORT=5052 npm start
```

### Colab connection fails

```bash
# Check ML service URL in .env
cat backend/.env | grep ML_SERVICE_URL

# Test ML service directly
curl https://your-url.trycloudflare.com/health
```

### Evaluation times out

```bash
# Increase timeout in backend/.env
REQUEST_TIMEOUT=600000  # 10 minutes

# Or in frontend/.env
VITE_REQUEST_TIMEOUT=600000
```

### GPU not being used in Colab

1. Runtime → Change runtime type
2. Select "T4 GPU"
3. Click Save
4. Re-run all cells

---

## 👤 Author

**Aleksei Shapovalov**  
Group 190 | CS Hackathon 2026

- Email: aleksei.a.shapovalov@gmail.com
- GitHub: [@aashapovalov](https://github.com/aashapovalov)
---


