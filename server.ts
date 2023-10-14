import express, { Request, Response } from "express";
import { envVariables } from "./src/zodFolder/envVariables";
import { movieRouter } from "./src/routes/movies";
import { authRouter } from "./src/routes/Authentificate";
const { PORT, NODE_ENV, APIKEY } = envVariables;

const app = express();

app.use(express.json()).use(movieRouter).use(authRouter);

app.get("/", (req: Request, res: Response) => {
  try {
    res.status(200).json({ message: "bienvenue sur film" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Sorry, the application is temporary disabled" });
  }
});

app.listen(PORT, () => {
  console.log(`server has started in port ${PORT} in ${NODE_ENV} mode  `);
});
