import express from 'express';
import http from 'http';
import cors from 'cors';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { randomUUID } from 'crypto';
import httpErrors from 'http-errors';
import dotenv from 'dotenv';
import { ValidationError } from './exceptions/uploadError';
import { getUploadPath } from './libs/utils';
import { verifyApiKey } from './middleware/authValidaters';
import { handleUpload } from './middleware/uploadHandler';

dotenv.config();

const PORT: number | string = process.env.PORT || 5000;
const app = express();
const server = http.createServer(app);

app.use(cors({
  credentials: true,
}));
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.urlencoded({
  extended: true,
}));

app.get('/', (req, res, next) => {
  res.status(200).json({ success: 'API Service Running' });
});

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const body = req.body;
    const fieldName = file.fieldname || 'files';
    const uploadPath = getUploadPath(body, fieldName);
    fs.mkdir(uploadPath, { recursive: true }, (err) => {
      if (err) {
        return;
      } else {
        cb(null, uploadPath);
      }
    });
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.toLowerCase().split(' ').join('-');
    cb(null, randomUUID().replace(/-/g, '') + '-' + fileName);
  },
});

const upload = multer({
  storage: storage,
  dest: 'uploads/',
  limits: { fileSize: 5 * 1024 * 1024 }, // 50MB File Size Limit
  fileFilter: (req, file, cb) => {
    // Check if the file is an executable
    const isExecutable = /\.(exe|bat|cmd|msi|ts)$/i.test(file.originalname);
    if (isExecutable) {
      return cb(new ValidationError('Executable files are not allowed.', 403));
    } else {
      return cb(null, true);
    }
  },
}).fields([{ name: 'crm' }, { name: 'files' }, { name: 'aadharUploader' }, { name: 'documentsUploader' }]);

app.post('/upload', verifyApiKey, (req, res, next) => {
  upload(req, res, function (err) {
    const files = req.files;
    handleUpload(req, res, err);
  });
});

app.use((req, res, next) => {
  next(new httpErrors.NotFound());
});

// Error handling middleware for handling uncaught errors
const errorHandler = (err: any, req: any, res: any, next: any) => {
  res.status(500).json({ success: false, status: 'error', message: err.message || 'Internal server error' });
};

app.use(errorHandler);

server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));