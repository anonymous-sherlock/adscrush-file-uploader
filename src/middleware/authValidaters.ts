import type { Request, Response, NextFunction } from "express";

export const verifyApiKey = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const apiKey = req.headers["X_API_KEY"] || req.headers["x_api_key"];
  if (apiKey !== "B48Q27AssEMmGutx5D8aFkyXXnJVzAk3") {
    // Replace 'YOUR_API_KEY' with the actual API key
    return res
      .status(401)
      .json({ success: false, status: "error", message: "Invalid api key" });
  }

  next();
};
