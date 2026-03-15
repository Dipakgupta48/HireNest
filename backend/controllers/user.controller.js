import { Readable } from "stream";
import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

export const register = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, password, role } = req.body;
         
        if (!fullname || !email || !phoneNumber || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        }

        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                message: "User already exist with this email.",
                success: false,
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        let profilePhoto = "";

        await User.create({
            fullname,
            email,
            phoneNumber,
            password: hashedPassword,
            role,
            profile:{
                profilePhoto: profilePhoto,
                bio: "",
                skills: [],
                resume: "",
                resumeOriginalName: ""
            }
        });

        return res.status(201).json({
            message: "Account created successfully.",
            success: true
        });

    } catch (error) {
        console.log(error);
    }
}


export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        
        if (!email || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        }

        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false,
            })
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false,
            })
        }

        if (role !== user.role) {
            return res.status(400).json({
                message: "Account doesn't exist with current role.",
                success: false
            })
        }

        const tokenData = {
            userId: user._id
        }

        const token = jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' });

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        }

        return res.status(200)
        .cookie("token", token, { 
            maxAge: 1 * 24 * 60 * 60 * 1000, 
            httpOnly: true, 
            sameSite: 'strict' 
        })
        .json({
            message: `Welcome back ${user.fullname}`,
            user,
            success: true
        })

    } catch (error) {
        console.log(error);
    }
}


export const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "Logged out successfully.",
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}


export const updateProfile = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, bio, skills } = req.body;
        
        const file = req.file;
        let cloudResponse;

        if (file) {
            const fileUri = getDataUri(file);
            // Upload resume as a raw file (PDF, DOCX, etc.) so it can be downloaded/viewed correctly
            cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
                resource_type: "raw"
            });
        }

        let skillsArray;
        if(skills){
            skillsArray = skills.split(",");
        }

        const userId = req.id;
        let user = await User.findById(userId);

        if (!user) {
            return res.status(400).json({
                message: "User not found.",
                success: false
            })
        }

        if(fullname) user.fullname = fullname
        if(email) user.email = email
        if(phoneNumber) user.phoneNumber = phoneNumber
        if(bio) user.profile.bio = bio
        if(skills) user.profile.skills = skillsArray

        if (cloudResponse) {
            // Build a URL that forces file download with the correct name & extension
            const resumeUrl = cloudinary.url(cloudResponse.public_id, {
                resource_type: "raw",
                flags: "attachment",
                filename: file.originalname
            });

            user.profile.resume = resumeUrl;
            user.profile.resumeOriginalName = file.originalname;
        }

        await user.save();

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        }

        return res.status(200).json({
            message:"Profile updated successfully.",
            user,
            success:true
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Something went wrong while updating profile.",
            success: false
        });
    }
}

export const getResume = async (req, res) => {
    try {
        const targetUserId = req.params.userId || req.id;
        const isOwnResume = !req.params.userId;

        if (!isOwnResume) {
            const currentUser = await User.findById(req.id).select("role");
            if (currentUser?.role !== "recruiter") {
                return res.status(403).json({ message: "Not allowed to download this resume.", success: false });
            }
        }

        const user = await User.findById(targetUserId).select("profile.resume profile.resumeOriginalName");
        if (!user?.profile?.resume) {
            return res.status(404).json({ message: "Resume not found.", success: false });
        }

        const filename = user.profile.resumeOriginalName || "resume.pdf";
        const fetchRes = await fetch(user.profile.resume, { redirect: "follow" });
        if (!fetchRes.ok) {
            return res.status(502).json({ message: "Failed to fetch resume.", success: false });
        }
        const safeName = filename.replace(/"/g, '\\"');
        res.setHeader("Content-Disposition", `attachment; filename="${safeName}"`);
        const contentType = fetchRes.headers.get("content-type");
        if (contentType) res.setHeader("Content-Type", contentType);
        const nodeStream = Readable.fromWeb(fetchRes.body);
        nodeStream.pipe(res);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong.", success: false });
    }
};

export const updateProfilePhoto = async (req, res) => {
    try {
        const file = req.file;

        if (!file) {
            return res.status(400).json({
                message: "Profile photo file is required.",
                success: false
            });
        }

        const fileUri = getDataUri(file);
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content);

        const userId = req.id;
        let user = await User.findById(userId);

        if (!user) {
            return res.status(400).json({
                message: "User not found.",
                success: false
            });
        }

        user.profile.profilePhoto = cloudResponse.secure_url;
        await user.save();

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        };

        return res.status(200).json({
            message: "Profile photo updated successfully.",
            user,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Something went wrong while updating profile photo.",
            success: false
        });
    }
}