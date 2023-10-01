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
const Cart_1 = require("../entities/Cart");
const Product_1 = require("../entities/Product");
const User_1 = require("../entities/User");
class CartController {
    getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let userId = res.locals.jwtPayload.userId;
                const theRepository = datasource_1.dataSource.getRepository(Cart_1.Cart);
                const page = parseInt(req.query.page) || 1;
                const pageSize = parseInt(req.query.pageSize) || 20;
                const sortParam = req.query.sort; // Tham số để sắp xếp
                const searchKeyword = req.query.search;
                const skip = (page - 1) * pageSize;
                const queryBuilder = yield theRepository
                    .createQueryBuilder('carts')
                    .where("carts.userId = :userId", { userId: userId })
                    .skip(skip)
                    .take(pageSize);
                if (sortParam) {
                    const [field, order] = sortParam.split(':');
                    queryBuilder.orderBy(`carts.${field}`, order);
                }
                if (searchKeyword) {
                    queryBuilder.andWhere(new typeorm_1.Brackets(qb => {
                        qb.where('LOWER(carts.question) LIKE LOWER(:searchKeyword)', {
                            searchKeyword: `%${searchKeyword.toLowerCase()}%`,
                        });
                        qb.orWhere('LOWER(carts.answer) LIKE LOWER(:searchKeyword)', {
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
                    mes: `Got ${count} carts.`,
                    pageSize: pageSize,
                    pageNum: pageNum,
                    page: page,
                    data: users
                });
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ error: 'Internal server error' });
            }
        });
    }
    get(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let userId = res.locals.jwtPayload.userId;
                let id = parseInt(req.params.id);
                if (!id)
                    return res.status(400).json({
                        err: 1,
                        mes: "Missing required parameter"
                    });
                const theRepository = datasource_1.dataSource.getRepository(Cart_1.Cart);
                let item = yield theRepository.findOne({ where: { id: id } });
                if (!item)
                    return res.status(404).json({
                        err: 1,
                        mes: "Cart item not found"
                    });
                res.status(200).json({
                    err: 0,
                    mes: "Got cart item",
                    data: item
                });
            }
            catch (error) {
                res.status(500).json({ error: 'Internal server error' });
            }
        });
    }
    create(req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let userId = ((_a = res.locals.jwtPayload) === null || _a === void 0 ? void 0 : _a.userId) || 1;
                //number 1 for test! DELETE when run!!!!!!!! and catch error
                if (!userId)
                    return res.status(500).json({
                        err: 1,
                        mes: "Missing user."
                    });
                let { size, effect, quantity, isDesigned, material, img_src, price, sides, name, productId } = req.body;
                if (!(size && effect && quantity && isDesigned && material && img_src && price && sides && name && productId))
                    return res.status(400).json({
                        err: 1,
                        mes: "Missing required parameter"
                    });
                let newCart = new Cart_1.Cart();
                let user = yield datasource_1.dataSource.getRepository(User_1.User).findOne({ where: { id: userId } });
                if (!user)
                    return res.status(404).json({
                        err: 1,
                        mes: "User not found"
                    });
                let product = yield datasource_1.dataSource.getRepository(Product_1.Product).findOne({ where: { id: productId } });
                if (!product)
                    return res.status(404).json({
                        err: 1,
                        mes: "Product not found"
                    });
                newCart.sides = sides;
                newCart.size = size;
                newCart.img_src = img_src;
                newCart.effect = effect;
                newCart.isDesigned = isDesigned;
                newCart.material = material;
                newCart.name = name;
                newCart.price = price;
                newCart.quantity = quantity;
                newCart.user = user;
                newCart.product = product;
                console.log(newCart);
                const theRepository = datasource_1.dataSource.getRepository(Cart_1.Cart);
                yield theRepository.save(newCart);
                res.status(200).json({
                    err: 0,
                    mes: "Cart created successfully"
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
                let { size, effect, quantity, isDesigned, material, img_src, price, sides, name, productId } = req.body;
                if (!(size || effect || quantity || isDesigned || material || productId || img_src || price || sides || name) || !id)
                    return res.status(400).json({
                        err: 1,
                        mes: "Missing required parameter"
                    });
                const theRepository = datasource_1.dataSource.getRepository(Cart_1.Cart);
                let updater;
                updater = yield theRepository.findOne({ where: { id: id } });
                if (!updater)
                    return res.status(404).json({
                        err: 1,
                        mes: "Cart not found",
                    });
                // let theProduct = await dataSource.getRepository(Product).findOne({where: {id:productId}})
                // if (!theProduct) return res.status(404).json({
                //     err: 1,
                //     mes: "Product not found",
                // })
                if (size)
                    updater.size = size;
                if (effect)
                    updater.effect = effect;
                if (img_src)
                    updater.img_src = img_src;
                if (material)
                    updater.material = material;
                if (price)
                    updater.price = price;
                if (name)
                    updater.name = name;
                if (sides)
                    updater.sides = sides;
                if (quantity)
                    updater.quantity = quantity;
                if (isDesigned)
                    updater.isDesigned = isDesigned;
                // updater.product = theProduct
                yield theRepository.save(updater);
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
                const theRepository = datasource_1.dataSource.getRepository(Cart_1.Cart);
                let deleter = yield theRepository.findOne({ where: { id: id } });
                if (!deleter)
                    return res.status(404).json({
                        err: 1,
                        mes: "Cart not found"
                    });
                yield theRepository.remove(deleter);
                res.status(200).json({
                    err: 0,
                    mes: "Cart deleted successfully"
                });
            }
            catch (error) {
                res.status(500).json({ error: 'Internal server error' });
            }
        });
    }
}
exports.default = CartController;
