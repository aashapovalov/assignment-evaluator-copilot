import express from 'express';
import cors from 'cors';
import multer from 'multer';

import { healthRoute } from "./routes";

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(express.json());
app.use(cors());

//routes
app.use('/', healthRoute);


const PORT = process.env.PORT || 5051;
app.listen(PORT, () => {
console.log('\n' + '-'.repeat(60));
console.log(`✓ Node.js backend running on http://localhost:${PORT}`);
console.log(`✓ ML service: ${ML_SERVICE_URL}`);
console.log('\nTest: curl http://localhost:${PORT}/health');
console.log('='.repeat(60) + '\n');
})