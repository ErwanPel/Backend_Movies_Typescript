import mongoose from "mongoose";

export interface IUser {
  username: string;
  email: string;
  photo: [];
  salt: string;
  token: string;
  hash: string;
}

const UserSchema = new mongoose.Schema<IUser>({
  username: { type: String, unique: true },
  email: { type: String, unique: true },
  photo: [],
  salt: { require: true, type: String },
  token: { require: true, type: String },
  hash: { require: true, type: String },
});

export const User =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
