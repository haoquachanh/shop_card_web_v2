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
const ImageSlider_1 = require("../entities/ImageSlider");
const typeorm_1 = require("typeorm");
const Image_1 = require("../entities/Image");
const remover_1 = __importDefault(require("../helper/remover"));
class ImageSliderController {
    getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const theRepository = datasource_1.dataSource.getRepository(ImageSlider_1.ImageSlider);
                const page = parseInt(req.query.page) || 1;
                const pageSize = parseInt(req.query.pageSize) || 10;
                const sortParam = req.query.sort; // Tham số để sắp xếp
                const searchKeyword = req.query.search;
                const skip = (page - 1) * pageSize;
                console.log(page, pageSize, skip, sortParam);
                const queryBuilder = yield theRepository
                    .createQueryBuilder('imageSlider')
                    .leftJoin('imageSlider.img', 'img')
                    .addSelect(['img.imgSrc'])
                    .skip(skip)
                    .take(pageSize);
                if (sortParam) {
                    const [field, order] = sortParam.split(':');
                    queryBuilder.orderBy(`imageSlider.${field}`, order);
                }
                if (searchKeyword) {
                    queryBuilder.andWhere(new typeorm_1.Brackets(qb => {
                        qb.where('LOWER(imageSlider.text) LIKE LOWER(:searchKeyword)', {
                            searchKeyword: `%${searchKeyword.toLowerCase()}%`,
                        });
                    }));
                }
                const sliders = yield queryBuilder.getMany();
                const count = yield queryBuilder.getCount();
                if (count === 0)
                    return res.status(200).json({
                        err: 1,
                        mes: "No have any textslider"
                    });
                let pageNum = Math.ceil(count / pageSize);
                if (page > pageNum)
                    return res.status(404).json({
                        err: 1,
                        mes: "Page not found"
                    });
                res.status(200).json({
                    err: 0,
                    mes: `Got ${count} sliders.`,
                    pageSize: pageSize,
                    pageNum: pageNum,
                    page: page,
                    data: sliders
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
                const theRepository = datasource_1.dataSource.getRepository(ImageSlider_1.ImageSlider);
                let slider = yield theRepository.findOne({ where: { id: id } });
                if (!slider)
                    return res.status(404).json({
                        err: 1,
                        mes: "Slider not found"
                    });
                res.status(200).json({
                    err: 0,
                    mes: "Got slider",
                    data: slider
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
                let { status, index } = req.body;
                // if (!(status&&index)) return res.status(400).json({
                if (!(status && index && req.file))
                    return res.status(400).json({
                        err: 1,
                        mes: "Missing required parameter"
                    });
                const theRepository = datasource_1.dataSource.getRepository(ImageSlider_1.ImageSlider);
                let slider = req.body;
                let newImg = new Image_1.Image();
                newImg.imgSrc = req.file.path;
                newImg = yield datasource_1.dataSource.getRepository(Image_1.Image).save(newImg);
                slider.img = newImg;
                yield theRepository.save(slider);
                res.status(200).json({
                    err: 0,
                    mes: "Slider created successfully"
                });
            }
            catch (error) {
                if (req.file) {
                    (0, remover_1.default)(req.file.path);
                    console.log("Deleted public");
                }
                res.status(500).json({ error: 'Internal server error ' + error.message });
            }
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let id = parseInt(req.params.id);
                let { status, index } = req.body;
                if (!(status || index) || !id)
                    return res.status(400).json({
                        err: 1,
                        mes: "Missing required parameter"
                    });
                const theRepository = datasource_1.dataSource.getRepository(ImageSlider_1.ImageSlider);
                let slider;
                slider = yield theRepository.findOne({ where: { id: id } });
                if (!slider)
                    return res.status(404).json({
                        err: 1,
                        mes: "Slider not found"
                    });
                if (index)
                    slider.index = index;
                if (status)
                    slider.status = status;
                // if (imgSrc) slider.img = img
                yield theRepository.save(slider);
                res.status(200).json({
                    err: 0,
                    mes: "Slider updated successfully"
                });
            }
            catch (error) {
                res.status(500).json({ error: 'Internal server error' });
            }
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(req.params.id);
                const deleter = yield datasource_1.dataSource.getRepository(ImageSlider_1.ImageSlider)
                    .createQueryBuilder('imageSlider')
                    .leftJoinAndSelect('imageSlider.img', 'img')
                    .where('imageSlider.id = :id', { id: id })
                    .getOne();
                if (!deleter)
                    return res.status(404).json({
                        err: 1,
                        mes: "Slider not found"
                    });
                (0, remover_1.default)(deleter.img.imgSrc);
                yield datasource_1.dataSource.getRepository(Image_1.Image).remove(deleter.img);
                res.status(200).json({
                    err: 0,
                    mes: "Slider deleted successfully"
                });
            }
            catch (error) {
                res.status(500).json({ error: 'Internal server error' });
            }
        });
    }
}
exports.default = ImageSliderController;
