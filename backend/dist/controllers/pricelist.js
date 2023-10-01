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
const typeorm_1 = require("typeorm");
const Pricelist_1 = require("../entities/Pricelist");
const Product_1 = require("../entities/Product");
class PriceListController {
    getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const theRepository = datasource_1.dataSource.getRepository(Pricelist_1.PriceList);
                const page = parseInt(req.query.page) || 1;
                const pageSize = parseInt(req.query.pageSize) || 10;
                const roleParam = req.query.roleParam; // Tham số để lọc theo loại
                const sortParam = req.query.sort; // Tham số để sắp xếp
                const searchKeyword = req.query.search;
                const skip = (page - 1) * pageSize;
                console.log(page, pageSize, skip, sortParam);
                const queryBuilder = yield theRepository
                    .createQueryBuilder('pricelists')
                    .skip(skip)
                    .take(pageSize);
                if (sortParam) {
                    const [field, order] = sortParam.split(':');
                    queryBuilder.orderBy(`pricelists.${field}`, order);
                }
                if (searchKeyword) {
                    queryBuilder.andWhere(new typeorm_1.Brackets(qb => {
                        qb.where('LOWER(pricelists.question) LIKE LOWER(:searchKeyword)', {
                            searchKeyword: `%${searchKeyword.toLowerCase()}%`,
                        });
                        qb.orWhere('LOWER(pricelists.answer) LIKE LOWER(:searchKeyword)', {
                            searchKeyword: `%${searchKeyword.toLowerCase()}%`,
                        });
                    }));
                }
                const users = yield queryBuilder.getMany();
                const count = yield queryBuilder.getCount();
                if (count === 0)
                    return res.status(200).json({
                        err: 1,
                        mes: "No have any prices"
                    });
                let pageNum = Math.ceil(count / pageSize);
                if (page > pageNum)
                    return res.status(404).json({
                        err: 1,
                        mes: "Page not found"
                    });
                res.status(200).json({
                    err: 0,
                    mes: `Got ${count} pricelists.`,
                    pageSize: pageSize,
                    pageNum: pageNum,
                    page: page,
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
                const theRepository = datasource_1.dataSource.getRepository(Pricelist_1.PriceList);
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
                let { size, value, lim1, lim2, material, productId } = req.body;
                if (!(size && value && lim1 && lim2 && material && productId))
                    return res.status(400).json({
                        err: 1,
                        mes: "Missing required parameter"
                    });
                let theProduct = yield datasource_1.dataSource.getRepository(Product_1.Product).findOne({ where: { id: productId } });
                console.log(theProduct);
                const theRepository = datasource_1.dataSource.getRepository(Pricelist_1.PriceList);
                let newPrice = Object.assign(Object.assign({}, req.body), { product: theProduct });
                yield theRepository.save(newPrice);
                res.status(200).json({
                    err: 0,
                    mes: "Slider created successfully"
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
                let { size, value, lim1, lim2, material, productId } = req.body;
                if (!(size || value || lim1 || lim2 || material || productId) || !id)
                    return res.status(400).json({
                        err: 1,
                        mes: "Missing required parameter"
                    });
                const theRepository = datasource_1.dataSource.getRepository(Pricelist_1.PriceList);
                let priceifo;
                priceifo = yield theRepository.findOne({ where: { id: id } });
                if (!priceifo)
                    return res.status(404).json({
                        err: 1,
                        mes: "PriceList not found",
                    });
                let theProduct = yield datasource_1.dataSource.getRepository(Product_1.Product).findOne({ where: { id: productId } });
                if (!theProduct)
                    return res.status(404).json({
                        err: 1,
                        mes: "Product not found",
                    });
                if (size)
                    priceifo.size = size;
                if (lim1)
                    priceifo.lim1 = lim1;
                if (lim2)
                    priceifo.lim2 = lim2;
                if (material)
                    priceifo.material = material;
                if (value)
                    priceifo.value = value;
                // priceifo.product = theProduct
                yield theRepository.save(priceifo);
                res.status(200).json({
                    err: 0,
                    mes: "Slider updated successfully"
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
                const userRepository = datasource_1.dataSource.getRepository(Pricelist_1.PriceList);
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
exports.default = PriceListController;
