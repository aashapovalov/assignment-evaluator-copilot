import multer from 'multer';
import { config } from '../config';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, config.uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '-' + file.originalname);
  },
});

export const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'assignment' && !file.originalname.match(/\.(txt|md)$/)) {
      return cb(new Error('Assignment must be .txt or .md file'));
    }
    if (file.fieldname === 'notebook' && !file.originalname.match(/\.ipynb$/)) {
      return cb(new Error('Notebook must be .ipynb file'));
    }
    cb(null, true);
  },
});