"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const routes_1 = __importDefault(require("./routes"));
const getActiveRoute_1 = require("./controllers/getActiveRoute");
const routes_list_1 = require("./config/routes-list");
const multer = require('multer');
const app = (0, express_1.default)();
const port = process.env.PORT || 3001;
const allowedOrigins = [process.env.CLIENT_URL, process.env.HOST_URL, process.env.HOST_URL2, process.env.MANAGER_URL, process.env.MAIN_URL];
app.use((0, cors_1.default)({
    origin: function (origin, callback) {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    }
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// app.use(checkOrigin)
app.use('/api', routes_1.default);
app.get('/routes-list', (req, res) => {
    let list = [];
    app._router.stack.forEach((layer) => {
        const values = (0, getActiveRoute_1.print)([], layer);
        list.push(...values);
    });
    let htmlpage = (0, routes_list_1.renderRoutesList)(list);
    res.send(htmlpage);
});
app.get('*', (req, res) => { res.send("SERVER IS RUNNING"); });
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
