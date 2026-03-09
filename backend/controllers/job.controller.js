import { Job } from "../models/job.model.js";

// Admin posts job
export const postJob = async (req, res) => {
    try {
        const {
            title,
            description,
            requirements,
            salary,
            location,
            jobType,
            experienceLevel,
            position,
            companyId
        } = req.body;

        const userId = req.id;

        if (!title || !description || !requirements || !salary || !location || !jobType || !experienceLevel || !position || !companyId) {
            return res.status(400).json({
                message: "Something is missing.",
                success: false
            });
        }

        const numericSalary = Number(salary);
        const numericExperience = Number(experienceLevel);

        if (Number.isNaN(numericSalary) || Number.isNaN(numericExperience)) {
            return res.status(400).json({
                message: "Salary and experience level must be valid numbers.",
                success: false
            });
        }

        const job = await Job.create({
            title,
            description,
            requirements: requirements.split(","),
            salary: numericSalary,
            location,
            jobType,
            experienceLevel: numericExperience,
            position,
            company: companyId,
            created_by: userId
        });

        return res.status(201).json({
            message: "New job created successfully.",
            job,
            success: true
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error while posting job.",
            success: false
        });
    }
};

// Admin updates job
export const updateJob = async (req, res) => {
    try {
        const jobId = req.params.id;
        const {
            title,
            description,
            requirements,
            salary,
            location,
            jobType,
            experienceLevel,
            position,
            companyId
        } = req.body;

        let job = await Job.findById(jobId);

        if (!job) {
            return res.status(404).json({
                message: "Job not found.",
                success: false
            });
        }

        if (title) job.title = title;
        if (description) job.description = description;
        if (requirements) job.requirements = requirements.split(",");
        if (salary) {
            const numericSalary = Number(salary);
            if (Number.isNaN(numericSalary)) {
                return res.status(400).json({
                    message: "Salary must be a valid number.",
                    success: false
                });
            }
            job.salary = numericSalary;
        }
        if (location) job.location = location;
        if (jobType) job.jobType = jobType;
        if (experienceLevel) {
            const numericExperience = Number(experienceLevel);
            if (Number.isNaN(numericExperience)) {
                return res.status(400).json({
                    message: "Experience level must be a valid number.",
                    success: false
                });
            }
            job.experienceLevel = numericExperience;
        }
        if (position) {
            const numericPosition = Number(position);
            if (Number.isNaN(numericPosition)) {
                return res.status(400).json({
                    message: "Position must be a valid number.",
                    success: false
                });
            }
            job.position = numericPosition;
        }
        if (companyId) {
            job.company = companyId;
        }

        await job.save();

        return res.status(200).json({
            message: "Job updated successfully.",
            job,
            success: true
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error while updating job.",
            success: false
        });
    }
};


// Get all jobs (for students)
export const getAllJobs = async (req, res) => {
    try {

        const keyword = req.query.keyword || "";

        const query = {
            $or: [
                { title: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } },
                { location: { $regex: keyword, $options: "i" } }
            ]
        };

        const jobs = await Job.find(query)
            .populate("company")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            jobs,
            success: true
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error while fetching jobs.",
            success: false
        });
    }
};


// Get job by ID
export const getJobById = async (req, res) => {
    try {

        const jobId = req.params.id;

        const job = await Job.findById(jobId).populate({
            path: "applications"
        });

        if (!job) {
            return res.status(404).json({
                message: "Job not found.",
                success: false
            });
        }

        return res.status(200).json({
            job,
            success: true
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error while fetching admin jobs.",
            success: false
        });
    }
};


// Admin jobs
export const getAdminJobs = async (req, res) => {
    try {

        const adminId = req.id;

        const jobs = await Job.find({ created_by: adminId })
            .populate("company")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            jobs,
            success: true
        });

    } catch (error) {
        console.log(error);
    }
};