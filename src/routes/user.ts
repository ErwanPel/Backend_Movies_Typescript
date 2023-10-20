import express, { Request, Response } from "express";
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const uid2 = require("uid2");
import { IUser, User } from "../models/User";
import { isAuthenticated } from "../middlewares/isAuthenticated";
const fileUpload = require("express-fileupload");
const cloudinary = require("cloudinary").v2;
import { convertToBase64 } from "../tools/convertToBase64";
import { UploadedFile } from "express-fileupload";

export const userRouter = express.Router();

userRouter.get(
  "/profile/user",
  isAuthenticated,
  (req: Request, res: Response) => {
    try {
      const { _id, username, email, photo } = req.user;
      if (!req.user.isDeleted) {
        let photoResponse = [];
        if (photo[0]?.secure_url) {
          photoResponse.push({ secure_url: photo[0].secure_url });
        }
        res.status(200).json({ _id, username, email, photo: photoResponse });
      } else {
        throw { status: 400, message: "user is not found" };
      }
    } catch (error: any) {
      res.status(500 || error.status).json({ message: error.message });
    }
  }
);

userRouter.post(
  "/signin",
  fileUpload(),
  async (req: Request, res: Response) => {
    try {
      const { username, email, password } = req.body;
      if (username && email && password) {
        const searchEmail = await User.findOne({ email });
        if (searchEmail) {
          throw { status: 400, message: "This email is already used" };
        } else {
          const salt: string = uid2(20);
          const hash: string = SHA256(password + salt).toString(encBase64);
          const token: string = uid2(20);

          const newUser = new User({
            username,
            email,
            salt,
            token,
            hash,
            photo: [],
          });

          if (req.files) {
            const pictureToUpload: UploadedFile | UploadedFile[] | undefined =
              req.files.picture;
            const result = await cloudinary.uploader.upload(
              convertToBase64(pictureToUpload),
              {
                folder: `/GiveMovies/users/${newUser._id}`,
              }
            );

            newUser.photo.push(result);
          }

          await newUser.save();

          res.status(200).json({ token: newUser.token, id: newUser._id });
        }
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
      console.log(searchUser);
      if (searchUser && !searchUser.isDeleted) {
        const isGoodPassword: string = SHA256(
          password + searchUser.salt
        ).toString(encBase64);
        if (isGoodPassword === searchUser.hash) {
          res.status(200).json({ token: searchUser.token, id: searchUser._id });
        } else {
          throw { status: 400, message: "email or password is incorrect" };
        }
      } else {
        throw { status: 400, message: "email or password is incorrect" };
      }
    } else {
      res.status(401).json({ token: null });
    }
  } catch (error: any) {
    res.status(500 || error.status).json({ message: error.message });
  }
});

userRouter.put(
  "/profile/email",
  isAuthenticated,
  (req: Request, res: Response) => {
    const { email } = req.body;

    try {
      if (email && typeof email === "string") {
        const userChangeMail = req.user;
        if (userChangeMail.email !== email) {
          userChangeMail.email = email;
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

userRouter.post(
  "/profile/picture",
  isAuthenticated,
  fileUpload(),
  async (req: Request, res: Response) => {
    try {
      if (req.files) {
        const pictureToUpload: UploadedFile | UploadedFile[] | undefined =
          req.files?.picture;
        const result = await cloudinary.uploader.upload(
          convertToBase64(pictureToUpload),
          {
            folder: `/GiveMovies/users/${req.user._id}`,
          }
        );
        req.user.photo.push(result);
        req.user.save();
        res.status(200).json({ message: "picture uploaded" });
      } else {
        throw { status: 400, message: "missing picture to transfer" };
      }
    } catch (error: any) {
      res.status(500 || error.status).json({ message: error.message });
    }
  }
);

userRouter.put(
  "/profile/picture",
  isAuthenticated,
  fileUpload(),
  async (req: Request, res: Response) => {
    try {
      if (req.files) {
        await cloudinary.uploader.destroy(req.user.photo[0].public_id);
        const pictureToUpload: UploadedFile | UploadedFile[] | undefined =
          req.files?.picture;
        const result = await cloudinary.uploader.upload(
          convertToBase64(pictureToUpload),
          {
            folder: `/GiveMovies/users/${req.user._id}`,
          }
        );
        req.user.photo = [];
        req.user.photo.push(result);
        req.user.markModified("photo");
        await req.user.save();
        res.status(200).json(req.user);
      } else {
        throw { status: 400, message: "missing picture to transfer" };
      }
    } catch (error: any) {
      res.status(500 || error.status).json({ message: error.message });
    }
  }
);

userRouter.delete(
  "/profile/picture",
  isAuthenticated,
  async (req: Request, res: Response) => {
    try {
      await cloudinary.uploader.destroy(req.user.photo[0].public_id);
      await cloudinary.api.delete_folder(req.user.photo[0].folder);
      req.user.photo = [];
      req.user.markModified("photo");
      req.user.save();

      res.status(200).json({ message: "picture deleted" });
    } catch (error: any) {
      res.status(500 || error.status).json({ message: error.message });
    }
  }
);

userRouter.delete(
  "/profile/user",
  isAuthenticated,
  async (req: Request, res: Response) => {
    try {
      req.user.username = "deleted account";
      req.user.email = "";
      req.user.salt = "";
      req.user.token = "";
      req.user.hash = "";
      req.user.isDeleted = true;
      if (req.user.photo.length > 0) {
        await cloudinary.uploader.destroy(req.user.photo[0].public_id);
        await cloudinary.api.delete_folder(req.user.photo[0].folder);
        req.user.photo = [];
        req.user.markModified("photo");
      }
      await req.user.save();
      res.status(200).json({ message: "the user have been deleted" });
    } catch (error: any) {
      res.status(500 || error.status).json({ message: error.message });
    }
  }
);
