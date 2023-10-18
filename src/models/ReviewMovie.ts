import mongoose from "mongoose";

export interface IReview {
  user: {
    type: mongoose.Schema.Types.ObjectId;
    ref: "User";
  };
  feeling: string;
  opinion: string;
  date: string;
  movieID: number;
  title: string;
}

const ReviewSchema = new mongoose.Schema<IReview>({
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

export const Review =
  mongoose.models.Review || mongoose.model<IReview>("Review", ReviewSchema);

// export const ReviewMovie =
//   mongoose.models.ReviewMovie ||
//   mongoose.model<IMovie>("ReviewMovie", MovieSchema);
