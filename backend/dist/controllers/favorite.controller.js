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
const Favorite_entity_1 = require("../entities/Favorite.entity");
const User_entity_1 = require("../entities/User.entity");
// import { connectToDatabase } from '../connection';
const datasource_1 = require("../datasource");
class FavoriteController {
    getAllFavorites(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(req.query);
                const favoriteRepository = datasource_1.dataSource.getRepository(Favorite_entity_1.Favorite);
                console.log(favoriteRepository);
                const page = parseInt(req.query.page) || 1;
                const pageSize = parseInt(req.query.pageSize) || 10;
                const type = req.query.type; // Tham số để lọc theo loại
                const sortParam = req.query.sort; // Tham số để sắp xếp
                const skip = (page - 1) * pageSize;
                console.log(page, pageSize, skip, sortParam);
                const queryBuilder = yield favoriteRepository
                    .createQueryBuilder('favorite')
                    .leftJoinAndSelect('favorite.image', 'favoriteimage')
                    .skip(skip)
                    .take(pageSize);
                if (type) {
                    queryBuilder.where('favorite.type = :type', { type });
                }
                if (sortParam) {
                    const [field, order] = sortParam.split(':');
                    queryBuilder.orderBy(`favorite.${field}`, order);
                }
                const favorites = yield queryBuilder.getMany();
                res.status(200).json({
                    err: 0,
                    mes: favorites.length > 0 ? "Got all favorites." : "No have any favorites.",
                    pageSize: pageSize,
                    data: favorites
                });
            }
            catch (error) {
                res.status(500).json({
                    err: -1,
                    mes: "Iternal Error: " + error.message,
                });
            }
        });
    }
    getFavoriteById(req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let id = parseInt((_a = req.params) === null || _a === void 0 ? void 0 : _a.id);
                const userRepository = datasource_1.dataSource.getRepository(User_entity_1.User);
                // Tìm người dùng theo ID
                const user = yield userRepository.findOne({ where: { id } });
                if (user) {
                    yield userRepository
                        .createQueryBuilder('user')
                        .relation(User_entity_1.User, 'favorites')
                        .of(user)
                        .loadMany();
                    console.log(user.favorites);
                }
                res.status(200).json({
                    err: 0,
                    mes: "Got ",
                    data: user.favorites
                });
                // const favorites = await favoriteRepository.find({
                //   where: { users: user },
                //   relations: ['card'], 
                // });
            }
            catch (error) {
                console.log(error.message);
                res.status(500).json({ error: 'Internal server error' });
            }
        });
    }
    createFavorite(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const favoriteRepository = datasource_1.dataSource.getRepository(Favorite_entity_1.Favorite);
                yield favoriteRepository.save({});
                res.status(201).json({
                    err: 0,
                    mes: 'Created successfully',
                });
            }
            catch (error) {
                console.error('Lỗi khi tạo lá bài:', error);
                res.status(500).json({ error: 'Internal server error' });
            }
        });
    }
    updateFavorite(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
            }
            catch (error) {
                res.status(500).json({ error: 'Internal server error' });
            }
        });
    }
    deleteFavorite(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
            }
            catch (error) {
                res.status(500).json({ error: 'Internal server error' });
            }
        });
    }
}
exports.default = FavoriteController;
