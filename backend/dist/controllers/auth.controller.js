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
const User_entity_1 = require("../entities/User.entity");
class AuthController {
    loginByAccount(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { username, password } = req.body;
                if (!(username && password)) {
                    res.status(400).send();
                }
                const userRepository = datasource_1.dataSource.getRepository(User_entity_1.User);
                let user;
                try {
                    user = yield userRepository.findOneOrFail({ where: { username } });
                }
                catch (error) {
                    res.status(401).send();
                }
                //Check if encrypted password match
                if (!user.checkIfUnencryptedPasswordIsValid(password)) {
                    res.status(401).send();
                    return;
                }
                const token = jwt.sign({ userId: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: "1h" });
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
            const userRepository = datasource_1.dataSource.getRepository(User_entity_1.User);
            let user;
            try {
                user = yield userRepository.findOneOrFail(id);
            }
            catch (id) {
                res.status(401).send();
            }
            //Check if old password matchs
            if (!user.checkIfUnencryptedPasswordIsValid(oldPassword)) {
                res.status(401).send();
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
            user.hashPassword();
            userRepository.save(user);
            res.status(204).send();
        });
    }
    ;
}
exports.default = AuthController;
