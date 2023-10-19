import mongoose from "mongoose";

export type IUser = {
  username: string;
  email: string;
  photo: [];
  salt: string;
  token: string;
  hash: string;
  isDeleted: boolean;
};

const UserSchema = new mongoose.Schema<IUser>({
  username: { type: String, unique: true },
  email: { type: String, unique: true },
  photo: [],
  salt: { require: true, type: String },
  token: { require: true, type: String },
  hash: { require: true, type: String },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

export const User =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
