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
const Card_entity_1 = require("../entities/Card.entity");
const CardImage_entity_1 = require("../entities/CardImage.entity");
// import { connectToDatabase } from '../connection';
const datasource_1 = require("../datasource");
class CardController {
    getAllCards(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const cardRepository = datasource_1.dataSource.getRepository(Card_entity_1.Card);
                const page = parseInt(req.query.page) || 1;
                const pageSize = parseInt(req.query.pageSize) || 10;
                const type = req.query.type; // Tham số để lọc theo loại
                const sortParam = req.query.sort; // Tham số để sắp xếp
                const skip = (page - 1) * pageSize;
                console.log(page, pageSize, skip, sortParam);
                const queryBuilder = yield cardRepository
                    .createQueryBuilder('card')
                    .leftJoinAndSelect('card.image', 'cardimage')
                    .skip(skip)
                    .take(pageSize);
                if (type) {
                    queryBuilder.where('card.type = :type', { type });
                }
                if (sortParam) {
                    const [field, order] = sortParam.split(':');
                    queryBuilder.orderBy(`card.${field}`, order);
                }
                const cards = yield queryBuilder.getMany();
                res.status(200).json({
                    err: 0,
                    mes: cards.length > 0 ? "Got all cards." : "No have any cards.",
                    pageSize: pageSize,
                    data: cards
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
    getCardById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
            }
            catch (error) {
                res.status(500).json({ error: 'Internal server error' });
            }
        });
    }
    createCard(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const cardRepository = datasource_1.dataSource.getRepository(Card_entity_1.Card);
                const cardImageRepository = datasource_1.dataSource.getRepository(CardImage_entity_1.CardImage);
                //Create card image first
                const cardImage = new CardImage_entity_1.CardImage();
                //need a middleware upload card image and return its link
                cardImage.linkimg = "link_return_by_middleware_upload_card_image";
                yield cardImageRepository.save(cardImage);
                //Create card
                const newCard = cardRepository.create(Object.assign(Object.assign({}, req.body), { image: cardImage }));
                yield cardRepository.save(newCard);
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
    updateCard(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
            }
            catch (error) {
                res.status(500).json({ error: 'Internal server error' });
            }
        });
    }
    deleteCard(req, res) {
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
exports.default = CardController;
