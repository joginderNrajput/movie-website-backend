import express from "express";
import { deleteUser, getAllUsers, getBookingsOfUser, login, signup, updadeUser } from "../controllers/user-controller";

const userRouter = express.Router();
userRouter.get("/", getAllUsers);
userRouter.post("/signup", signup);
userRouter.put("/:id", updadeUser);
userRouter.delete("/:id", deleteUser);
userRouter.post("/login",login)
userRouter.get("/bookings/:id", getBookingsOfUser);

export default userRouter;