import { Request, Response } from 'express';
import { MulterError } from 'multer';
import { ValidationError } from '../exceptions/uploadError';
import { normalizePath, generateFileUrl } from '../libs/utils';

export function handleUpload(req: Request, res: Response, err: any): void | Response {
    const files = req.files;

    if(!files) return res.status(400).json({ success: false, status: "error", message: "No files provided" });

    if (err instanceof MulterError) {
        // A Multer error occurred when uploading.
        switch (err.code) {
            case "LIMIT_FILE_SIZE":
                res.status(413).json({ success: false, status: "multer error", message: err.message || "File size limit exceeded!" });
                break;
            case "LIMIT_FILE_COUNT":
                res.status(500).json({ success: false, status: "multer error", message: err.message || "Max File upload count exceeded" });
                break;
            case "LIMIT_UNEXPECTED_FILE":
                res.status(500).json({ success: false, status: "multer error", message: err.message || "File limit exceeded for this field" });
                break;
            default:
                res.status(500).json({ success: false, status: "multer error", message: err.message || "Unknown Multer error occurred!" });
                break;
        }
    } else if (err) {
        if (err instanceof Error && err.name === ValidationError.name) {
            const validationErr = err as ValidationError;
            return res.status(validationErr.status).json({ success: false, status: "validation error", message: err.message || "Internal server error" });
        }
        // An unknown error occurred when uploading.
        return res.status(400).json({ success: false, status: "error", message: err.message || "Internal server error" });
    } else {
        const response = Object.keys(files).flatMap((field) => [
            ...(files as { [fieldname: string]: Express.Multer.File[] })[field].map((file) => ({
                fileName: file.filename,
                originalFileName: file.originalname,
                fileSize: file.size,
                fileType: file.mimetype,
                createdAt: Date.now(),
                uplaodPath: normalizePath(file.destination),
                fileUrl: generateFileUrl(file.path),
                uploadFailed: false,
                status: "done",
                markedForDeletion: false,
            })),
        ]);

        const userMetadata = {
            userId: "123",
            name: "john doe",
        };

        // Add user metadata to each file in the response
        const result = { userMeta: userMetadata, files: response };

        // Respond with the success response
        return res.status(200).json(result);
    }
}
