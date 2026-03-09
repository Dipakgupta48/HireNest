import multer from "multer";

const storage = multer.memoryStorage();

// The field name must match what you expect in company.controller.js
export const singleUpload = multer({ storage }).single("logo");

// Separate upload middleware for profile photo
export const profilePhotoUpload = multer({ storage }).single("profilePhoto");