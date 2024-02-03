import { Request, Response, NextFunction } from 'express';

export const verifyApiKey = (req: Request, res: Response, next: NextFunction): void | Response => {
    const validAPI = process.env.API_KEY;

    if (!validAPI) {
        // Handle the case where API key is not set
        console.error("API_KEY is not set in the environment variables.");
        return res.status(500).json({ success: false, status: "error", message: "Internal Server Error. API key is not configured." });
    }
    const apiKey = req.headers["X_API_KEY"] || req.headers["x_api_key"];

    if (!apiKey || apiKey !== validAPI) {
        return res.status(401).json({ success: false, status: "unauthorized error", message: "Unauthorized. Invalid API key." });
    }
    next();
};
