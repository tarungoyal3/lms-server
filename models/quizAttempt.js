import mongoose from "mongoose";

const quizAttemptSchema = new mongoose.Schema({
  userId: String,
  courseId: String,
  score: Number,
  submittedAnswers: [String],
});

export default mongoose.model("QuizAttempt", quizAttemptSchema);
