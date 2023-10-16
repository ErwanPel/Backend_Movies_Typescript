import { User } from "../models/User";
import { Request, Response, NextFunction } from "express-serve-static-core";

export const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.headers.authorization) {
    console.log("je suis dans le middleware");
    const sentToken = req.headers.authorization.replace("Bearer ", "");

    const findUser = await User.findOne({ token: sentToken });

    if (findUser) {
      console.log("autorisé");
      req.user = findUser;

      next();
    } else {
      res.status(401).json("unauthorized");
    }
  } else {
    res.status(401).json("unauthorized");
  }
};
