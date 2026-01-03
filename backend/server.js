import express from 'express';
import cors from 'cors';

import { healthRoute } from "./routes";

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/', healthRoute);


const PORT = process.env.PORT || 5051;
app.listen(PORT, () => {
console.log('\n' + '-'.repeat(60));
console.log(`✓ Node.js backend running on http://localhost:${PORT}`);
console.log(`✓ ML service: ${ML_SERVICE_URL}`);
console.log('\nTest: curl http://localhost:${PORT}/health');
console.log('='.repeat(60) + '\n');
})