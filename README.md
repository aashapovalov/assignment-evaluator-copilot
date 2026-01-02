# Assignment Evaluator Copilot

AI-powered tool for evaluating student programming assignments using local LLMs and RAG.

## Architecture

- **Python ML Service** (Flask, port 5050): Runs Flan-T5 and embedding models
- **Node.js Backend** (Express, port 3000): Handles file uploads and orchestration
- **RAG Pipeline**: Uses FAISS for code retrieval and evidence-based grading

## Current Status

✅ Project structure created
✅ Python ML service with Flan-T5-Base and MiniLM
✅ Basic health check and test endpoints
⚠️  Working on fixing bus error on Apple Silicon (M1/M2)

## Setup

### Python ML Service
```bash
cd ml_service
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

### Node.js Backend
```bash
cd backend
npm install
npm start
```

## Testing
```bash
# Health check
curl http://localhost:5050/health

# Test LLM (currently has bus error on POST)
curl -X POST http://localhost:5050/test-llm \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Test"}'
```

## Project Structure
```
assignment-evaluator/
├── ml_service/          # Python ML inference service
│   ├── app.py          # Flask app with LLM endpoints
│   ├── requirements.txt
│   └── venv/           # Virtual environment (not in git)
├── backend/            # Node.js application server
│   ├── server.js       # Express app
│   └── package.json
├── data/               # Test data
│   ├── assignment.txt
│   └── notebooks/
└── README.md
```

## Technologies

- **LLM**: Flan-T5-Base (google/flan-t5-base)
- **Embeddings**: MiniLM (sentence-transformers/all-MiniLM-L6-v2)
- **Vector Store**: FAISS (CPU)
- **Backend**: Flask (Python) + Express (Node.js)

## Next Steps

1. Fix bus error on Apple Silicon
2. Implement rubric compilation endpoint
3. Add notebook parsing
4. Build full evaluation pipeline
5. Create sample test notebooks

## License

MIT