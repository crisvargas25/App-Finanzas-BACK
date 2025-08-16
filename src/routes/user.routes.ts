import { Router } from 'express';
import { createUser, deleteUser, getAllUsers, getUserById, updateUser, getAdmins } from '../controllers/user.controller';

// Import the login function from the controller
const router = Router();

router.post('/register', createUser);
router.get('/getall', getAllUsers)
router.get('/get/:id', getUserById)
router.delete('/delete/:id', deleteUser);
router.put('/update/:id', updateUser);
router.get('/getadmins', getAdmins); 


// 6835f40622f94c7f62673f9c


export default router;
