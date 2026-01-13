import { Router } from "express";
import userControllers from "../controllers/user.controllers";
import { authLogin, authLogout } from "../middleware/auth.middleware";

const userRouter = Router();

userRouter.post("/signup", authLogout, userControllers.signUp);
userRouter.post("/login", authLogout, userControllers.logIn);
userRouter.post("/logout", authLogin, userControllers.logOut);
userRouter.get("/profile", authLogin, userControllers.getCurrentUser);
userRouter.put("/change-password", authLogin, userControllers.changePassword);

export default userRouter;