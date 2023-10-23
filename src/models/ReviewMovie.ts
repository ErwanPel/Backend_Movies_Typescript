import mongoose from "mongoose";

export type TReviewPopulate = {
  user: {
    _id: string;
    username: string;
    photo: [];
  };
  feeling: string;
  opinion: string;
  date: string;
  movieID: number;
  title: string;
  poster: string;
  like: string[];
  dislike: string[];
};

export type TReview = {
  user: {
    type: mongoose.Schema.Types.ObjectId;
    ref: "User";
  };
  feeling: string;
  opinion: string;
  date: string;
  movieID: number;
  title: string;
  poster: string;
  like: string[];
  dislike: string[];
};

const ReviewSchema = new mongoose.Schema<TReview>({
  user: Object,
  feeling: String,
  opinion: String,
  date: String,
  movieID: Number,
  title: String,
  poster: String,
  like: [String],
  dislike: [String],
});

export const Review =
  mongoose.models.Review || mongoose.model<TReview>("Review", ReviewSchema);
