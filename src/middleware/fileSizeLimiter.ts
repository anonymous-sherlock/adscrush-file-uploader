import type { Request, Response, NextFunction } from "express";
import type { UploadedFile } from "express-fileupload";

const MB = 512; // 5 MB
const FILE_SIZE_LIMIT = MB * 1024 * 1024;

export const fileSizeLimiter = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const files = req.files as Record<string, UploadedFile | UploadedFile[]>;

  const filesOverLimit: string[] = []; // Which files are over the limit?
  Object.keys(files).forEach((key) => {
    if ((files[key] as UploadedFile).size > FILE_SIZE_LIMIT) {
      filesOverLimit.push((files[key] as UploadedFile).name);
    }
  });

  if (filesOverLimit.length) {
    const properVerb = filesOverLimit.length > 1 ? "are" : "is";

    const sentence =
      `Upload failed. ${filesOverLimit.toString()} ${properVerb} over the file size limit of ${MB} MB.`.replace(
        /,/g,
        ", "
      );

    const message =
      filesOverLimit.length < 3
        ? sentence.replace(",", " and")
        : sentence.replace(/,(?=[^,]*$)/, " and");

    return res.status(413).json({ status: "error", message });
  }

  next();
};
