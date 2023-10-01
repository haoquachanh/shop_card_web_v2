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
Object.defineProperty(exports, "__esModule", { value: true });
const datasource_1 = require("../datasource");
const HotProduct_1 = require("../entities/HotProduct");
const Product_1 = require("../entities/Product");
class HotProductController {
    getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const theRepository = datasource_1.dataSource.getRepository(HotProduct_1.HotProduct);
                const sortParam = req.query.sort; // Tham số để sắp xếp
                const searchKeyword = req.query.search;
                const queryBuilder = yield theRepository
                    .createQueryBuilder('hotProduct')
                    .leftJoin('hotProduct.product', 'product')
                    .addSelect([
                    'product.name',
                    'product.id',
                    'product.avt',
                    'product.avt_hover'
                ])
                    .leftJoin('product.avt', 'avt') // Kết nối đến avt của Product
                    .addSelect(['avt.imgSrc'])
                    .leftJoin('product.avt_hover', 'avt_hover') // Kết nối đến avt của Product
                    .addSelect(['avt_hover.imgSrc']);
                // .leftJoinAndSelect('product.avt_hover', 'avt_hover.imgSrc');
                // .addSelect(['avt_hover.imgSrc'])
                if (sortParam) {
                    const [field, order] = sortParam.split(':');
                    queryBuilder.orderBy(`hotProduct.${field}`, order);
                }
                const users = yield queryBuilder.getMany();
                const count = yield queryBuilder.getCount();
                if (count === 0)
                    return res.status(200).json({
                        err: 1,
                        mes: "No have any hot products"
                    });
                res.status(200).json({
                    err: 0,
                    mes: `Got ${count} hotProduct.`,
                    data: users
                });
            }
            catch (error) {
                res.status(500).json({ error: 'Internal server error' });
            }
        });
    }
    get(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let id = parseInt(req.params.id);
                if (!id)
                    return res.status(400).json({
                        err: 1,
                        mes: "Missing required parameter"
                    });
                const theRepository = datasource_1.dataSource.getRepository(HotProduct_1.HotProduct);
                let pricelist = yield theRepository.findOne({ where: { id: id } });
                if (!pricelist)
                    return res.status(404).json({
                        err: 1,
                        mes: "Price not found"
                    });
                res.status(200).json({
                    err: 0,
                    mes: "Got pricelist",
                    data: pricelist
                });
            }
            catch (error) {
                res.status(500).json({ error: 'Internal server error' });
            }
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { size, rank, effect, material, productId } = req.body;
                if (!(size && rank && effect && material && productId))
                    return res.status(400).json({
                        err: 1,
                        mes: "Missing required parameter"
                    });
                let theProduct = yield datasource_1.dataSource.getRepository(Product_1.Product).findOne({ where: { id: productId } });
                console.log(theProduct);
                const theRepository = datasource_1.dataSource.getRepository(HotProduct_1.HotProduct);
                let newPrice = Object.assign(Object.assign({}, req.body), { product: theProduct });
                yield theRepository.save(newPrice);
                res.status(200).json({
                    err: 0,
                    mes: "Hot product created successfully"
                });
            }
            catch (error) {
                res.status(500).json({ error: 'Internal server error' + error.message });
            }
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let id = parseInt(req.params.id);
                let { size, rank, effect, material, productId } = req.body;
                if (!(size || rank || effect || material || productId) || !id)
                    return res.status(400).json({
                        err: 1,
                        mes: "Missing required parameter"
                    });
                const theRepository = datasource_1.dataSource.getRepository(HotProduct_1.HotProduct);
                let hotproductifo;
                hotproductifo = yield theRepository.findOne({ where: { id: id } });
                if (!hotproductifo)
                    return res.status(404).json({
                        err: 1,
                        mes: "HotProduct not found",
                    });
                let theProduct = yield datasource_1.dataSource.getRepository(Product_1.Product).findOne({ where: { id: productId } });
                if (!theProduct)
                    return res.status(404).json({
                        err: 1,
                        mes: "Product not found",
                    });
                if (size)
                    hotproductifo.size = size;
                if (material)
                    hotproductifo.material = material;
                if (effect)
                    hotproductifo.effect = effect;
                if (rank)
                    hotproductifo.rank = rank;
                // hotproductifo.product = theProduct
                yield theRepository.save(hotproductifo);
                res.status(200).json({
                    err: 0,
                    mes: "Hot product updated successfully"
                });
            }
            catch (error) {
                res.status(500).json({ error: 'Internal server error',
                    mes: error.message });
            }
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(req.params.id);
                const userRepository = datasource_1.dataSource.getRepository(HotProduct_1.HotProduct);
                let deleter = yield userRepository.findOne({ where: { id: id } });
                if (!deleter)
                    return res.status(404).json({
                        err: 1,
                        mes: "Price not found"
                    });
                yield userRepository.remove(deleter);
                res.status(200).json({
                    err: 0,
                    mes: "Price deleted successfully"
                });
            }
            catch (error) {
                res.status(500).json({ error: 'Internal server error' });
            }
        });
    }
}
exports.default = HotProductController;
