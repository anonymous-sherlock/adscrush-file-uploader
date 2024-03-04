import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

// Function to generate a file URL
export function generateFileUrl(fileUrl: string): string {
    const normalizedUrl = fileUrl.replace(/\\/g, "/");
    const domain = process.env.BASE_URL;

    // If the URL is relative (doesn't start with "http" or "https"), append the domain
    if (!/^https?:\/\//i.test(normalizedUrl)) {
        return `${domain}/${normalizedUrl}`;
    }

    // If the URL is already absolute, return it unchanged
    return normalizedUrl;
}

export function normalizePath(path: string): string {
    // Remove leading and trailing slashes and normalize slashes
    let sanitizedPath = path.replace(/^\/|\/$/g, ""); // Trim leading and trailing slashes
    sanitizedPath = sanitizedPath.replace(/[\\\/]/g, "/"); // Normalize slashes
    return sanitizedPath;
}

export const getUploadPath = (body: { path?: string } | undefined, fieldName: string): string => {
    const basePath = path.join("uploads", body?.path || "");

    switch (fieldName) {
        case "crm":
            return path.join(basePath, "crm", "files");
        case "aadharUploader":
            return path.join(basePath, "documents", "aadhar");
        case "documentsUploader":
            return path.join(basePath, "documents");
        default:
            return basePath;
    }
};
