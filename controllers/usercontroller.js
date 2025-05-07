import { User } from "../models/usermodel.js";
import bcrypt from "bcryptjs"
import { generateToken } from "../utils/generateToken.js";
import { deleteMediaFromCloudinary, uploadMedia } from "../utils/cloudinary.js";


export const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        // Check if the user already exists
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                success: false,
                message: "User already exists",
            });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the user
        await User.create({
            name,
            email,
            password: hashedPassword,
            role: role || "student",
        });

        // Successful registration response
        return res.status(201).json({
            success: true,
            message: "Account created successfully",
        });
    } catch (err) {
        console.error("Registration Error:", err);
        return res.status(500).json({
            success: false,
            message: "Failed to register",
        });
    }
};




export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid username or password"
            });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid username or password"
            });
        }

        // Generate token and return user data
        generateToken(res, user, `Welcome back ${user.name}`);

        // return res.status(200).json({
        //     success: true,
        //     message: "Login successful",
        //     user: {
        //         _id: user._id,
        //         name: user.name,
        //         email: user.email,
        //         role: user.role,
        //     },
        // });

    } catch (err) {
        console.error("Error during login:", err);
        return res.status(500).json({
            success: false,
            message: "Failed to login"
        });
    }
};


export const logout = async(_,res)=>{
    try{
        return res.status(200).cookie("token","",{maxAge:0}).json({
            success:true,
            message:"Logged Out Successfully."
        })
    }
    catch(err){
        console.error("Error during login:", err);
        return res.status(500).json({
            success: false,
            message: "Failed to logout"
        });
    }
};


export const getUserProfile = async(req,res)=>{
    try {
        const userId = req.id;
        const user = await User.findById(userId).select("-password").populate("enrolledCourses");
        if(!user){
            return res.status(404).json({
                success:false,
                message:"Profile not found"
            })
        }
        return res.status(200).json({
            success:true,
            user
        })
    } catch (err) {
        console.error("Error during login:", err);
        return res.status(500).json({
            success: false,
            message: "Failed to load user"
        });
    }
}


export const updateProfile = async(req,res)=>{
    try {
        const userId = req.id;
        const {name} = req.body;
        const profilephoto = req.file

        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({
                message:"User not found",
                success:false
            })
        }
        //extract public id of the old photo from the url if it exists
        if(user.photoUrl){
            const publicId = user.photoUrl.split("/").pop().split(".")[0]; //extract public id
            deleteMediaFromCloudinary(publicId)
        }

        //upload new photo
        const cloudResponse = await uploadMedia(profilephoto.path)
        const photoUrl = cloudResponse.secure_url;

        const updatedData = {name,photoUrl}
        const updatedUser = await User.findByIdAndUpdate(userId,updatedData,{new:true}).select("-password")

        return res.status(200).json({
            success:true,
            user:updatedUser,
            message:"Profile updated successfully."
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:true,
            message:"Failed to update profile"
        })
    }
}



