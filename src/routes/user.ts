import express, { Request, Response } from "express";
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const uid2 = require("uid2");
import { User } from "../models/User";
import { isAuthenticated } from "../middlewares/isAuthenticated";
const fileUpload = require("express-fileupload");

export const userRouter = express.Router();

userRouter.post(
  "/signin",
  fileUpload(),
  async (req: Request, res: Response) => {
    const { username, email, password } = req.body;
    console.log(username, email, password);
    try {
      if (username && email && password) {
        const salt: string = uid2(20);
        const hash: string = SHA256(password + salt).toString(encBase64);
        const token: string = uid2(20);

        const newUser = new User({
          username,
          email,
          salt,
          token,
          hash,
        });

        await newUser.save();

        res.status(200).json({ token: newUser.token, id: newUser._id });
      } else {
        throw {
          status: 400,
          message: "missing paramaters (name, email or password)",
        };
      }
    } catch (error: any) {
      res.status(500 || error.status).json({ message: error.message });
    }
  }
);

userRouter.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (email && password) {
      const searchUser = await User.findOne({ email });
      if (searchUser) {
        const isGoodPassword: string = SHA256(
          password + searchUser.salt
        ).toString(encBase64);
        if (isGoodPassword === searchUser.hash) {
          res.status(200).json({ token: searchUser.token, id: searchUser._id });
        } else {
          throw { status: 400, message: "email or password is incorrect" };
        }
      }
    } else {
      res.status(401).json({ token: null });
    }
  } catch (error: any) {
    res.status(500 || error.status).json({ message: error.message });
  }
});

userRouter.put(
  "/modify/email",
  isAuthenticated,
  (req: Request, res: Response) => {
    try {
      if (req.body.email) {
        const userChangeMail = req.user;
        if (userChangeMail.email !== req.body.email) {
          userChangeMail.email = req.body.email;
          userChangeMail.save();
          res.status(200).json({ message: "Your email has been modified" });
        } else {
          throw { status: 400, message: "this is the same email" };
        }
      } else {
        throw { status: 400, message: "missing email in request" };
      }
    } catch (error: any) {
      res.status(500 || error.status).json({ message: error.message });
    }
  }
);
