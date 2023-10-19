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
exports.movieRouter = void 0;
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const envVariables_1 = require("../zodFolder/envVariables");
const { APIKEY } = envVariables_1.envVariables;
const zod_1 = require("zod");
exports.movieRouter = express_1.default.Router();
const SoloMovieSchema = zod_1.z.object({
    backdrop_path: zod_1.z.object({
        w300: zod_1.z.string(),
        w780: zod_1.z.string(),
        w1280: zod_1.z.string(),
        original: zod_1.z.string(),
    }),
    poster_path: zod_1.z.object({
        w92: zod_1.z.string(),
        w154: zod_1.z.string(),
        w185: zod_1.z.string(),
        w342: zod_1.z.string(),
        w500: zod_1.z.string(),
        w780: zod_1.z.string(),
        original: zod_1.z.string(),
    }),
    overview: zod_1.z.string(),
    release_date: zod_1.z.string(),
    title: zod_1.z.string(),
    vote_average: zod_1.z.number(),
    id: zod_1.z.number(),
});
const MoviesSchema = zod_1.z.object({
    page: zod_1.z.number(),
    results: zod_1.z.array(SoloMovieSchema),
});
exports.movieRouter.get("/movies", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { page } = req.query;
    try {
        const { data } = yield axios_1.default.get(`https://lereacteur-bootcamp-api.herokuapp.com/api/allocine/movies/top_rated?page=${page}`, {
            headers: { Authorization: `Bearer ${APIKEY}` },
        });
        const movieParse = MoviesSchema.parse(data);
        movieParse.results.sort((a, b) => {
            if (a.title < b.title) {
                return -1;
            }
            if (a.title > b.title) {
                return 1;
            }
            return 0;
        });
        res.status(200).json(movieParse);
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            res.status(400).json(error);
        }
        else {
            res.status(500).json(error);
        }
    }
}));
exports.movieRouter.get("/movies/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const { data } = yield axios_1.default.get(`https://lereacteur-bootcamp-api.herokuapp.com/api/allocine/movie/${id}`, {
            headers: { Authorization: `Bearer ${APIKEY}` },
        });
        const movieParse = SoloMovieSchema.parse(data);
        res.status(200).json(movieParse);
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            res.status(400).json(error);
        }
        else {
            res.status(500).json(error);
        }
    }
}));
//# sourceMappingURL=movies.js.map