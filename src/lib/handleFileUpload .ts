import { Request } from "express";
import { UploadedFile } from "express-fileupload";
import path from "path";

interface MyRequestBody {
    path?: string;
    // Add other properties as needed
}

export const handleFileUpload = (file: UploadedFile, body: Request<{} | MyRequestBody>): string => {
    const remotePath = body.path ? path.join("uploads", body.path) : "uploads";
    const filename = `${Date.now()}-${file.name}`;
    const relativePath = path.join(remotePath, filename);
    const filepath = path.join(__dirname, "../../", relativePath);

    file.mv(filepath, (err) => {
        if (err) throw err; // Consider throwing the error so that it goes to the global error handler
    });

    return relativePath;
};

