import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure upload directory exists
const uploadDir = process.env.UPLOAD_DIR || 'uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  }
});

// File filter for images
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Check if file is an image
  if (file.mimetype.startsWith('image/')) {
    // Supported formats: PNG, WEBP, JPG/JPEG
    const supportedFormats = ['image/png', 'image/webp', 'image/jpeg', 'image/jpg'];
    if (supportedFormats.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only PNG, WEBP, and JPG/JPEG files are supported'));
    }
  } else {
    cb(new Error('Only image files are allowed'));
  }
};

// Configure multer
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 25 * 1024 * 1024, // 25MB limit
    files: 10 // Maximum 10 files
  }
});

// Middleware for single image upload
export const uploadSingle = upload.single('image');

// Middleware for multiple image upload
export const uploadMultiple = upload.array('image', 10);

// Middleware for image with optional mask
export const uploadImageWithMask = upload.fields([
  { name: 'image', maxCount: 10 },
  { name: 'mask', maxCount: 1 }
]);

// Cleanup function to remove uploaded files
export const cleanupFiles = (files: Express.Multer.File | Express.Multer.File[] | undefined) => {
  if (!files) return;
  
  const fileArray = Array.isArray(files) ? files : [files];
  
  fileArray.forEach(file => {
    if (fs.existsSync(file.path)) {
      fs.unlink(file.path, (err) => {
        if (err) {
          console.error(`Error deleting file ${file.path}:`, err);
        } else {
          console.log(`Cleaned up file: ${file.path}`);
        }
      });
    }
  });
};

// Cleanup function for field-based uploads
export const cleanupFieldFiles = (files: { [fieldname: string]: Express.Multer.File[] } | undefined) => {
  if (!files) return;
  
  Object.values(files).forEach(fileArray => {
    cleanupFiles(fileArray);
  });
};
