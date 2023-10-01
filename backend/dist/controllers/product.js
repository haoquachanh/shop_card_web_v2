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
const typeorm_1 = require("typeorm");
const Image_1 = require("../entities/Image");
const remover_1 = __importDefault(require("../helper/remover"));
class ProductController {
    getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const theRepository = datasource_1.dataSource.getRepository(Product_1.Product);
                const only = req.query.only;
                const page = parseInt(req.query.page);
                const pageSize = parseInt(req.query.pageSize);
                const filter = req.query.filter; // Tham số để lọc theo loại
                const sortParam = req.query.sort; // Tham số để sắp xếp
                const searchKeyword = req.query.search;
                const skip = (page - 1) * pageSize;
                console.log(page, pageSize, skip, sortParam);
                const queryBuilder = yield theRepository
                    .createQueryBuilder('products')
                    .leftJoin('products.avt', 'avt')
                    .leftJoin('products.avt_hover', 'avt_hover')
                    .addSelect('avt.imgSrc')
                    .addSelect('avt_hover.imgSrc');
                if (page && pageSize)
                    queryBuilder
                        .skip(skip)
                        .take(pageSize);
                if (only)
                    queryBuilder.select(`products.${only}`);
                if (filter) {
                    let filters = filter.split(',');
                    filters.forEach((i) => {
                        const [field, value] = i.split(':');
                        queryBuilder.where(`products.${field} = :value`, { value });
                    });
                }
                if (sortParam) {
                    const [field, order] = sortParam.split(':');
                    queryBuilder.orderBy(`products.${field}`, order);
                }
                if (searchKeyword) {
                    queryBuilder.andWhere(new typeorm_1.Brackets(qb => {
                        qb.where('LOWER(products.category) LIKE LOWER(:searchKeyword)', {
                            searchKeyword: `%${searchKeyword.toLowerCase()}%`,
                        });
                        qb.where('LOWER(products.name) LIKE LOWER(:searchKeyword)', {
                            searchKeyword: `%${searchKeyword.toLowerCase()}%`,
                        });
                        qb.where('LOWER(products.effect) LIKE LOWER(:searchKeyword)', {
                            searchKeyword: `%${searchKeyword.toLowerCase()}%`,
                        });
                        qb.where('LOWER(products.material) LIKE LOWER(:searchKeyword)', {
                            searchKeyword: `%${searchKeyword.toLowerCase()}%`,
                        });
                        qb.where('LOWER(products.cut) LIKE LOWER(:searchKeyword)', {
                            searchKeyword: `%${searchKeyword.toLowerCase()}%`,
                        });
                    }));
                }
                const products = yield queryBuilder.getMany();
                const count = yield queryBuilder.getCount();
                if (count === 0)
                    return res.status(200).json({
                        err: 1,
                        mes: "No have any textproduct"
                    });
                if (page && pageSize) {
                    let pageNum = Math.ceil(count / pageSize);
                    if (page > pageNum)
                        return res.status(404).json({
                            err: 1,
                            mes: "Page not found"
                        });
                    res.status(200).json({
                        err: 0,
                        mes: `Got ${count} products.`,
                        pageSize: pageSize,
                        pageNum: pageNum,
                        page: page,
                        data: products
                    });
                }
                res.status(200).json({
                    err: 0,
                    mes: `Got ${count} products.`,
                    data: products
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
                const theRepository = datasource_1.dataSource.getRepository(Product_1.Product);
                let product = yield theRepository.findOne({ where: { id: id } });
                console.log(product);
                product.seen++;
                console.log(">>>", product);
                yield theRepository.save(product);
                if (!product)
                    return res.status(404).json({
                        err: 1,
                        mes: "Product not found"
                    });
                res.status(200).json({
                    err: 0,
                    mes: "Got product",
                    data: product
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
                let { status, video, name, name2, color, colorsys, sides, size, pritech, cut, time, category, material, effect } = req.body;
                let price = parseInt(req.body.price);
                let seen = parseInt(req.body.seen);
                // if (!(status&)) return res.status(400).json({
                //price is non required
                // if (!(status&&video&&name&&name2&&color&&colorsys&&sides&&size&&seen&&pritech&&cut&&time&&category&&material&&effect&&req.files)) return res.status(400).json({
                //     err: 1,
                //     mes: "Missing required parameter"
                // }) 
                const theRepository = datasource_1.dataSource.getRepository(Product_1.Product);
                let newProduct = new Product_1.Product();
                if (category)
                    newProduct.category = category;
                if (status)
                    newProduct.status = status;
                if (video)
                    newProduct.video = video;
                if (name)
                    newProduct.name = name;
                if (name2)
                    newProduct.name2 = name2;
                if (color)
                    newProduct.color = color;
                if (colorsys)
                    newProduct.colorsys = colorsys;
                if (sides)
                    newProduct.sides = sides;
                if (size)
                    newProduct.size = size;
                if (pritech)
                    newProduct.pritech = pritech;
                if (cut)
                    newProduct.cut = cut;
                if (time)
                    newProduct.time = time;
                if (category)
                    newProduct.category = category;
                if (material)
                    newProduct.material = material;
                if (effect)
                    newProduct.effect = effect;
                if (seen)
                    newProduct.seen = parseInt(req.body.seen);
                // newProduct.price = req.body.price
                newProduct.createdAt = new Date();
                newProduct.updatedAt = new Date();
                let newAvt = new Image_1.Image();
                let newAvtHover = new Image_1.Image();
                if (req.files["avt"][0].path)
                    newAvt.imgSrc = req.files["avt"][0].path;
                if (req.files["avt_hover"][0].path)
                    newAvtHover.imgSrc = req.files["avt_hover"][0].path;
                newAvtHover = yield datasource_1.dataSource.getRepository(Image_1.Image).save(newAvtHover);
                newAvt = yield datasource_1.dataSource.getRepository(Image_1.Image).save(newAvt);
                newProduct.avt = newAvt;
                newProduct.avt_hover = newAvtHover;
                yield theRepository.save(newProduct);
                res.status(200).json({
                    err: 0,
                    mes: "Product created successfully"
                });
            }
            catch (error) {
                console.log(error);
                if (req.files) {
                    if (req.files["avt"][0].path)
                        (0, remover_1.default)(req.files["avt"][0].path);
                    if (req.files["avt_hover"][0].path)
                        (0, remover_1.default)(req.files["avt_hover"][0].path);
                    console.log("Deleted img on public");
                }
                res.status(500).json({ error: 'Internal server error ' + error.message });
            }
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let id = parseInt(req.params.id);
                let { status, video, name, name2, color, colorsys, sides, size, pritech, cut, time, category, material, effect } = req.body;
                let price = parseInt(req.body.price);
                let seen = parseInt(req.body.seen);
                // if (!(status&)) return res.status(400).json({
                if (!(status || video || name || name2 || color || colorsys || sides || size || seen || price || pritech || cut || time || category || material || effect))
                    return res.status(400).json({
                        err: 1,
                        mes: "Missing required parameter"
                    });
                const theRepository = datasource_1.dataSource.getRepository(Product_1.Product);
                let product = yield theRepository.findOne({ where: { id: id } });
                if (!product)
                    return res.status(404).json({
                        err: 1,
                        mes: "Product not found"
                    });
                if (category)
                    product.category = category;
                if (status)
                    product.status = status;
                if (video)
                    product.video = video;
                if (name)
                    product.name = name;
                if (name2)
                    product.name2 = name2;
                if (color)
                    product.color = color;
                if (colorsys)
                    product.colorsys = colorsys;
                if (sides)
                    product.sides = sides;
                if (size)
                    product.size = size;
                if (pritech)
                    product.pritech = pritech;
                if (cut)
                    product.cut = cut;
                if (time)
                    product.time = time;
                if (category)
                    product.category = category;
                if (material)
                    product.material = material;
                if (effect)
                    product.effect = effect;
                if (seen)
                    product.seen = parseInt(req.body.seen);
                if (price)
                    product.price = parseInt(req.body.price);
                yield theRepository.save(product);
                res.status(200).json({
                    err: 0,
                    mes: "Product updated successfully"
                });
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ error: 'Internal server error' });
            }
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(req.params.id);
                const deleter = yield datasource_1.dataSource.getRepository(Product_1.Product)
                    .createQueryBuilder('products')
                    .leftJoinAndSelect('products.avt', 'avt')
                    .leftJoinAndSelect('products.avt_hover', 'avt_hover')
                    // .leftJoinAndSelect('products.imgs', 'img')
                    .where('products.id = :id', { id: id })
                    .getOne();
                if (!deleter)
                    return res.status(404).json({
                        err: 1,
                        mes: "Product not found"
                    });
                console.log(deleter);
                (0, remover_1.default)(deleter.avt.imgSrc);
                (0, remover_1.default)(deleter.avt_hover.imgSrc);
                yield datasource_1.dataSource.getRepository(Product_1.Product).remove(deleter);
                yield datasource_1.dataSource.getRepository(Image_1.Image).remove(deleter.avt);
                yield datasource_1.dataSource.getRepository(Image_1.Image).remove(deleter.avt_hover);
                res.status(200).json({
                    err: 0,
                    mes: "Product deleted successfully"
                });
            }
            catch (error) {
                res.status(500).json({ error: 'Internal server error' });
            }
        });
    }
}
exports.default = ProductController;
