// email-service/src/routes/emailRoutes.ts
import { Router } from 'express';
import { sendEmail } from '../controllers/emailControllers';

const router = Router();

router.post('/sendEmail', sendEmail);

export default router;
