import express, { NextFunction, Request, Response } from "express";
import { AuthControllers } from "./auth.controller";
import { Role } from "../user/user.interface";
import checkAuth from "../../middlewares/checkAuth";
const router = express.Router();
import passport from "passport";

router.post("/login", AuthControllers.credentialLogin)
router.post("/refresh-token", AuthControllers.getNewAccessToken)
router.post("/logout", AuthControllers.logout);
router.post("/reset-password", checkAuth(...Object.values(Role)), AuthControllers.logout);

router.get("/google", async (req : Request, res : Response, next : NextFunction) => {
    const redirect = req.query.redirect;
    passport.authenticate("google", {scope: ["profile", "email"], state: redirect as string})(req, res, next)
});

router.get("/google/callback", passport.authenticate("google", {failureRedirect: "login"}), AuthControllers.googleCallbackController)
export const AuthRoutes = router;
