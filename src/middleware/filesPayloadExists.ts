import { Request, Response, NextFunction } from 'express';

export const filesPayloadExists = (req: Request, res: Response, next: NextFunction): void | Response => {
    if (!req.files) {
        return res
            .status(400)
            .json({ success: false, status: "error", message: "No files provided" });
    }
    next();
};
