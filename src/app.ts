import express, {
  Application,
  Request,
  Response,
  NextFunction,
  ErrorRequestHandler,
} from "express";
import http, { Server } from "http";
import bodyParser from "body-parser";
import compression from "compression";
import cookieParser from "cookie-parser";
import { verifyApiKey } from "./middleware/authValidaters";
import { fileSizeLimiter } from "./middleware/fileSizeLimiter";
import { filesPayloadExists } from "./middleware/filesPayloadExists";
import fileUpload, { FileArray, UploadedFile } from "express-fileupload";
import cors from "cors";
import path from "path";
import { config } from "dotenv";

config();

import createHttpError from "http-errors";
import { handleFileUpload } from "./lib/handleFileUpload ";

const PORT: number = Number(process.env.PORT) || 8080;

const app: Application = express();
const server: Server = http.createServer(app);

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

app.get("/", (req, res) => {
  res.json({ message: "hello world" });
});

app.post(
  "/upload",
  [
    fileUpload({ createParentPath: true }),
    verifyApiKey,
    filesPayloadExists,
    fileSizeLimiter,
  ],
  (req: Request, res: Response) => {
    const files: FileArray | undefined = req.files!;
    const body = req.body;

    if (!files) {
      return res.json({
        success: false,
        status: "error",
        message: "No files provided",
      });
    }

    const uploadedFiles: string[] = Object.keys(files).map((key) => {
      const file: UploadedFile = files[key] as UploadedFile;
      return handleFileUpload(file, body);
    });


    return res.json({
      status: "success",
      message: "Files uploaded successfully",
      data: uploadedFiles,
    });
  }
);

app.use((req: Request, res: Response, next: NextFunction) => {
  next(new createHttpError.NotFound());
});

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    status: err.status || 500,
    message: err.message,
  });
};

app.use(errorHandler);
server.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
