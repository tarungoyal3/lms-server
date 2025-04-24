import { Course } from "../models/coursemodel.js"
import { Lecture } from "../models/lecturemodel.js"
import { deleteMediaFromCloudinary, deleteVideoFromCloudinary, uploadMedia } from "../utils/cloudinary.js"

//create course
export const createCourse = async (req, res) => {
    try {
        const { courseTitle, category } = req.body
        if (!courseTitle || !category) {
            return res.status(400).json({
                message: "Course title and category is required."
            })
        }

        const course = await Course.create({
            courseTitle,
            category,
            creator: req.id
        })

        return res.status(200).json({
            course,
            message: "Course created."
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to create course"
        })
    }
}

export const searchCourse = async(req,res)=>{
    try {
        const {query = "",categories=[],sortByPrice = ""} = req.query;

        //create search query
        const searchCriteria = {
            isPublished:true,
            $or:[                                           // $or → Means match any of these:
                {courseTitle:{$regex:query,$options:"i"}},  //$regex is a MongoDB operator that means “pattern match” (like search)
                {subTitle:{$regex:query,$options:"i"}},     //$options: "i" → case-insensitive (so "python" matches "Python", "PYTHON", etc.)
                {category:{$regex:query,$options:"i"}}
            ]
        }

        //if category is selected
        if(categories.length>0){
            searchCriteria.category = {$in:categories}
        }

        //define sorting order
        const sortOptions = {};
        if(sortByPrice === "low"){
            sortOptions.coursePrice = 1;    //sort by price in ascending order
        }
        else if(sortByPrice === "high"){
            sortOptions.coursePrice = -1;   //descending
        }

        let courses = await Course.find(searchCriteria).populate({path:"creator",select:"name photoUrl"}).sort(sortOptions);

        return res.status(200).json({
            success:true,
            courses: courses || []
        })
    } catch (error) {
        console.log(error)
    }
}

//Logic to get published courses on home screen
export const getPublishedCourse = async (req,res) => {
    try {
        const courses = await Course.find({isPublished:true}).populate({path:"creator",select:"name photoUrl"})
        if(!courses){
            return res.status(404).json({
                message:"Course not found"
            })
        }
        return res.status(200).json({
            courses,
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to get published courses"
        })
    }
}

//get Creator course
export const getCreatorCourse = async (req, res) => {
    try {
        const userId = req.id;
        const courses = await Course.find({ creator: userId });
        if (!courses) {
            return res.status(404).json({
                courses: [],
                message: "Course not found"
            })
        }
        return res.status(200).json({
            courses,
        })
    } catch (error) {
        return res.status(500).json({
            message: "Failed to create course"
        })
    }
}

//Edit course Controller
export const editCourse = async (req, res) => {
    try {
        const courseId = req.params.courseId;
        const { courseTitle, subTitle, category, description, courseLevel, coursePrice } = req.body;
        const thumbnail = req.file;

        let course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                message: "Course not found"
            })
        }
        let courseThumbnail;
        if (thumbnail) {
            if (course.courseThumbnail) {
                const publicId = course.courseThumbnail.split("/").pop().split(".")[0];
                await deleteMediaFromCloudinary(publicId); //deleted old thumbnail so that new one can be updated
            }
            courseThumbnail = await uploadMedia(thumbnail.path) //uploading the new thumbnail on cloudinary
        }

        const updateData = { courseTitle, subTitle, category, description, courseLevel, coursePrice, courseThumbnail: courseThumbnail?.secure_url };
        course = await Course.findByIdAndUpdate(courseId, updateData, { new: true });
        return res.status(200).json({
            course,
            message: "Course updated successfully"
        })
    } catch (error) {
        return res.status(500).json({
            message: "Failed to create course"
        })
    }
}

// export const deleteCourse = async(req,res)=>{
//     try {
//         const {courseId} = req.params;
//     } catch (error) {
        
//     }
// }

