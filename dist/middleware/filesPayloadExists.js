"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filesPayloadExists = void 0;
const filesPayloadExists = (req, res, next) => {
    if (!req.files)
        return res
            .status(400)
            .json({ sucess: false, status: "error", message: "No files provided" });
    next();
};
exports.filesPayloadExists = filesPayloadExists;
//# sourceMappingURL=filesPayloadExists.js.map