import { Router } from "express";
import {
  createFinanceCategory,
  deleteFinanceCategory,
  getFinanceCategories,
  getFinanceCategoryById,
  updateFinanceCategory,
} from "../controllers/financeCategory.controller";

// Rutas para categorías financieras
const router = Router();

// Crear una nueva categoría financiera
router.post('/create', createFinanceCategory);
// Obtener todas las categorías financieras (filtrado opcional por userId)
router.get('/getall', getFinanceCategories);
// Obtener una categoría financiera por id
router.get('/get/:id', getFinanceCategoryById);
// Actualizar una categoría financiera
router.put('/update/:id', updateFinanceCategory);
// Eliminar lógicamente una categoría financiera
router.delete('/delete/:id', deleteFinanceCategory);

export default router;