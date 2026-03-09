import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { postJob, getAllJobs, getJobById, getAdminJobs, updateJob } from "../controllers/job.controller.js";

const router = express.Router();

// Recruiter posts a job
router.post("/post", isAuthenticated, postJob);

// Recruiter updates a job
router.put("/update/:id", isAuthenticated, updateJob);

// Students fetch all jobs
router.get("/get", getAllJobs);

// Recruiter dashboard jobs
router.get("/getadminjobs", isAuthenticated, getAdminJobs);

// Get single job details
router.get("/get/:id", getJobById);

export default router;