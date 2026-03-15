import express from "express";
import { login, logout, register, updateProfile, updateProfilePhoto, getResume } from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { singleUpload, profilePhotoUpload } from "../middlewares/mutler.js";

const router = express.Router();

router.route("/register").post(singleUpload, register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/profile/update").post(isAuthenticated, singleUpload, updateProfile);
router.route("/profile/photo").post(isAuthenticated, profilePhotoUpload, updateProfilePhoto);
router.route("/profile/resume").get(isAuthenticated, getResume);
router.route("/profile/resume/:userId").get(isAuthenticated, getResume);

export default router;