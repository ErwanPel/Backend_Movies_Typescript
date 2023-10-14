import express, { Request, Response } from "express";

export const authRouter = express.Router();

authRouter.post("/login", (req: Request, res: Response) => {
  try {
    if (req.body.password.length >= 10) {
      res.status(200).json({ token: "secret-token" });
    } else {
      res.status(401).json({ token: null });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Sorry, the application is temporary disabled" });
  }
});
