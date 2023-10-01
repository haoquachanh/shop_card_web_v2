"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const jwt = __importStar(require("jsonwebtoken"));
const class_validator_1 = require("class-validator");
require("dotenv/config");
const datasource_1 = require("../datasource");
const User_1 = require("../entities/User");
const Image_1 = require("../entities/Image");
class AuthController {
    loginByAccount(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { email, password } = req.body;
                if (!(email && password)) {
                    res.status(400).json({
                        err: 1,
                        mes: "Missing password or email"
                    });
                }
                const userRepository = datasource_1.dataSource.getRepository(User_1.User);
                let user;
                user = yield userRepository.findOne({ where: { email } });
                if (!user)
                    return res.status(404).json({
                        err: 1,
                        mes: "User not found"
                    });
                //Check if encrypted password match
                if (!user.checkIfUnencryptedPasswordIsValid(password)) {
                    res.status(401).json({
                        err: 1,
                        mes: "Invalid password"
                    });
                    return;
                }
                const token = jwt.sign({ userId: user.id, email: user.email, fullname: user.fullname }, process.env.JWT_SECRET, { expiresIn: "1h" });
                res.status(200).json({
                    err: 0,
                    mes: "Login successful",
                    token: token
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
    changePassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = res.locals.jwtPayload.userId;
            const { oldPassword, newPassword } = req.body;
            if (!(oldPassword && newPassword)) {
                res.status(400).send();
            }
            const userRepository = datasource_1.dataSource.getRepository(User_1.User);
            let user;
            try {
                user = yield userRepository.findOneOrFail(id);
            }
            catch (error) {
                return res.status(401).json({ err: 1, mes: "Not exist" });
            }
            //Check if old password matchs
            if (!user.checkIfUnencryptedPasswordIsValid(oldPassword)) {
                res.status(401).json({ err: 1, mes: "Password is matches with old password" });
                return;
            }
            //Validate de model (password lenght)
            user.password = newPassword;
            const errors = yield (0, class_validator_1.validate)(user);
            if (errors.length > 0) {
                res.status(400).send(errors);
                return;
            }
            //Hash the new password and save
            userRepository.save(user);
            res.status(204).send();
        });
    }
    ;
    loginByOrtherway(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            //get the user information
            let email = req.user.emails[0].value;
            let fullname = req.user.displayName;
            let img = new Image_1.Image();
            img.imgSrc = req.user.photos[0].value;
            img = yield datasource_1.dataSource.getRepository(Image_1.Image).save(img);
            const userRepository = datasource_1.dataSource.getRepository(User_1.User);
            let user;
            user = yield userRepository.findOne({ where: { email } });
            let id = user === null || user === void 0 ? void 0 : user.id;
            if (!user) {
                user = new User_1.User("none", fullname, email);
                user.avt = img;
                try {
                    let newUser = yield userRepository.save(user);
                    id = newUser.id;
                }
                catch (error) {
                    console.log(">>>error: ", error);
                    return res.status(500).json({ err: -1, mes: "Iternal Error" });
                }
            }
            const token = jwt.sign({ id: id }, process.env.JWT_SECRET, { expiresIn: 90 });
            // res.status(200).json({err:0, mes: "Loggin Success", token: token})
            res.redirect(`${process.env.CLIENT_URL}/?tokenID=${token}`);
        });
    }
    loginWithTokenID(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const tokenID = req.body.tokenID;
            if (!tokenID) {
                res.status(400).json({ err: 1, mes: "missing token" });
            }
            let jwtPayload;
            try {
                jwtPayload = jwt.verify(tokenID, process.env.JWT_SECRET);
            }
            catch (error) {
                //If token is not valid, respond with 401 (unauthorized)
                return res.status(401).send({
                    err: 1,
                    mes: error.message
                });
            }
            const user = yield datasource_1.dataSource.getRepository(User_1.User).findOne({ where: { id: jwtPayload.id } });
            if (!user) {
                return res.status(404).json({ err: 1, mes: "User not found" });
            }
            let token = jwt.sign({ userId: user.id, email: user.email, fullname: user.fullname }, process.env.JWT_SECRET, { expiresIn: "1h" });
            return res.status(200).json({
                err: 0,
                mes: "Login successful",
                token: token
            });
        });
    }
}
exports.default = AuthController;
