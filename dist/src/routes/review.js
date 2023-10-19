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
exports.reviewRouter = void 0;
const isAuthenticated_1 = require("../middlewares/isAuthenticated");
const express_1 = __importDefault(require("express"));
const ReviewMovie_1 = require("../models/ReviewMovie");
const datefns = require("date-fns");
exports.reviewRouter = express_1.default.Router();
exports.reviewRouter.post("/review", isAuthenticated_1.isAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { movieID, title, feeling, opinion } = req.body;
        if (movieID && title && feeling && opinion) {
            const findMovie = yield ReviewMovie_1.Review.find({ movieID });
            // if the movie is not save in the database "reViewMovie"
            if (!findMovie) {
                const createReview = new ReviewMovie_1.Review({
                    user: req.user._id,
                    feeling: feeling,
                    opinion: opinion,
                    date: datefns.format(new Date(), "yyyy-MM-dd"),
                    movieID,
                    title,
                });
                yield createReview.save();
                res.status(200).json({ message: "post created" });
            }
            else {
                // userIDString is  the user ObecjtID in the middleware in string type
                const userIDString = req.user._id.toString();
                let flag = false;
                findMovie.forEach((item) => {
                    // reviewIDstring is the user ObecjtID in each object of the review's array
                    // in string type
                    const reviewIDString = item.user.toString();
                    if (reviewIDString === userIDString) {
                        flag = true;
                        res.status(200).json({
                            message: "this user has already posted for this film",
                        });
                    }
                });
                if (!flag) {
                    const createReview = new ReviewMovie_1.Review({
                        user: req.user._id,
                        feeling: feeling,
                        opinion: opinion,
                        date: datefns.format(new Date(), "yyyy-MM-dd"),
                        movieID,
                        title,
                    });
                    yield createReview.save();
                    res.status(200).json({ message: "post created" });
                }
            }
        }
        else {
            throw {
                status: 400,
                message: "missing parameters movieID, feeling or review",
            };
        }
    }
    catch (error) {
        res.status(500 || error.status).json({ message: error.message });
    }
}));
exports.reviewRouter.get("/review", isAuthenticated_1.isAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { movieID } = req.query;
        const findMovie = yield ReviewMovie_1.Review.find({ movieID }).populate({
            path: "user",
            select: ["username", "_id"],
            model: "User",
        });
        if (findMovie) {
            res.status(200).json(findMovie);
        }
        else {
            res.status(200).json([]);
        }
    }
    catch (error) {
        res.status(500 || error.status).json({ message: error.message });
    }
}));
exports.reviewRouter.get("/review/form", isAuthenticated_1.isAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { movieID } = req.query;
        const findMovie = yield ReviewMovie_1.Review.find({ movieID });
        if (findMovie) {
            const userIDString = req.user._id.toString();
            let findForm = null;
            findMovie.forEach((item) => {
                // reviewIDstring is the user ObecjtID in each object of the review's array
                // in string type
                const reviewIDString = item.user.toString();
                if (reviewIDString === userIDString) {
                    findForm = item;
                }
            });
            if (findForm)
                res.status(200).json(findForm);
            else
                res.status(200).json(null);
        }
    }
    catch (error) {
        res.status(500 || error.status).json({ message: error.message });
    }
}));
exports.reviewRouter.put("/review/:id", isAuthenticated_1.isAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { feeling, opinion } = req.body;
        if (feeling && opinion) {
            const id = req.params.id;
            const findReview = yield ReviewMovie_1.Review.findById(id);
            findReview.feeling = feeling;
            findReview.opinion = opinion;
            yield findReview.save();
            res.status(200).json(findReview);
        }
        else {
            throw { status: 400, message: "missing feeling or opinion" };
        }
    }
    catch (error) {
        res.status(500 || error.status).json({ message: error.message });
    }
}));
exports.reviewRouter.delete("/review/:id", isAuthenticated_1.isAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const deleteReview = yield ReviewMovie_1.Review.findByIdAndDelete(id);
        if (deleteReview) {
            res.status(200).json({ message: "post deleted" });
        }
        else {
            throw { status: 400, message: "no review to delete is found" };
        }
    }
    catch (error) {
        res.status(500 || error.status).json({ message: error.message });
    }
}));
//# sourceMappingURL=review.js.map