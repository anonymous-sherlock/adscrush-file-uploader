"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const body_parser_1 = __importDefault(require("body-parser"));
const compression_1 = __importDefault(require("compression"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const authValidaters_1 = require("./middleware/authValidaters");
const fileSizeLimiter_1 = require("./middleware/fileSizeLimiter");
const filesPayloadExists_1 = require("./middleware/filesPayloadExists");
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const http_errors_1 = __importDefault(require("http-errors"));
const PORT = Number(process.env.PORT) || 8080;
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
app.use((0, cors_1.default)({
    credentials: true,
}));
app.use((0, compression_1.default)());
app.use((0, cookie_parser_1.default)());
app.use(body_parser_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use(express_1.default.static(path_1.default.join(__dirname, "public")));
app.get("/", (req, res) => {
    res.json({ message: "hello world" });
});
app.post("/upload", (0, express_fileupload_1.default)({ createParentPath: true }), authValidaters_1.verifyApiKey, filesPayloadExists_1.filesPayloadExists, fileSizeLimiter_1.fileSizeLimiter, (req, res) => {
    const files = req.files;
    const body = req.body;
    console.log(body);
    if (!files) {
        return res.json({
            success: false,
            status: "error",
            message: "No files provided",
        });
    }
    const uploadedFiles = [];
    Object.keys(files).forEach((key) => {
        const file = files[key];
        const remotePath = body.path ? path_1.default.join("uploads", body.path) : "uploads";
        const filename = `${Date.now()}-${file.name}`;
        const relativePath = path_1.default.join(remotePath, filename);
        const filepath = path_1.default.join(__dirname, "../", relativePath);
        file.mv(filepath, (err) => {
            if (err)
                return res.status(500).json({ status: "error", message: err });
        });
        // Push the relative path to the array
        uploadedFiles.push(relativePath);
    });
    return res.json({
        status: "success",
        message: "Files uploaded successfully",
        data: uploadedFiles,
    });
});
app.use((req, res, next) => {
    next(new http_errors_1.default.NotFound());
});
const errorHandler = (err, req, res, next) => {
    res.status(err.status || 500);
    res.send({
        status: err.status || 500,
        message: err.message,
    });
};
app.use(errorHandler);
server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
//# sourceMappingURL=app.js.map