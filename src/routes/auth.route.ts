import { Router } from 'express';
import { login, getTimeToken, updateToken, resetPassword, forgotPassword } from '../controllers/auth.controller';

// Import the login function from the controller
const router = Router();

router.post('/login', login); // POST /api/auth/login
router.post('/gettime', getTimeToken);
router.get('/update', updateToken); // GET /api/auth/update?userId=123456
router.post('/reset', resetPassword); // POST /api/auth/reset-password
router.post('/forgot', forgotPassword); // POST /api/auth/forgot-password


export default router;
