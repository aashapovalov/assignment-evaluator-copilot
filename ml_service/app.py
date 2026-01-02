from flask import Flask, request, jsonify
from transformers import AutoTokenizer, AutoModel, AutoModelForSeq2SeqLM
import torch
import torch.nn.functional as F
import numpy as np
import json

app = Flask(__name__)
# Global variables for models
llm_tokenizer = None
llm_model = None
embed_tokenizer = None
embed_model = None


def load_models():
    """Load models once at startup"""
    global llm_tokenizer, llm_model, embed_tokenizer, embed_model

    print("=" * 50)
    print("LOADING MODELS - This will take 2-5 minutes on first run...")
    print("=" * 50)

    # LLM for rubric/evidence/review generation
    print("Loading Flan-T5-Base for text generation...")
    llm_tokenizer = AutoTokenizer.from_pretrained("google/flan-t5-base")
    llm_model = AutoModelForSeq2SeqLM.from_pretrained("google/flan-t5-base")
    print("✓ Flan-T5-Base loaded")

    # Embedding model for RAG
    print("Loading MiniLM for embeddings...")
    embed_tokenizer = AutoTokenizer.from_pretrained("sentence-transformers/all-MiniLM-L6-v2")
    embed_model = AutoModel.from_pretrained("sentence-transformers/all-MiniLM-L6-v2")
    print("✓ MiniLM loaded")

    print("=" * 50)
    print("ALL MODELS READY!")
    print("=" * 50)

def mean_pooling(model_output, attention_mask):
    """Mean pooling for sentence embeddings"""
    token_embeddings = model_output[0]
    input_mask_expanded = attention_mask.unsqueeze(-1).expand(token_embeddings.size()).float()
    return torch.sum(token_embeddings * input_mask_expanded, 1) / torch.clamp(input_mask_expanded.sum(1), min=1e-9)


def get_embeddings(texts, batch_size=8):
    """Generate embeddings for texts"""
    embeddings = []

    for i in range(0, len(texts), batch_size):
        batch = texts[i:i + batch_size]
        print("embed_tokenizer:", embed_tokenizer)
        encoded = embed_tokenizer(
            batch,
            padding=True,
            truncation=True,
            max_length=128,
            return_tensors='pt'
        )

        with torch.no_grad():
            model_output = embed_model(**encoded)

        batch_embeddings = mean_pooling(model_output, encoded['attention_mask'])
        batch_embeddings = F.normalize(batch_embeddings, p=2, dim=1)

        embeddings.append(batch_embeddings.cpu().numpy())

    return np.vstack(embeddings)

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "service": "ml-inference",
        "models_loaded": llm_model is not None and embed_model is not None
    })


@app.route('/test-llm', methods=['POST'])
def test_llm():
    """Test endpoint for LLM generation"""
    data = request.json
    prompt = data.get('prompt', 'Hello, how are you?')

    inputs = llm_tokenizer(prompt, return_tensors="pt", max_length=512, truncation=True)
    outputs = llm_model.generate(
        **inputs,
        max_new_tokens=100,
        temperature=0.7,
        do_sample=True
    )
    response = llm_tokenizer.decode(outputs[0], skip_special_tokens=True)

    return jsonify({
        "prompt": prompt,
        "response": response
    })


@app.route('/test-embeddings', methods=['POST'])
def test_embeddings():
    """Test endpoint for embeddings"""
    data = request.json
    texts = data.get('texts', ['Hello world', 'Test sentence'])

    embeddings = get_embeddings(texts)

    return jsonify({
        "texts": texts,
        "embeddings_shape": embeddings.shape,
        "dimension": int(embeddings.shape[1]),
        "sample_embedding": embeddings[0][:5].tolist()  # First 5 dimensions
    })


if __name__ == '__main__':
    import os

    # Load models once on startup
    load_models()

    # Use port 5050 (5000 is occupied)
    port = 5050

    print("\n" + "=" * 60)
    print(f"🚀 Flask ML Service Starting")
    print(f"📡 URL: http://localhost:{port}")
    print(f"🏥 Health Check: curl http://localhost:{port}/health")
    print(f"🧪 Test LLM: curl -X POST http://localhost:{port}/test-llm \\")
    print(f'     -H "Content-Type: application/json" \\')
    print(f'     -d \'{{"prompt": "Hello"}}\'')
    print("=" * 60 + "\n")

    # Run Flask (no debug/reloader to prevent double model loading)
    app.run(
        host='0.0.0.0',
        port=port,
        debug=False,
        use_reloader=False,
        threaded=True
    )