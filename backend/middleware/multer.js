import multer from 'multer';
import fs from 'fs';
import path from 'path';

const storage = multer.diskStorage({
destination: function (req, file, cb) {
    const dest = path.join(process.cwd(), 'public', 'temp');
    try {
        fs.mkdirSync(dest, { recursive: true });
    } catch (_) {
        // ignore
    }
    cb(null, dest);
},
filename: function (req, file, cb) {
    cb(null, file.originalname);
},
});

export const upload = multer({ storage });

// NEW: Only run multer when request is multipart/form-data.
// This lets the same route accept JSON payloads (Admin uses JSON + base64 image).
export const maybeUploadFields = (fields) => {
    return (req, res, next) => {
        const contentType = String(req.headers['content-type'] || '').toLowerCase()
        const isMultipart = contentType.includes('multipart/form-data')
        if (!isMultipart) return next()
        return upload.fields(fields)(req, res, next)
    }
}