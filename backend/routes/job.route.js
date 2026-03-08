import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { postJob, getAllJobs, getJobById, getAdminJobs } from "../controllers/job.controller.js";

const router = express.Router();

// Recruiter posts a job
router.post("/post", isAuthenticated, postJob);

// Students fetch all jobs
router.get("/get", getAllJobs);

// Recruiter dashboard jobs
router.get("/getadminjobs", isAuthenticated, getAdminJobs);

// Get single job details
router.get("/get/:id", getJobById);

export default router;