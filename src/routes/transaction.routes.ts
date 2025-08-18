import { Router } from "express";
import {
  createTransaction,
  deleteTransaction,
  getTransactionById,
  getTransactions,
  updateTransaction,
} from "../controllers/transaction.controller";

// Rutas para transacciones
const router = Router();

// Crear una nueva transacción
router.post('/create', createTransaction);
// Obtener todas las transacciones (filtrado opcional por userId)
router.get('/getall', getTransactions);
// Obtener una transacción por id
router.get('/get/:id', getTransactionById);
// Actualizar una transacción
router.put('/update/:id', updateTransaction);
// Eliminar lógicamente una transacción
router.delete('/delete/:id', deleteTransaction);

export default router;