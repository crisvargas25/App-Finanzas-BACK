import express from "express";
import { createNewMenu, deleteMenu, getMenusByRole } from "../controllers/menu.controller";



const router = express.Router();

router.post('/createNewCategory', createNewMenu);
router.get('/getMenuByRole', getMenusByRole);
router.patch('/deleteMenu/:id', deleteMenu);

export default router;