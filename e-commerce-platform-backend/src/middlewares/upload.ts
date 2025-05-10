import multer from 'multer';
import path from 'path';
import { Request } from 'express';
import { AppError } from './error';

const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb) => {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: (req: Request, file: Express.Multer.File, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError('Invalid file type. Only JPEG, JPG, PNG and GIF are allowed.', 400));
  }
};

const limits = {
  fileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880') // 5MB default
};

export const upload = multer({
  storage,
  fileFilter,
  limits
}); 