import express from 'express';
import passport from "passport";
import { applicationLogin } from '../controller/authController.js';
import { createNewUser, makeNewLink, useCustomLink, removeTokenFromUser } from '../controller/userController.js';
import rateLimit from 'express-rate-limit';

const apiLimiter = rateLimit({
    windowMs: process.env.RATE_LIMIT_WINDOW_MS,
    max: process.env.RATE_LIMIT_MAX,
    message: "Too many requests from this IP, please try again after 15 minutes"
});

const router = express.Router();
router.post("/login", apiLimiter, applicationLogin);
router.post("/create-user", passport.authenticate('jwt', { session: false }), createNewUser);

router.post("/make-link", passport.authenticate('jwt', { session: false }), makeNewLink);
router.get("/use-custom-link", passport.authenticate('jwt', { session: false }),useCustomLink);
router.post("/kickout", passport.authenticate('jwt', { session: false }), removeTokenFromUser);


export default router;
