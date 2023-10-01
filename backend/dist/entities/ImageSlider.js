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
exports.ImageSlider = void 0;
const typeorm_1 = require("typeorm");
// import { Product } from './Product';
const Image_1 = require("./Image");
let ImageSlider = class ImageSlider {
};
exports.ImageSlider = ImageSlider;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ImageSlider.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => Image_1.Image, i => i.id, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Image_1.Image
    // @OneToOne(()=>Product)
    // product: Product;
    )
], ImageSlider.prototype, "img", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ImageSlider.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], ImageSlider.prototype, "index", void 0);
exports.ImageSlider = ImageSlider = __decorate([
    (0, typeorm_1.Entity)("imageSlider")
], ImageSlider);
