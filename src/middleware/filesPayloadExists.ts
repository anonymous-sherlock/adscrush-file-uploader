import type { Request, Response, NextFunction } from 'express';

export const filesPayloadExists = (req: Request, res: Response, next: NextFunction) => {
  if (!req.files)
    return res
      .status(400)
      .json({ sucess: false, status: "error", message: "No files provided" });

  next();
};

