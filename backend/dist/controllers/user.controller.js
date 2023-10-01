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
const User_entity_1 = require("../entities/User.entity");
const datasource_1 = require("../datasource");
const Favorite_entity_1 = require("../entities/Favorite.entity");
class UserController {
    getAllUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userRepository = datasource_1.dataSource.getRepository(User_entity_1.User);
                const users = yield userRepository
                    .createQueryBuilder('user')
                    .leftJoinAndSelect('user.role', 'role')
                    .getMany();
                res.status(200).json({
                    err: 0,
                    mes: users.length > 0 ? "Got all users." : "No have any users.",
                    data: users
                });
            }
            catch (error) {
                console.log(error);
                res.status(500).json({
                    err: -1,
                    mes: "Iternal Error",
                });
            }
        });
    }
    getUserById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
            }
            catch (error) {
                res.status(500).json({ error: 'Internal server error' });
            }
        });
    }
    createUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { username, password, email, fullname, avt } = req.body;
                if (!(username && password && email && fullname && avt))
                    res.status(400).send();
                let user = new User_entity_1.User(username, password, fullname, email, avt);
                const userRepository = datasource_1.dataSource.getRepository(User_entity_1.User);
                let check;
                check = yield userRepository.findOneOrFail(username);
                if (check.username)
                    return res.status(200).json();
                yield datasource_1.dataSource.createQueryBuilder()
                    .insert()
                    .into(User_entity_1.User)
                    .values(user)
                    .execute();
            }
            catch (error) {
                return res.status(500).json({});
            }
        });
    }
    updateUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
            }
            catch (error) {
                res.status(500).json({ error: 'Internal server error' });
            }
        });
    }
    deleteUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
            }
            catch (error) {
                res.status(500).json({ error: 'Internal server error' });
            }
        });
    }
    getFavorite(req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt((_a = req.params) === null || _a === void 0 ? void 0 : _a.id);
                let userRepository = datasource_1.dataSource.getRepository(User_entity_1.User);
                let favoriteRepository = datasource_1.dataSource.getRepository(Favorite_entity_1.Favorite);
                let user = yield userRepository.findOneOrFail({ where: { id: id },
                    relations: ['favorites'] });
                res.status(200).json({
                    err: 0,
                    mes: "ok",
                    data: user
                });
            }
            catch (error) {
                console.log(error.message);
                res.status(500).json({ error: 'Internal server error' });
            }
        });
    }
}
exports.default = UserController;
