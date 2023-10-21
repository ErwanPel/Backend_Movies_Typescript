import { isAuthenticated } from "../middlewares/isAuthenticated";
import express, { Request, Response } from "express";
import { TReview, Review } from "../models/ReviewMovie";
const datefns = require("date-fns");

export const reviewRouter = express.Router();

reviewRouter.post(
  "/review",
  isAuthenticated,
  async (req: Request, res: Response) => {
    try {
      const { movieID, title, feeling, opinion } = req.body;

      if (movieID && title && feeling && opinion) {
        const findMovie = await Review.find<TReview>({ movieID });
        // if the movie is not save in the database "reViewMovie"
        if (!findMovie) {
          const createReview = new Review({
            user: req.user._id,
            feeling: feeling,
            opinion: opinion,
            date: datefns.format(new Date(), "yyyy-MM-dd"),
            movieID,
            title,
            like: [],
            dislike: [],
          });

          await createReview.save();

          res.status(200).json({ message: "post created" });
        } else {
          // userIDString is  the user ObecjtID in the middleware in string type
          const userIDString: string = req.user._id.toString();

          let flag: boolean = false;

          findMovie.forEach((item: TReview) => {
            // reviewIDstring is the user ObecjtID in each object of the review's array
            // in string type
            const reviewIDString: string = item.user.toString();
            if (reviewIDString === userIDString) {
              flag = true;
              res.status(200).json({
                message: "this user has already posted for this film",
              });
            }
          });

          if (!flag) {
            const createReview = new Review<TReview>({
              user: req.user._id,
              feeling: feeling,
              opinion: opinion,
              date: datefns.format(new Date(), "yyyy-MM-dd"),
              movieID,
              title,
              like: [],
              dislike: [],
            });

            await createReview.save();

            res.status(200).json({ message: "post created" });
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
      const findMovie = await Review.find<TReview>({ movieID });
      if (findMovie) {
        console.log(findMovie);
        const findMoviePopulate = await Review.find<TReview>({
          movieID,
        })
          .populate({
            path: "user",
            select: ["username", "_id", "photo.secure_url"],
            model: "User",
          })
          .sort({ date: -1 });
        res.status(200).json(findMoviePopulate);
      } else {
        res.status(200).json([]);
      }
    } catch (error: any) {
      res.status(500 || error.status).json({ message: error.message });
    }
  }
);

reviewRouter.get(
  "/review/form",
  isAuthenticated,
  async (req: Request, res: Response) => {
    try {
      const { movieID } = req.query;
      const findMovie = await Review.find<TReview>({ movieID });
      if (findMovie) {
        const userIDString: string = req.user._id.toString();

        let findForm: TReview | null = null;

        findMovie.forEach((item: TReview) => {
          // reviewIDstring is the user ObecjtID in each object of the review's array
          // in string type
          const reviewIDString: string = item.user.toString();
          if (reviewIDString === userIDString) {
            findForm = item;
          }
        });

        if (findForm) res.status(200).json(findForm);
        else res.status(200).json(null);
      }
    } catch (error: any) {
      res.status(500 || error.status).json({ message: error.message });
    }
  }
);

reviewRouter.put(
  "/review/:id",
  isAuthenticated,
  async (req: Request, res: Response) => {
    try {
      const { feeling, opinion } = req.body;
      if (feeling && opinion) {
        const id = req.params.id;

        const findReview = await Review.findById(id);
        if (findReview) {
          findReview.feeling = feeling;
          findReview.opinion = opinion;
          await findReview.save();
          res.status(200).json(findReview);
        } else {
          throw { status: 400, message: `no review is found with ID ${id}` };
        }
      } else {
        throw { status: 400, message: "missing feeling or opinion" };
      }
    } catch (error: any) {
      res.status(500 || error.status).json({ message: error.message });
    }
  }
);

reviewRouter.delete(
  "/review/:id",
  isAuthenticated,
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const deleteReview = await Review.findByIdAndDelete<TReview>(id);
      if (deleteReview) {
        res.status(200).json({ message: "post deleted" });
      } else {
        throw { status: 400, message: "no review to delete is found" };
      }
    } catch (error: any) {
      res.status(500 || error.status).json({ message: error.message });
    }
  }
);

reviewRouter.post(
  "/review/preference",
  isAuthenticated,
  async (req: Request, res: Response) => {
    try {
      const { movieID } = req.query;
      const { preference, userID } = req.body;
      const findMovie = await Review.findOne({ movieID });
      if (findMovie) {
        if (preference === "like") {
          const isUserInDislike = findMovie.dislike.findIndex(
            (item: TReview) => item === userID
          );

          if (isUserInDislike === -1) {
            const isUserInLike = findMovie.like.findIndex(
              (item: TReview) => item === userID
            );

            if (isUserInLike === -1) {
              findMovie.like.push(userID);
              findMovie.markModified("like");
              findMovie.save();
              res.status(200).json(findMovie);
            } else {
              findMovie.like.splice(isUserInLike, 1);
              console.log(findMovie);
              findMovie.markModified("like");
              findMovie.save();
              res.status(200).json(findMovie);
            }
          } else {
            findMovie.dislike.splice(isUserInDislike, 1);
            findMovie.like.push(userID);
            findMovie.markModified("like");
            findMovie.markModified("dislike");
            findMovie.save();
            res.status(200).json(findMovie);
          }
        } else {
          const isUserInLike = findMovie.like.findIndex(
            (item: TReview) => item === userID
          );

          if (isUserInLike === -1) {
            const isUserInDislike = findMovie.dislike.findIndex(
              (item: TReview) => item === userID
            );

            if (isUserInDislike === -1) {
              findMovie.dislike.push(userID);
              findMovie.markModified("dislike");
              findMovie.save();
              res.status(200).json(findMovie);
            } else {
              findMovie.dislike.splice(isUserInDislike, 1);
              console.log(findMovie);
              findMovie.markModified("dislike");
              findMovie.save();
              res.status(200).json(findMovie);
            }
          } else {
            findMovie.like.splice(isUserInLike, 1);
            findMovie.dislike.push(userID);
            findMovie.markModified("like");
            findMovie.markModified("dislike");
            findMovie.save();
            res.status(200).json(findMovie);
          }
        }
      }
    } catch (error: any) {
      res.status(500 || error.status).json({ message: error.message });
    }
  }
);
