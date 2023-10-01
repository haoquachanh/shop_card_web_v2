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
const Order_1 = require("../entities/Order");
const Product_1 = require("../entities/Product");
const User_1 = require("../entities/User");
const generaterCode_1 = __importDefault(require("../helper/generaterCode"));
const OrderItem_1 = require("../entities/OrderItem");
class OrderController {
    getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const theRepository = datasource_1.dataSource.getRepository(Order_1.Order);
                const sortParam = req.query.sort; // Tham số để sắp xếp
                const queryBuilder = yield theRepository
                    .createQueryBuilder('orders');
                if (sortParam) {
                    const [field, order] = sortParam.split(':');
                    queryBuilder.orderBy(`orders.${field}`, order);
                }
                const orders = yield queryBuilder.getMany();
                const count = yield queryBuilder.getCount();
                if (count === 0)
                    return res.status(200).json({
                        err: 1,
                        mes: "No have any prices"
                    });
                res.status(200).json({
                    err: 0,
                    mes: `Got ${count} orders.`,
                    data: orders
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
                const theRepository = datasource_1.dataSource.getRepository(Order_1.Order);
                let theOrder = yield theRepository.findOne({ where: { id: id }, relations: { items: true } });
                if (!theOrder)
                    return res.status(404).json({
                        err: 1,
                        mes: "Order not found"
                    });
                res.status(200).json({
                    err: 0,
                    mes: "Got order",
                    data: theOrder
                });
            }
            catch (error) {
                res.status(500).json({ error: 'Internal server error', mes: error.message });
            }
        });
    }
    create(req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let userId = ((_a = res.locals.jwtPayload) === null || _a === void 0 ? void 0 : _a.userId) || 16;
                //number 1 for test! DELETE when run!!!!!!!! and catch error
                if (!userId)
                    return res.status(500).json({
                        err: 1,
                        mes: "Missing user."
                    });
                const items = req.body.items;
                let { status, address, phone, nameReceive } = req.body;
                if (!(status && address && phone && nameReceive && items))
                    return res.status(400).json({
                        err: 1,
                        mes: "Missing required parameter"
                    });
                let user = yield datasource_1.dataSource.getRepository(User_1.User).findOne({ where: { id: userId } });
                if (!user)
                    return res.status(404).json({
                        err: 1,
                        mes: "User not found"
                    });
                let newOrder = new Order_1.Order();
                newOrder.orderCode = (0, generaterCode_1.default)();
                newOrder.user = user;
                newOrder.nameReceive = nameReceive;
                newOrder.address = address;
                newOrder.phone = phone;
                newOrder.status = status;
                newOrder.items = [];
                const theRepository = datasource_1.dataSource.getRepository(Order_1.Order);
                newOrder = yield theRepository.save(newOrder);
                // for (const obj of items) {
                for (let i = 0; i < items.length; i++) {
                    let newItem = new OrderItem_1.OrderItem();
                    newItem = items[i];
                    newItem.order = newOrder;
                    // console.log(">>>>>product index: ",req.body.items[i].product)
                    let product = yield datasource_1.dataSource.getRepository(Product_1.Product).findOne({ where: { id: parseInt(req.body.items[i].product) } });
                    newItem.product = product;
                    newItem = yield datasource_1.dataSource.getRepository(OrderItem_1.OrderItem).save(newItem);
                    newOrder.items.push(newItem);
                }
                // let product = await dataSource.getRepository(Product).findOne({where:{id: 1}})
                // if (!product) return res.status(404).json({
                //     err: 1,
                //     mes: "Product not found"
                // })
                // newOrder.sides = sides
                // newOrder.size = size
                // newOrder.img_src = img_src
                // newOrder.effect = effect
                // newOrder.isDesigned = isDesigned
                // newOrder.material = material
                // newOrder.name = name
                // newOrder.price = price
                // newOrder.quantity = quantity 
                // newOrder.user=user
                // newOrder.product=product
                res.status(200).json({
                    err: 0,
                    mes: "Order created successfully"
                });
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ error: 'Internal server error' + error.message });
            }
        });
    }
    updateItem(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let id = parseInt(req.params.id);
                let { name, sides, img_src, isDesigned, quantity, material, effect, size } = req.body;
                if (!(name || sides || img_src || isDesigned || quantity || material || effect || size))
                    return res.status(400).json({
                        err: 1,
                        mes: "Missing required parameter"
                    });
                const theRepository = datasource_1.dataSource.getRepository(OrderItem_1.OrderItem);
                let updater;
                updater = yield theRepository.findOne({ where: { id: id } });
                if (!updater)
                    return res.status(404).json({
                        err: 1,
                        mes: "Order item not found",
                    });
                // let theProduct = await dataSource.getRepository(Product).findOne({where: {id:productId}})
                // if (!theProduct) return res.status(404).json({
                //     err: 1,
                //     mes: "Product not found",
                // })
                if (name)
                    updater.name = name;
                if (sides)
                    updater.sides = sides;
                if (img_src)
                    updater.img_src = img_src;
                if (quantity)
                    updater.quantity = parseInt(quantity);
                if (isDesigned)
                    updater.isDesigned = isDesigned;
                if (material)
                    updater.material = material;
                if (effect)
                    updater.effect = effect;
                if (size)
                    updater.size = size;
                console.log(updater);
                yield theRepository.save(updater);
                res.status(200).json({
                    err: 0,
                    mes: "Order item updated successfully"
                });
            }
            catch (error) {
                res.status(500).json({ error: 'Internal server error',
                    mes: error.message });
            }
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let id = parseInt(req.params.id);
                let { status, address, phone, nameReceive } = req.body;
                if (!(status || address || phone || nameReceive))
                    return res.status(400).json({
                        err: 1,
                        mes: "Missing required parameter"
                    });
                const theRepository = datasource_1.dataSource.getRepository(Order_1.Order);
                let updater;
                updater = yield theRepository.findOne({ where: { id: id } });
                if (!updater)
                    return res.status(404).json({
                        err: 1,
                        mes: "Order not found",
                    });
                // let theProduct = await dataSource.getRepository(Product).findOne({where: {id:productId}})
                // if (!theProduct) return res.status(404).json({
                //     err: 1,
                //     mes: "Product not found",
                // })
                if (status)
                    updater.status = status;
                if (address)
                    updater.address = address;
                if (phone)
                    updater.phone = phone;
                if (nameReceive)
                    updater.nameReceive = nameReceive;
                yield theRepository.save(updater);
                res.status(200).json({
                    err: 0,
                    mes: "Order updated successfully"
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
                const theRepository = datasource_1.dataSource.getRepository(Order_1.Order);
                let deleter = yield theRepository
                    .createQueryBuilder('orders')
                    .leftJoinAndSelect('orders.items', 'items')
                    .where('orders.id = :id', { id: id })
                    .getOne();
                if (!deleter)
                    return res.status(404).json({
                        err: 1,
                        mes: "Order not found"
                    });
                for (let i = 0; i < deleter.items.length; i++)
                    yield datasource_1.dataSource.getRepository(OrderItem_1.OrderItem).remove(deleter.items[i]);
                yield theRepository.remove(deleter);
                res.status(200).json({
                    err: 0,
                    mes: "Order deleted successfully"
                });
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ error: 'Internal server error' });
            }
        });
    }
    deleteItem(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(req.params.id);
                const theRepository = datasource_1.dataSource.getRepository(OrderItem_1.OrderItem);
                let deleter = yield theRepository.findOne({ where: { id: id } });
                if (!deleter)
                    return res.status(404).json({
                        err: 1,
                        mes: "Order item not found"
                    });
                yield theRepository.remove(deleter);
                res.status(200).json({
                    err: 0,
                    mes: "Order item deleted successfully"
                });
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ error: 'Internal server error' });
            }
        });
    }
}
exports.default = OrderController;
