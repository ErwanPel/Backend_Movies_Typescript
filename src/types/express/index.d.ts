import { UserModel } from "src/interface-models/user-token";

export {};

declare global {
  namespace Express {
    interface Request {
      user?: UserModel;
    }
  }
}
