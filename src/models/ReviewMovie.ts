import mongoose from "mongoose";

export interface IReview {
  user: {
    type: mongoose.Schema.Types.ObjectId;
    ref: "User";
  };
  feeling: string;
  opinion: string;
  date: string;
}

export interface IMovie {
  movieID: number;
  title: string;
  review: IReview;
}

const ReviewSchema = new mongoose.Schema<IReview>({
  user: Object,
  feeling: String,
  opinion: String,
  date: String,
});

const MovieSchema = new mongoose.Schema<IMovie>({
  movieID: Number,
  title: String,
  review: [ReviewSchema],
});

export const ReviewMovie =
  mongoose.models.ReviewMovie ||
  mongoose.model<IMovie>("ReviewMovie", MovieSchema);
