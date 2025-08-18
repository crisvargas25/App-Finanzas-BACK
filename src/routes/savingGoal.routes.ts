import { Router } from "express";
import {
  createSavingGoal,
  deleteSavingGoal,
  getSavingGoalById,
  getSavingGoals,
  updateSavingGoal,
} from "../controllers/savingGoal.controller";

// Rutas para metas de ahorro
const router = Router();

// Crear una nueva meta de ahorro
router.post('/create', createSavingGoal);
// Obtener todas las metas de ahorro (filtrado opcional por userId)
router.get('/getall', getSavingGoals);
// Obtener una meta de ahorro por id
router.get('/get/:id', getSavingGoalById);
// Actualizar una meta de ahorro
router.put('/update/:id', updateSavingGoal);
// Eliminar lógicamente una meta de ahorro
router.delete('/delete/:id', deleteSavingGoal);

export default router;