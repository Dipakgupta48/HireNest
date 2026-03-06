import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { getAdminJobs, getAllJobs, getJobById, postJob } from "../controllers/job.controller.js";

const router = express.Router();

// recruiter posts job
router.route("/post").post(isAuthenticated, postJob);

// public route (no login required)
router.route("/get").get(getAllJobs);

// recruiter dashboard jobs
router.route("/getadminjobs").get(isAuthenticated, getAdminJobs);

// job details
router.route("/get/:id").get(getJobById);

export default router;
