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
const User_1 = require("../entities/User");
class UserController {
    getAllUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userRepository = datasource_1.dataSource.getRepository(User_1.User);
                const page = parseInt(req.query.page) || 1;
                const pageSize = parseInt(req.query.pageSize) || 10;
                const roleParam = req.query.roleParam; // Tham số để lọc theo loại
                const sortParam = req.query.sort; // Tham số để sắp xếp
                const searchKeyword = req.query.search;
                const skip = (page - 1) * pageSize;
                console.log(page, pageSize, skip, sortParam);
                const queryBuilder = yield userRepository
                    .createQueryBuilder('users')
                    .leftJoinAndSelect('users.role', 'role')
                    .skip(skip)
                    .take(pageSize);
                if (roleParam) {
                    queryBuilder.where('users.role = :roleParam', { roleParam });
                }
                if (sortParam) {
                    const [field, order] = sortParam.split(':');
                    queryBuilder.orderBy(`users.${field}`, order);
                }
                if (searchKeyword) {
                    queryBuilder.andWhere(new typeorm_1.Brackets(qb => {
                        qb.where('LOWER(users.username) LIKE LOWER(:searchKeyword)', {
                            searchKeyword: `%${searchKeyword.toLowerCase()}%`,
                        });
                        qb.orWhere('LOWER(users.fullname) LIKE LOWER(:searchKeyword)', {
                            searchKeyword: `%${searchKeyword.toLowerCase()}%`,
                        });
                        qb.orWhere('LOWER(users.email) LIKE LOWER(:searchKeyword)', {
                            searchKeyword: `%${searchKeyword.toLowerCase()}%`,
                        });
                    }));
                }
                const users = yield queryBuilder.getMany();
                const count = yield queryBuilder.getCount();
                if (count === 0)
                    return res.status(200).json({
                        err: 1,
                        mes: "No have any users"
                    });
                let pageNum = Math.ceil(count / pageSize);
                if (page > pageNum)
                    return res.status(404).json({
                        err: 1,
                        mes: "Page not found"
                    });
                res.status(200).json({
                    err: 0,
                    mes: `Got ${count} users.`,
                    pageSize: pageSize,
                    pageNum: pageNum,
                    page: page,
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
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let id = parseInt((_a = req.params) === null || _a === void 0 ? void 0 : _a.id);
                const userRepository = datasource_1.dataSource.getRepository(User_1.User);
                // Tìm người dùng theo ID
                const user = yield userRepository.findOne({ where: { id } });
                // if (user) {
                //   await userRepository
                //     .createQueryBuilder('user')
                //     .relation(User, 'users')
                //     .of(user)
                //     .loadMany();
                //   // console.log(user.users);
                // }
                res.status(200).json({
                    err: 0,
                    mes: "Got user.",
                    data: user
                });
                // const users = await userRepository.find({
                //   where: { users: user },
                //   relations: ['card'], 
                // });
            }
            catch (error) {
                console.log(error.message);
                res.status(500).json({ error: 'Internal server error.' });
            }
        });
    }
    createUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { password, email, fullname } = req.body;
                if (!(email && password))
                    return res.status(400).json({
                        err: 1,
                        mes: "Missing email or password"
                    });
                const userRepository = datasource_1.dataSource.getRepository(User_1.User);
                let existed = yield userRepository.findOne({ where: { email: email } });
                if (existed)
                    return res.status(409).json({
                        err: 1,
                        mes: "Email already exists"
                    });
                let newUser = new User_1.User(password, fullname, email);
                yield userRepository.save(newUser);
                res.status(201).json({
                    err: 0,
                    mes: 'User created successfully',
                });
            }
            catch (error) {
                res.status(500).json({ error: 'Internal server error:' + error.message });
            }
        });
    }
    updateUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { email, fullname, phone, birth } = req.body;
                if (!(email || phone || fullname || birth))
                    return res.status(400).json({
                        err: 1,
                        mes: "Did not get any information."
                    });
                const userRepository = datasource_1.dataSource.getRepository(User_1.User);
                let updateUser = yield userRepository.findOne({ where: { email: email } });
                if (!updateUser)
                    return res.status(404).json({
                        err: 1,
                        mes: "User not found"
                    });
                if (email)
                    updateUser.email = req.body.email;
                if (fullname)
                    updateUser.fullname = req.body.fullname;
                if (birth)
                    updateUser.birth = req.body.birth;
                if (phone)
                    updateUser.phone = req.body.phone;
                yield userRepository.save(updateUser);
                res.status(200).json({
                    err: 0,
                    mes: 'User updated successfully',
                });
            }
            catch (error) {
                res.status(500).json({ error: 'Internal server error:' + error.message });
            }
        });
    }
    deleteUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(req.params.id);
                const userRepository = datasource_1.dataSource.getRepository(User_1.User);
                let deleteUser = yield userRepository.findOne({ where: { id: id } });
                if (!deleteUser)
                    return res.status(404).json({
                        err: 1,
                        mes: "User not found"
                    });
                yield userRepository.remove(deleteUser);
                res.status(200).json({
                    err: 0,
                    mes: "User deleted successfully"
                });
            }
            catch (error) {
                res.status(500).json({ error: 'Internal server error' });
            }
        });
    }
}
exports.default = UserController;
