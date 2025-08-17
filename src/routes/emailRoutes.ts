// email-service/src/routes/emailRoutes.ts
import { Router } from 'express';
import { sendEmail } from '../controllers/email.Controller';

const router = Router();

router.post('/sendEmail', sendEmail);

export default router;
