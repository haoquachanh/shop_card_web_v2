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
const Question_1 = require("../entities/Question");
class QuestionController {
    getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const theRepository = datasource_1.dataSource.getRepository(Question_1.Question);
                const page = parseInt(req.query.page) || 1;
                const pageSize = parseInt(req.query.pageSize) || 10;
                const roleParam = req.query.roleParam; // Tham số để lọc theo loại
                const sortParam = req.query.sort; // Tham số để sắp xếp
                const searchKeyword = req.query.search;
                const skip = (page - 1) * pageSize;
                console.log(page, pageSize, skip, sortParam);
                const queryBuilder = yield theRepository
                    .createQueryBuilder('questions')
                    .skip(skip)
                    .take(pageSize);
                if (sortParam) {
                    const [field, order] = sortParam.split(':');
                    queryBuilder.orderBy(`questions.${field}`, order);
                }
                if (searchKeyword) {
                    queryBuilder.andWhere(new typeorm_1.Brackets(qb => {
                        qb.where('LOWER(questions.question) LIKE LOWER(:searchKeyword)', {
                            searchKeyword: `%${searchKeyword.toLowerCase()}%`,
                        });
                        qb.orWhere('LOWER(questions.answer) LIKE LOWER(:searchKeyword)', {
                            searchKeyword: `%${searchKeyword.toLowerCase()}%`,
                        });
                    }));
                }
                const users = yield queryBuilder.getMany();
                const count = yield queryBuilder.getCount();
                if (count === 0)
                    return res.status(200).json({
                        err: 1,
                        mes: "No have any question"
                    });
                let pageNum = Math.ceil(count / pageSize);
                if (page > pageNum)
                    return res.status(404).json({
                        err: 1,
                        mes: "Page not found"
                    });
                res.status(200).json({
                    err: 0,
                    mes: `Got ${count} questions.`,
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
                const theRepository = datasource_1.dataSource.getRepository(Question_1.Question);
                let question = yield theRepository.findOne({ where: { id: id } });
                if (!question)
                    return res.status(404).json({
                        err: 1,
                        mes: "Slider not found"
                    });
                res.status(200).json({
                    err: 0,
                    mes: "Got question",
                    data: question
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
                let { img, question, answer } = req.body;
                if (!(img && question && answer))
                    return res.status(400).json({
                        err: 1,
                        mes: "Missing required parameter"
                    });
                const theRepository = datasource_1.dataSource.getRepository(Question_1.Question);
                let thequestion = req.body;
                yield theRepository.save(thequestion);
                res.status(200).json({
                    err: 0,
                    mes: "Slider created successfully"
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
                let { img, question, answer } = req.body;
                if (!(img || question || answer) || !id)
                    return res.status(400).json({
                        err: 1,
                        mes: "Missing required parameter"
                    });
                const theRepository = datasource_1.dataSource.getRepository(Question_1.Question);
                let thequestion;
                thequestion = yield theRepository.findOne({ where: { id: id } });
                if (!thequestion)
                    return res.status(404).json({
                        err: 1,
                        mes: "Question not found",
                    });
                if (answer)
                    thequestion.answer = answer;
                if (question)
                    thequestion.question = question;
                if (img)
                    thequestion.img = img;
                yield theRepository.save(question);
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
                const userRepository = datasource_1.dataSource.getRepository(Question_1.Question);
                let deleter = yield userRepository.findOne({ where: { id: id } });
                if (!deleter)
                    return res.status(404).json({
                        err: 1,
                        mes: "Slider not found"
                    });
                yield userRepository.remove(deleter);
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
exports.default = QuestionController;
