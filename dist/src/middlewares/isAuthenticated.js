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
exports.isAuthenticated = void 0;
const User_1 = require("../models/User");
const isAuthenticated = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.headers.authorization) {
        console.log("je suis dans le middleware");
        const sentToken = req.headers.authorization.replace("Bearer ", "");
        const findUser = yield User_1.User.findOne({ token: sentToken });
        if (findUser) {
            console.log("autorisé");
            req.user = findUser;
            next();
        }
        else {
            res.status(401).json("unauthorized");
        }
    }
    else {
        res.status(401).json("unauthorized");
    }
});
exports.isAuthenticated = isAuthenticated;
//# sourceMappingURL=isAuthenticated.js.map