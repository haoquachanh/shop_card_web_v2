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
const Contact_1 = require("../entities/Contact");
class ContactController {
    getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const theRepository = datasource_1.dataSource.getRepository(Contact_1.Contact);
                const page = parseInt(req.query.page) || 1;
                const pageSize = parseInt(req.query.pageSize) || 10;
                const roleParam = req.query.roleParam; // Tham số để lọc theo loại
                const sortParam = req.query.sort; // Tham số để sắp xếp
                const searchKeyword = req.query.search;
                const skip = (page - 1) * pageSize;
                console.log(page, pageSize, skip, sortParam);
                const queryBuilder = yield theRepository
                    .createQueryBuilder('contacts')
                    .skip(skip)
                    .take(pageSize);
                if (sortParam) {
                    const [field, order] = sortParam.split(':');
                    queryBuilder.orderBy(`contacts.${field}`, order);
                }
                const users = yield queryBuilder.getMany();
                const count = yield queryBuilder.getCount();
                if (count === 0)
                    return res.status(200).json({
                        err: 1,
                        mes: "No have any contact information"
                    });
                let pageNum = Math.ceil(count / pageSize);
                if (page > pageNum)
                    return res.status(404).json({
                        err: 1,
                        mes: "Page not found"
                    });
                res.status(200).json({
                    err: 0,
                    mes: `Got ${count} contacts.`,
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
                const theRepository = datasource_1.dataSource.getRepository(Contact_1.Contact);
                let contact = yield theRepository.findOne({ where: { id: id } });
                if (!contact)
                    return res.status(404).json({
                        err: 1,
                        mes: "Contact not found"
                    });
                res.status(200).json({
                    err: 0,
                    mes: "Got contact",
                    data: contact
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
                let { title, link, index, name, theme } = req.body;
                if (!(title && link && index && name && theme))
                    return res.status(400).json({
                        err: 1,
                        mes: "Missing required parameter"
                    });
                const theRepository = datasource_1.dataSource.getRepository(Contact_1.Contact);
                let contact = req.body;
                yield theRepository.save(contact);
                res.status(200).json({
                    err: 0,
                    mes: "Contact created successfully"
                });
            }
            catch (error) {
                res.status(500).json({ error: 'Internal server error' });
            }
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let id = parseInt(req.params.id);
                let { title, status, index, link, theme, name } = req.body;
                if (!(title || status || index || link || theme || name) || !id)
                    return res.status(400).json({
                        err: 1,
                        mes: "Missing required parameter"
                    });
                const theRepository = datasource_1.dataSource.getRepository(Contact_1.Contact);
                let contact;
                contact = yield theRepository.findOne({ where: { id: id } });
                if (!contact)
                    return res.status(404).json({
                        err: 1,
                        mes: "Contact not found",
                    });
                if (index)
                    contact.index = index;
                if (theme)
                    contact.theme = theme;
                if (title)
                    contact.title = title;
                if (link)
                    contact.link = link;
                if (name)
                    contact.name = name;
                if (status)
                    contact.status = status;
                yield theRepository.save(contact);
                res.status(200).json({
                    err: 0,
                    mes: "Contact updated successfully"
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
                const userRepository = datasource_1.dataSource.getRepository(Contact_1.Contact);
                let deleter = yield userRepository.findOne({ where: { id: id } });
                if (!deleter)
                    return res.status(404).json({
                        err: 1,
                        mes: "Contact not found"
                    });
                yield userRepository.remove(deleter);
                res.status(200).json({
                    err: 0,
                    mes: "Contact deleted successfully"
                });
            }
            catch (error) {
                res.status(500).json({ error: 'Internal server error' });
            }
        });
    }
}
exports.default = ContactController;
