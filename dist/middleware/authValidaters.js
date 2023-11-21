"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyApiKey = void 0;
const verifyApiKey = (req, res, next) => {
    const apiKey = req.headers["X_API_KEY"] || req.headers["x_api_key"];
    if (apiKey !== "B48Q27AssEMmGutx5D8aFkyXXnJVzAk3") {
        // Replace 'YOUR_API_KEY' with the actual API key
        return res
            .status(401)
            .json({ success: false, status: "error", message: "Invalid api key" });
    }
    next();
};
exports.verifyApiKey = verifyApiKey;
//# sourceMappingURL=authValidaters.js.map