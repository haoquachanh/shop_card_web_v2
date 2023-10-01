"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkOrigin = void 0;
const allowedOrigins = [process.env.CLIENT_URL, process.env.HOST_URL, process.env.HOST_URL2, process.env.MANAGER_URL, process.env.MAIN_URL];
const checkOrigin = (req, res, next) => {
    if (!req.get('origin') || allowedOrigins.indexOf(req.get('origin')) === -1) {
        // Nếu không có nguồn gốc hoặc không hợp lệ, từ chối yêu cầu
        return res.status(403).json({ error: 'Access denied' });
    }
    next();
};
exports.checkOrigin = checkOrigin;
