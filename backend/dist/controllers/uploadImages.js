"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const datasource_1 = require("../datasource");
const Product_1 = require("../entities/Product");
const Image_1 = require("../entities/Image");
const remover_1 = __importDefault(require("../helper/remover"));
function uploadImage(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let id = parseInt(req.params.id);
            if (!id)
                return res.status(400).json({ err: 1, mes: "Missing id" });
            if (!req.files)
                return res.status(400).json({ err: 1, mes: "No files images found" });
            const theProduct = yield datasource_1.dataSource.getRepository(Product_1.Product).findOne({ where: { id: id } });
            if (!theProduct)
                return res.status(404).json({ err: 1, mes: "User not found" });
            for (let i = 0; i < req.files.length; i++) {
                let newImage = new Image_1.Image();
                newImage.imgSrc = req.files[i].path;
                newImage.product = theProduct;
                yield datasource_1.dataSource.getRepository(Image_1.Image).save(newImage);
            }
            res.status(200).json({
                err: 0,
                mes: "Upload successful"
            });
        }
        catch (error) {
            if (!req.files)
                for (let i = 0; i < req.files.length; i++)
                    (0, remover_1.default)(req.files[i].path);
            console.log("Deleted image published");
            res.status(500).json({ message: "Iternal Error", error: error.message });
        }
    });
}
exports.default = uploadImage;
