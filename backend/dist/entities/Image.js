"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Image = void 0;
const typeorm_1 = require("typeorm");
const Product_1 = require("./Product");
const ImageSlider_1 = require("./ImageSlider");
const User_1 = require("./User");
let Image = class Image {
};
exports.Image = Image;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Image.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => User_1.User, i => i.avt),
    (0, typeorm_1.ManyToOne)(() => Product_1.Product, i => i.imgs),
    __metadata("design:type", Product_1.Product)
], Image.prototype, "product", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => ImageSlider_1.ImageSlider, i => i.img, { onDelete: 'CASCADE' }),
    (0, typeorm_1.OneToOne)(() => Product_1.Product, i => i.avt, { onDelete: 'CASCADE' }),
    (0, typeorm_1.OneToOne)(() => Product_1.Product, i => i.avt_hover, { onDelete: 'CASCADE' }),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Image.prototype, "imgSrc", void 0);
exports.Image = Image = __decorate([
    (0, typeorm_1.Entity)("images")
], Image);
