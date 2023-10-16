import express, { Request, Response } from "express";
import axios from "axios";
import { envVariables } from "../zodFolder/envVariables";
const { APIKEY } = envVariables;
import { ZodError, z } from "zod";

export const movieRouter = express.Router();

const SoloMovieSchema = z.object({
  backdrop_path: z.object({
    w300: z.string(),
    w780: z.string(),
    w1280: z.string(),
    original: z.string(),
  }),
  poster_path: z.object({
    w92: z.string(),
    w154: z.string(),
    w185: z.string(),
    w342: z.string(),
    w500: z.string(),
    w780: z.string(),
    original: z.string(),
  }),
  overview: z.string(),
  release_date: z.string(),
  title: z.string(),
  vote_average: z.number(),
  id: z.number(),
});

const MoviesSchema = z.object({
  page: z.number(),
  results: z.array(SoloMovieSchema),
});

movieRouter.get("/movies", async (req: Request, res: Response) => {
  const { page } = req.query;

  try {
    const { data } = await axios.get(
      `https://lereacteur-bootcamp-api.herokuapp.com/api/allocine/movies/top_rated?page=${page}`,
      {
        headers: { Authorization: `Bearer ${APIKEY}` },
      }
    );

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
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json(error);
    } else {
      res.status(500).json(error);
    }
  }
});

movieRouter.get("/movies/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const { data } = await axios.get(
      `https://lereacteur-bootcamp-api.herokuapp.com/api/allocine/movie/${id}`,
      {
        headers: { Authorization: `Bearer ${APIKEY}` },
      }
    );
    const movieParse = SoloMovieSchema.parse(data);
    res.status(200).json(movieParse);
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json(error);
    } else {
      res.status(500).json(error);
    }
  }
});
