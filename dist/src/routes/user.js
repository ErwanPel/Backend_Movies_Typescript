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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = __importDefault(require("express"));
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const uid2 = require("uid2");
const User_1 = require("../models/User");
const isAuthenticated_1 = require("../middlewares/isAuthenticated");
const fileUpload = require("express-fileupload");
const cloudinary = require("cloudinary").v2;
const convertToBase64_1 = require("../tools/convertToBase64");
exports.userRouter = express_1.default.Router();
exports.userRouter.post("/signin", fileUpload(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password } = req.body;
    if (username && email && password) {
        const searchEmail = yield User_1.User.findOne({ email });
        if (searchEmail) {
            throw { status: 400, message: "This email is already used" };
        }
        else {
            try {
                const salt = uid2(20);
                const hash = SHA256(password + salt).toString(encBase64);
                const token = uid2(20);
                const newUser = new User_1.User({
                    username,
                    email,
                    salt,
                    token,
                    hash,
                    photo: [],
                });
                if (req.files) {
                    const pictureToUpload = req.files.picture;
                    const result = yield cloudinary.uploader.upload((0, convertToBase64_1.convertToBase64)(pictureToUpload), {
                        folder: `/GiveMovies/users/${newUser._id}`,
                    });
                    newUser.photo.push(result);
                }
                yield newUser.save();
                res.status(200).json({ token: newUser.token, id: newUser._id });
            }
            catch (error) {
                res.status(500 || error.status).json({ message: error.message });
            }
        }
    }
    else {
        throw {
            status: 400,
            message: "missing paramaters (name, email or password)",
        };
    }
}));
exports.userRouter.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (email && password) {
            const searchUser = yield User_1.User.findOne({ email });
            console.log(searchUser);
            if (searchUser && !searchUser.isDeleted) {
                const isGoodPassword = SHA256(password + searchUser.salt).toString(encBase64);
                if (isGoodPassword === searchUser.hash) {
                    res.status(200).json({ token: searchUser.token, id: searchUser._id });
                }
                else {
                    throw { status: 400, message: "email or password is incorrect" };
                }
            }
            else {
                throw { status: 400, message: "email or password is incorrect" };
            }
        }
        else {
            res.status(401).json({ token: null });
        }
    }
    catch (error) {
        res.status(500 || error.status).json({ message: error.message });
    }
}));
exports.userRouter.put("/profile/email", isAuthenticated_1.isAuthenticated, (req, res) => {
    const { email } = req.body;
    try {
        if (email && typeof email === "string") {
            const userChangeMail = req.user;
            if (userChangeMail.email !== email) {
                userChangeMail.email = email;
                userChangeMail.save();
                res.status(200).json({ message: "Your email has been modified" });
            }
            else {
                throw { status: 400, message: "this is the same email" };
            }
        }
        else {
            throw { status: 400, message: "missing email in request" };
        }
    }
    catch (error) {
        res.status(500 || error.status).json({ message: error.message });
    }
});
exports.userRouter.put("/profile/picture", isAuthenticated_1.isAuthenticated, fileUpload(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        if (req.files) {
            yield cloudinary.uploader.destroy(req.user.photo[0].public_id);
            const pictureToUpload = (_a = req.files) === null || _a === void 0 ? void 0 : _a.picture;
            const result = yield cloudinary.uploader.upload((0, convertToBase64_1.convertToBase64)(pictureToUpload), {
                folder: `/GiveMovies/users/${req.user._id}`,
            });
            req.user.photo = [];
            req.user.photo.push(result);
            req.user.markModified("photo");
            yield req.user.save();
            res.status(200).json(req.user);
        }
        else {
            throw { status: 400, message: "missing picture to transfer" };
        }
    }
    catch (error) {
        res.status(500 || error.status).json({ message: error.message });
    }
}));
exports.userRouter.delete("/profile/picture", isAuthenticated_1.isAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield cloudinary.uploader.destroy(req.user.photo[0].public_id);
        yield cloudinary.api.delete_folder(req.user.photo[0].folder);
        req.user.photo = [];
        req.user.markModified("photo");
        req.user.save();
        res.status(200).json(result);
    }
    catch (error) {
        res.status(500 || error.status).json({ message: error.message });
    }
}));
exports.userRouter.delete("/profile/user", isAuthenticated_1.isAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        req.user.username = "deleted account";
        req.user.email = "";
        req.user.salt = "";
        req.user.token = "";
        req.user.hash = "";
        req.user.isDeleted = true;
        if (req.user.photo.length > 0) {
            yield cloudinary.uploader.destroy(req.user.photo[0].public_id);
            yield cloudinary.api.delete_folder(req.user.photo[0].folder);
            req.user.photo = [];
            req.user.markModified("photo");
        }
        yield req.user.save();
        res.status(200).json(req.user);
    }
    catch (error) {
        res.status(500 || error.status).json({ message: error.message });
    }
}));
//# sourceMappingURL=user.js.map