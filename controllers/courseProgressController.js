import { CourseProgress } from "../models/courseProgress.js";
import { Course } from "../models/coursemodel.js"

export const getCourseProgress = async (req, res) => {
    try {
        const { courseId } = req.params;
        const userId = req.id;

        //Getting the user course progress
        let courseProgress = await CourseProgress.findOne({ courseId, userId }).populate("courseId");
        const courseDetails = await Course.findById(courseId).populate("lectures");
        if (!courseDetails) {
            return res.status(404).json({
                message: "Course not found!"
            })
        }

        //If no progress then return the details of the course with an empty array progress
        if (!courseProgress) {
            return res.status(200).json({
                data: {
                    courseDetails,
                    progress:[],
                    completed:false
                }
            })
        }

        //There is user's course progress -> then return the progress with course details
        return res.status(200).json({
            data:{
                courseDetails,
                progress:courseProgress.lectureProgress,
                completed:courseProgress.completed
            }
        })
    } catch (error) {
        console.log(error)
    }
}


export const updateLectureProgress = async(req,res)=>{
    try {
        const {courseId,lectureId} = req.params;
        const userId = req.id;

        let courseProgress = await CourseProgress.findOne({courseId,userId});

        if(!courseProgress){
            //No progress exists in record means create a new record
            courseProgress = new CourseProgress({
                userId,
                courseId,
                completed:false,
                lectureProgress:[]
            })
        }

        //Find the lecture progress in the course progress
        const lectureIndex = courseProgress.lectureProgress.findIndex((lecture)=>lecture.lectureId === lectureId)
        if(lectureIndex!=-1){
            //Lecture already exists and update it's status
            courseProgress.lectureProgress[lectureIndex].viewed = true;
        }
        else{
            //add new lecture progresss
            courseProgress.lectureProgress.push({
                lectureId,
                viewed:true
            })
        }

        //If all lectures are completed
        const lectureProgressLength = courseProgress.lectureProgress.filter((lectureProg)=>lectureProg.viewed).length;  //Filter method returns an array that's why .length
        const course = await Course.findById(courseId);
        if(course.lectures.length === lectureProgressLength){
            courseProgress.completed = true;
        }
        await courseProgress.save();

        return res.status(200).json({
            message:"Lecture progress updated successfully."
        })
    } catch (error) {
        console.log(error)
    }
}


export const markAsCompleted = async(req,res)=>{
    try {
        const {courseId} = req.params;
        const userId = req.id

        const courseProgress = await CourseProgress.findOne({courseId,userId});
        if(!courseProgress){
            return res.status(404).json({
                message:"Course progress not found"
            })
        }
        courseProgress.lectureProgress.map((lectureProg)=>lectureProg.viewed = true);
        courseProgress.completed = true;
        await courseProgress.save();
        return res.status(200).json({
            message:"Course marked as completed."
        })
    } catch (error) {
        console.log(error)
    }
}

export const markAsInCompleted = async(req,res)=>{
    try {
        const {courseId} = req.params;
        const userId = req.id

        const courseProgress = await CourseProgress.findOne({courseId,userId});
        if(!courseProgress){
            return res.status(404).json({
                message:"Course progress not found"
            })
        }
        courseProgress.lectureProgress.map((lectureProg)=>lectureProg.viewed = false);
        courseProgress.completed = false;
        await courseProgress.save();
        return res.status(200).json({
            message:"Course marked as Incompleted."
        })
    } catch (error) {
        console.log(error)
    }
}