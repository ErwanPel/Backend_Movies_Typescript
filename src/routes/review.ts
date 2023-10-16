import { isAuthenticated } from "../middlewares/isAuthenticated";
import express, { Request, Response } from "express";
import { IReview, ReviewMovie } from "../models/ReviewMovie";
import { User } from "../models/User";
const datefns = require("date-fns");

export const reviewRouter = express.Router();

reviewRouter.post(
  "/review",
  isAuthenticated,
  async (req: Request, res: Response) => {
    try {
      const { movieID, title, review } = req.body;

      if (movieID && title && review) {
        const findMovie = await ReviewMovie.findOne({ movieID });

        // if the movie is not save in the database "reViewMovie"
        if (!findMovie) {
          const createMovie = new ReviewMovie({
            movieID,
            title,
            review: [
              {
                user: req.user._id,
                feeling: review.feeling,
                opinion: review.opinion,
                date: datefns.format(new Date(), "yyyy-MM-dd"),
              },
            ],
          });
          await createMovie.save();
          res.status(200).json(createMovie);
        } else {
          // userIDString is  the user ObecjtID in the middleware in string type
          const userIDString = req.user._id.toString();
          let flag = false;
          findMovie.review.forEach((e: any) => {
            // reviewIDstring is the user ObecjtID in each object of the review's array
            // in string type
            const reviewIDString = e.user.toString();
            if (reviewIDString === userIDString) {
              flag = true;
            }
          });

          if (!flag) {
            findMovie.review.push({
              user: req.user._id,
              feeling: review.feeling,
              opinion: review.opinion,
              date: datefns.format(new Date(), "yyyy-MM-dd"),
            });

            await findMovie.save();
            res.status(200).json(findMovie);
          } else {
            res
              .status(200)
              .json({ message: "ce user a déjà posté pour ce film" });
          }
        }
      } else {
        throw {
          status: 400,
          message: "missing parameters movieID, feeling or review",
        };
      }
    } catch (error: any) {
      res.status(500 || error.status).json({ message: error.message });
    }
  }
);

reviewRouter.get(
  "/review",
  isAuthenticated,
  async (req: Request, res: Response) => {
    try {
      const { movieID } = req.query;
      const findMovie = await ReviewMovie.findOne({ movieID }).populate({
        path: "review.user",
        select: "username",
        model: "User",
      });
      if (findMovie) {
        res.status(200).json(findMovie);
      } else {
        res.status(200).json([]);
      }
    } catch (error: any) {
      res.status(500 || error.status).json({ message: error.message });
    }
  }
);
