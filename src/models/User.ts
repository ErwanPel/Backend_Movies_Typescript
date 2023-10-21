import mongoose from "mongoose";

export type TUser = {
  username: string;
  email: string;
  photo: [];
  salt: string;
  token: string;
  hash: string;
  isDeleted: boolean;
};

export interface IUserwithID extends TUser {
  _id: string;
}

const UserSchema = new mongoose.Schema<TUser>({
  username: { type: String },
  email: { type: String },
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
  mongoose.models.User || mongoose.model<TUser>("User", UserSchema);
