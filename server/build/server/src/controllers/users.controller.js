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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersController = exports.UsersController2 = exports.logout = exports.login = exports.signUp = exports.getAuthenticatedUser = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const tsoa_1 = require("tsoa");
const getAuthenticatedUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_model_1.default.findById(req.session.userId).exec();
        res.status(200).json(user);
    }
    catch (error) {
        next(error);
    }
});
exports.getAuthenticatedUser = getAuthenticatedUser;
const signUp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.body.username;
    const passwordRaw = req.body.password;
    try {
        if (!username || !passwordRaw) {
            return res.status(422).send({ error: "Missing parameter!" });
        }
        const isDuplicatedUser = !!(yield user_model_1.default.findOne({
            username: username,
        }).exec());
        if (isDuplicatedUser) {
            return res.status(422).send({ error: "Username already taken!" });
        }
        if (username.length <= 2) {
            return res
                .status(422)
                .send({ error: "Username should be at least 3 characters long!" });
        }
        if (username.length <= 4) {
            return res
                .status(422)
                .send({ error: "Password should be at least 5 characters long!" });
        }
        const passwordHashed = yield bcrypt_1.default.hash(passwordRaw, 10);
        const newUser = yield user_model_1.default.create({
            username: username,
            password: passwordHashed,
        });
        req.session.userId = newUser._id.toString();
        res.status(201).json(newUser);
    }
    catch (error) {
        next(error);
    }
});
exports.signUp = signUp;
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.body.username;
    const rawPassword = req.body.password;
    try {
        if (!username || !rawPassword) {
            return res.status(400).send({ error: "Parameters missing" });
        }
        const user = yield user_model_1.default.findOne({ username: username })
            .select("+password +email")
            .exec();
        if (!user) {
            return res.status(400).send({ error: "Invalid credentials" });
        }
        const passwordMatch = yield bcrypt_1.default.compare(rawPassword, user.password);
        if (!passwordMatch) {
            return res.status(400).send({ error: "Invalid credentials" });
        }
        req.session.userId = user._id.toString();
        const _a = user.toObject(), { password } = _a, respUser = __rest(_a, ["password"]);
        res.status(201).json(respUser);
    }
    catch (error) {
        next(error);
    }
});
exports.login = login;
const logout = (req, res, next) => {
    req.session.destroy((error) => {
        if (error) {
            next(error);
        }
        else {
            res.sendStatus(200);
        }
    });
};
exports.logout = logout;
let UsersController2 = class UsersController2 extends tsoa_1.Controller {
    getUser(userId, name) {
        return __awaiter(this, void 0, void 0, function* () {
            return null;
        });
    }
    createUser(requestBody) {
        return __awaiter(this, void 0, void 0, function* () {
            this.setStatus(201); // set return status 201
            return;
        });
    }
};
__decorate([
    (0, tsoa_1.Get)("{userId}"),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], UsersController2.prototype, "getUser", null);
__decorate([
    (0, tsoa_1.SuccessResponse)("201", "Created") // Custom success response
    ,
    (0, tsoa_1.Post)(),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController2.prototype, "createUser", null);
UsersController2 = __decorate([
    (0, tsoa_1.Tags)("User"),
    (0, tsoa_1.Route)("users2")
], UsersController2);
exports.UsersController2 = UsersController2;
let UsersController = class UsersController extends tsoa_1.Controller {
    getUser(userId, name) {
        return __awaiter(this, void 0, void 0, function* () {
            return null;
        });
    }
    createUser(requestBody) {
        return __awaiter(this, void 0, void 0, function* () {
            this.setStatus(201); // set return status 201
            return;
        });
    }
};
__decorate([
    (0, tsoa_1.Get)("{userId}"),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUser", null);
__decorate([
    (0, tsoa_1.SuccessResponse)("201", "Created") // Custom success response
    ,
    (0, tsoa_1.Post)(),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "createUser", null);
UsersController = __decorate([
    (0, tsoa_1.Route)("users")
], UsersController);
exports.UsersController = UsersController;
