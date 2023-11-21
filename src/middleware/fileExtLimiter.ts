import { Request, Response, NextFunction } from "express";
import { UploadedFile } from "express-fileupload";
import path from "path";

export const fileExtLimiter = (allowedExtArray: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const files = req.files as Record<string, UploadedFile>;
    console.log(files);

    const fileExtensions: string[] = ["jpg", "png", "webp", "svg"];
    Object.keys(files).forEach((key) => {
      fileExtensions.push(path.extname(files[key].name));
    });

    // Are the file extensions allowed?
    const allowed = fileExtensions.every((ext) =>
      allowedExtArray.includes(ext)
    );

    if (!allowed) {
      const message = `Upload failed. Only ${allowedExtArray
        .toString()
        .replace(",", ", ")} files allowed.`;

      return res.status(422).json({ status: "error", message });
    }

    next();
  };
};
