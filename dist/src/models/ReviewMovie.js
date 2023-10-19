"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Review = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const ReviewSchema = new mongoose_1.default.Schema({
    user: Object,
    feeling: String,
    opinion: String,
    date: String,
    movieID: Number,
    title: String,
});
// const MovieSchema = new mongoose.Schema<IMovie>({
//   review: [ReviewSchema],
// });
exports.Review = mongoose_1.default.models.Review || mongoose_1.default.model("Review", ReviewSchema);
// export const ReviewMovie =
//   mongoose.models.ReviewMovie ||
//   mongoose.model<IMovie>("ReviewMovie", MovieSchema);
//# sourceMappingURL=ReviewMovie.js.map