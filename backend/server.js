import express from 'express';
import cors from 'cors';
import fs from 'fs';
import axios from 'axios';
import multer from 'multer';

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(express.json());
app.use(cors());

//Colab ML service URL
const ML_SERVICE_URL = 'https://reflects-mens-define-furthermore.trycloudflare.com'';

app.get('/health', async (req, res) => {
  try {
    const response = await axios.get(`${ML_SERVICE_URL}/health`, {timeout: 10000});
    res.status(200).json({
      backend: 'healthy',
      ml_service: response.data
    });
  } catch (error) {
    res.status(503).json({
      backend: 'healthy',
      ml_service: 'unavailable',
      error: error.message
    });
  }
});

const PORT = process.env.PORT || 5051;
app.listen(PORT, () => {
console.log('\n' + '-'.repeat(60));
console.log(`✓ Node.js backend running on http://localhost:${PORT}`);
console.log(`✓ ML service: ${ML_SERVICE_URL}`);
console.log('\nTest: curl http://localhost:${PORT}/health');
console.log('='.repeat(60) + '\n');
})