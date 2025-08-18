import { Router } from "express";
import {
  createBudget,
  deleteBudget,
  getBudgetById,
  getBudgets,
  updateBudget,
} from "../controllers/budget.controller";

// Rutas para presupuestos
const router = Router();

// Crear un nuevo presupuesto
router.post('/create', createBudget);
// Obtener todos los presupuestos (filtrado opcional por userId)
router.get('/getall', getBudgets);
// Obtener un presupuesto por id
router.get('/get/:id', getBudgetById);
// Actualizar un presupuesto
router.put('/update/:id', updateBudget);
// Eliminar lógicamente un presupuesto
router.delete('/delete/:id', deleteBudget);

export default router;