import express from "express";
import { UserControllers } from "./user.controller";

const router = express.Router();

router.post("/register", UserControllers.createUser);
router.get("/all-user", UserControllers.getAllUsers);

export const UserRoutes = router;