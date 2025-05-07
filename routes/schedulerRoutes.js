import express from 'express';
import { generateSchedule } from '../controllers/schedulerController.js';

const router = express.Router();

router.post('/generate-schedule', generateSchedule);

export default router;
