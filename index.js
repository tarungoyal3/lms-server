import express from "express"
import dotenv from "dotenv"
import connectDB from "./database/db.js";  //At the time of import use extension too
import userRoute from "./routes/userRoute.js"
import cookieParser from "cookie-parser";
import cors from "cors"
import courseRoute from "./routes/courseRoute.js"
import mediaRoute from "./routes/mediaRoute.js"
import purchaseRoute from "./routes/purchaseCourseRoute.js"
import courseProgressRoute from "./routes/courseProgressRoute.js"

//load the dotenv file
dotenv.config();
const PORT = process.env.PORT;

//connecting the DB
connectDB();

const app = express();

//default middlewares
app.use(express.json())
app.use(cookieParser())
// app.use(cors({
//     origin:"http://localhost:5173",
//     credentials:true
// }))

app.use(cors({
    origin: ["http://localhost:5173", "https://lms-client-sage.vercel.app"], // add your deployed URL
    credentials: true
}));


//apis
//https://localhost:8080/api/v1/user/register
app.use("/api/v1/media",mediaRoute)
app.use("/api/v1/user",userRoute)
app.use("/api/v1/course",courseRoute)
app.use("/api/v1/purchase",purchaseRoute);
app.use("/api/v1/progress",courseProgressRoute);

app.get("/home",(_,res)=>{
    res.status(200).json({
        success:true,
        message:"Coming from backend"
    })
})

app.listen(PORT,()=>{
    console.log(`app is listening on port: ${PORT}`)
})