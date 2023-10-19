"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const envVariables_1 = require("./src/zodFolder/envVariables");
const movies_1 = require("./src/routes/movies");
const user_1 = require("./src/routes/user");
const review_1 = require("./src/routes/review");
const { PORT, NODE_ENV, MONGOOSE_URL, CLOUDINARY_NAME, CLOUDINARY_APIKEY, CLOUDINARY_APISECRET, } = envVariables_1.envVariables;
const mongoose_1 = __importDefault(require("mongoose"));
mongoose_1.default.connect(MONGOOSE_URL);
const cloudinary = require("cloudinary").v2;
cloudinary.config({
    cloud_name: CLOUDINARY_NAME,
    api_key: CLOUDINARY_APIKEY,
    api_secret: CLOUDINARY_APISECRET,
});
const app = (0, express_1.default)();
app.use(express_1.default.json()).use(movies_1.movieRouter).use(user_1.userRouter).use(review_1.reviewRouter);
app.get("/", (req, res) => {
    try {
        res.status(200).json({ message: "bienvenue sur film" });
    }
    catch (error) {
        res
            .status(500)
            .json({ message: "Sorry, the application is temporary disabled" });
    }
});
app.listen(PORT, () => {
    console.log(`server has started in port ${PORT} in ${NODE_ENV} mode  `);
});
//# sourceMappingURL=server.js.map