//Controller for getting details of course with id.
export const getCourseById = async (req, res) => {
    try {
        const courseId = req.params.courseId;
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                message: "Course not found!"
            })
        }
        return res.status(200).json({
            course
        })
    } catch (error) {
        return res.status(500).json({
            message: "Failed to create course"
        })
    }
}

//Controller for create lecture
export const createLecture = async (req, res) => {
    try {
        const { lectureTitle } = req.body;
        const { courseId } = req.params;

        if (!lectureTitle || !courseId) {
            return res.status(400).json({
                message: "Lecture title is required."
            })
        }

        //create lecture
        const lecture = await Lecture.create({ lectureTitle });
        const course = await Course.findById(courseId);

        if (course) {
            course.lectures.push(lecture._id);
            await course.save();
        }
        return res.status(201).json({
            lecture,
            message: "Lecture created successfully"
        })
    } catch (error) {
        return res.status(500).json({
            message: "Failed to create course"
        })
    }
}


export const getCourseLecture = async (req, res) => {
    try {
        const { courseId } = req.params;
        const course = await Course.findById(courseId).populate("lectures");
        if (!course) {
            return res.status(404).json({
                message: "Course not found"
            })
        }
        return res.status(200).json({
            lectures: course.lectures,
        })
    } catch (error) {
        return res.status(500).json({
            message: "Failed to get lectures"
        })
    }
}


export const editLecture = async (req, res) => {
    try {
        const { lectureTitle, videoInfo, isPreviewFree } = req.body;
        const { courseId, lectureId } = req.params;
        const lecture = await Lecture.findById(lectureId);
        if (!lecture) {
            return res.status(404).json({
                message: "Lecture not found"
            })
        }
        if (lectureTitle) lecture.lectureTitle = lectureTitle;
        if (videoInfo?.publicId) lecture.publicId = videoInfo.publicId;
        if (videoInfo?.videoUrl) lecture.videoUrl = videoInfo.videoUrl;
        lecture.isPreviewFree = isPreviewFree;

        await lecture.save();

        //Ensure that the course still has the lecture id if it was not already added.
        const course = await Course.findById(courseId);
        if (course && !course.lectures.includes(lecture._id)) {
            course.lectures.push(lecture._id);
            await course.save();
        };
        return res.status(200).json({
            lecture,
            message: "Lecture updated successfully"
        })
    } catch (error) {
        return res.status(500).json({
            message: "Failed to edit lecture"
        })
    }
}


export const removeLecture = async (req, res) => {
    try {
        const { lectureId } = req.params;
        const lecture = await Lecture.findByIdAndDelete(lectureId);
        if (!lecture) {
            return res.status(404).json({
                message: "Lecture not found"
            })
        }
        //delete the lecture video from cloudinary as well
        if (lecture.publicId) {
            await deleteVideoFromCloudinary(lecture.publicId);
        }

        //Remove the lectures reference from the associated course from mongodb
        await Course.updateOne(
            { lectures: lectureId },   //find the course that contains the lecture
            { $pull: { lectures: lectureId } }    //Remove the lecture id from the lectures array
        );
        return res.status(200).json({
            message: "Lecture removed successfully"
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "Failed to remove lecture"
        })
    }
}

export const getLectureById = async (req, res) => {
    try {
        const { lectureId } = req.params;
        const lecture = await Lecture.findById(lectureId);
        if (!lecture) {
            return res.status(404).json({
                message: "Lecture not found!"
            })
        }
        return res.status(200).json({
            lecture
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "Failed to get lecture by id"
        })
    }
}


//logic to publish the course or not
export const togglePublishCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { publish } = req.query;
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                message: "Course not found!"
            })
        }
        course.isPublished = publish === "true";
        await course.save();

        const status = course.isPublished ? "Published" : "Unpublished"
        return res.status(200).json({
            message: `Course is ${status}`
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "Failed to update Course"
        })
    }
}