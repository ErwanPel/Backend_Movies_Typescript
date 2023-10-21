import { TUser } from "../models/User";

export {};

declare global {
  namespace Express {
    interface Request {
      user?: TUser | undefined;
    }
  }
}
