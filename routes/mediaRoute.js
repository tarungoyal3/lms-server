import express from "express";
import { uploadMedia } from "../utils/cloudinary.js";
import upload from "../utils/multer.js"

const router = express.Router();

router.post("/upload-video",upload.single("file"),async(req,res)=>{
    try {
        const result = await uploadMedia(req.file.path);
        res.status(200).json({
            success:true,
            message:"File uploaded successfully",
            data:result
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Error uploading file"
        })
    }
});


export default router;