import express, { Request, Response, NextFunction } from "express";
import fileUpload, { FileArray, UploadedFile } from "express-fileupload";
import path from "path";
import http from "http";
import { verifyApiKey } from "./middleware/authValidaters";
import { filesPayloadExists } from "./middleware/filesPayloadExists";
import { fileSizeLimiter } from "./middleware/fileSizeLimiter";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import multer from "multer";

const PORT = process.env.PORT || 8080;

const app = express();

app.use(
  cors({
    credentials: true,
  })
);
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

const server = http.createServer(app);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.post(
  "/upload",
  fileUpload({ createParentPath: true }),
  verifyApiKey,
  filesPayloadExists,
  fileSizeLimiter,
  (req: Request, res: Response) => {
    const files: FileArray | undefined = req.files!;
    const body = req.body;
    console.log(body);

    if (!files) {
      return res.json({
        success: false,
        status: "error",
        message: "No files provided",
      });
    }

    const uploadedFiles: string[] = [];

    Object.keys(files).forEach((key) => {
      const file: UploadedFile = files[key] as UploadedFile;
      const filename = `${Date.now()}-${file.name}`;
      const relativePath = path.join("uploads",body.path, filename);

      const filepath = path.join(__dirname, "../", relativePath);

      file.mv(filepath, (err) => {
        if (err) return res.status(500).json({ status: "error", message: err });
      });

      // Push the relative path to the array
      uploadedFiles.push(relativePath);
    });

    return res.json({
      status: "success",
      message: "Files uploaded successfully",
      data: uploadedFiles,
    });
  }
);

server.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
