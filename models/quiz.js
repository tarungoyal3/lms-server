import mongoose from "mongoose";

const quizSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  questions: [
    {
      question: { type: String, required: true },
      options: {
        A: String,
        B: String,
        C: String,
        D: String
      },
      correctAnswer: { type: String, required: true },
      explanation: { type: String }
    }
  ]
});

const Quiz = mongoose.model('Quiz', quizSchema);

export default Quiz;
