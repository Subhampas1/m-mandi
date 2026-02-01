import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * File Upload Service
 * Handles commodity image uploads
 */
class FileUploadService {
    constructor() {
        this.uploadDir = path.join(__dirname, '../../uploads');

        // Create upload directory if it doesn't exist
        if (!fs.existsSync(this.uploadDir)) {
            fs.mkdirSync(this.uploadDir, { recursive: true });
        }
    }

    /**
     * Configure multer storage
     */
    getStorage() {
        return multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, this.uploadDir);
            },
            filename: (req, file, cb) => {
                // Create unique filename: timestamp-randomstring-originalname
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                const ext = path.extname(file.originalname);
                const name = path.basename(file.originalname, ext);
                cb(null, `${name}-${uniqueSuffix}${ext}`);
            }
        });
    }

    /**
     * File filter for images only
     */
    fileFilter(req, file, cb) {
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (extname && mimetype) {
            cb(null, true);
        } else {
            cb(new Error('Only image files (jpeg, jpg, png, gif, webp) are allowed!'));
        }
    }

    /**
     * Get multer instance configured for commodity images
     */
    getUploader() {
        return multer({
            storage: this.getStorage(),
            fileFilter: this.fileFilter,
            limits: {
                fileSize: 5 * 1024 * 1024 // 5MB max
            }
        });
    }

    /**
     * Delete a file from uploads
     * @param {string} filename - Name of file to delete
     */
    deleteFile(filename) {
        try {
            const filePath = path.join(this.uploadDir, filename);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error deleting file:', error);
            return false;
        }
    }

    /**
     * Get public URL for uploaded file
     * @param {string} filename - Filename
     * @returns {string} Public URL
     */
    getFileUrl(filename) {
        return `/uploads/${filename}`;
    }

    /**
     * Delete multiple files
     * @param {Array<string>} filenames - Array of filenames
     */
    deleteFiles(filenames) {
        return filenames.map(filename => this.deleteFile(filename));
    }
}

export default new FileUploadService();
