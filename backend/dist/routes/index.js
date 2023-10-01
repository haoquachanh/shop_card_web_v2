"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_1 = __importDefault(require("./user"));
const auth_1 = __importDefault(require("./auth"));
const textslider_1 = __importDefault(require("./textslider"));
const question_1 = __importDefault(require("./question"));
const contact_1 = __importDefault(require("./contact"));
const pricelists_1 = __importDefault(require("./pricelists"));
const hotProduct_1 = __importDefault(require("./hotProduct"));
const cart_1 = __importDefault(require("./cart"));
const imageslider_1 = __importDefault(require("./imageslider"));
const uploadimage_1 = __importDefault(require("./uploadimage"));
const product_1 = __importDefault(require("./product"));
const order_1 = __importDefault(require("./order"));
const verifyJWT_1 = require("../middlewares/verifyJWT");
const router = (0, express_1.Router)();
//free
router.use('/auth', auth_1.default);
router.use('/pricelist', pricelists_1.default);
router.use('/question', question_1.default);
router.use('/contact', contact_1.default);
router.use('/hotproduct', hotProduct_1.default);
router.use('/slider', textslider_1.default);
router.use('/imageslider', imageslider_1.default);
router.use('/product', product_1.default);
router.use('/user', user_1.default);
//need login
router.use(verifyJWT_1.verifyJWT);
router.use('/image', uploadimage_1.default);
router.use('/cart', cart_1.default);
router.use('/order', order_1.default);
exports.default = router;
