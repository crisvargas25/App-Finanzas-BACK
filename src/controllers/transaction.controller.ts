import { Request, Response } from "express";
import { Types } from "mongoose";
import { Transaction } from "../models/transactionModel";

/**
 * Controlador para gestionar transacciones financieras (ingresos y gastos).
 */

// Crear una nueva transacción
export const createTransaction = async (req: Request, res: Response) => {
  try {
    const {
      userId,
      type,
      monto,
      fecha,
      categoriaId,
      presupuestoId,
      nota,
    }: {
      userId: string;
      type: string;
      monto: number;
      fecha: string | Date;
      categoriaId: string;
      presupuestoId?: string;
      nota?: string;
    } = req.body;

    // Validar campos obligatorios
    if (!userId || !type || monto === undefined || !fecha || !categoriaId) {
      return res.status(400).json({ message: "Los campos 'userId', 'type', 'monto', 'fecha' y 'categoriaId' son obligatorios" });
    }
    if (!Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "userId no es un identificador válido" });
    }
    if (!["ingreso", "gasto"].includes(type)) {
      return res.status(400).json({ message: "type debe ser 'ingreso' o 'gasto'" });
    }
    if (!Types.ObjectId.isValid(categoriaId)) {
      return res.status(400).json({ message: "categoriaId no es un identificador válido" });
    }
    let budgetId: Types.ObjectId | undefined;
    if (presupuestoId) {
      if (!Types.ObjectId.isValid(presupuestoId)) {
        return res.status(400).json({ message: "presupuestoId no es un identificador válido" });
      }
      budgetId = new Types.ObjectId(presupuestoId);
    }
    const date = new Date(fecha);
    if (isNaN(date.getTime())) {
      return res.status(400).json({ message: "fecha no es válida" });
    }

    const transaction = await Transaction.create({
      userId,
      type,
      monto,
      fecha: date,
      categoriaId,
      presupuestoId: budgetId,
      nota: nota?.trim(),
    });

    return res.status(201).json({ message: "Transacción creada correctamente", transaction });
  } catch (error: any) {
    console.error("Error al crear transacción:", error);
    return res.status(500).json({ message: "Ocurrió un error al crear la transacción", error: error.message });
  }
};

// Obtener todas las transacciones de un usuario (o todas si no se especifica usuario)
export const getTransactions = async (req: Request, res: Response) => {
  try {
    const { userId } = req.query as { userId?: string };
    const filter: any = { status: true };
    if (userId) {
      if (!Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: "userId no es un identificador válido" });
      }
      filter.userId = userId;
    }
    const transactions = await Transaction.find(filter)
      .populate("categoriaId")
      .populate("presupuestoId");
    return res.status(200).json(transactions);
  } catch (error) {
    console.error("Error al obtener transacciones:", error);
    return res.status(500).json({ message: "Ocurrió un error al obtener las transacciones" });
  }
};

// Obtener una transacción por id
export const getTransactionById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Id no válido" });
    }
    const transaction = await Transaction.findById(id)
      .populate("categoriaId")
      .populate("presupuestoId");
    if (!transaction || !transaction.status) {
      return res.status(404).json({ message: "Transacción no encontrada" });
    }
    return res.status(200).json(transaction);
  } catch (error) {
    console.error("Error al obtener transacción:", error);
    return res.status(500).json({ message: "Ocurrió un error al obtener la transacción" });
  }
};

// Actualizar una transacción
export const updateTransaction = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Id no válido" });
    }
    const transaction = await Transaction.findById(id);
    if (!transaction || !transaction.status) {
      return res.status(404).json({ message: "Transacción no encontrada" });
    }
    const {
      type,
      monto,
      fecha,
      categoriaId,
      presupuestoId,
      nota,
      status,
    }: Partial<{ type: string; monto: number; fecha: string | Date; categoriaId: string; presupuestoId: string; nota: string; status: boolean }> = req.body;

    if (type) {
      if (!["ingreso", "gasto"].includes(type)) {
        return res.status(400).json({ message: "type debe ser 'ingreso' o 'gasto'" });
      }
      transaction.type = type as any;
    }
    if (monto !== undefined) transaction.monto = monto;
    if (fecha) {
      const d = new Date(fecha);
      if (isNaN(d.getTime())) {
        return res.status(400).json({ message: "fecha no es válida" });
      }
      transaction.fecha = d;
    }
    if (categoriaId) {
      if (!Types.ObjectId.isValid(categoriaId)) {
        return res.status(400).json({ message: "categoriaId no es un identificador válido" });
      }
      transaction.categoriaId = new Types.ObjectId(categoriaId);
    }
    if (presupuestoId) {
      if (!Types.ObjectId.isValid(presupuestoId)) {
        return res.status(400).json({ message: "presupuestoId no es un identificador válido" });
      }
      transaction.presupuestoId = new Types.ObjectId(presupuestoId);
    }
    if (nota !== undefined) transaction.nota = nota.trim();
    if (typeof status === "boolean") {
      transaction.status = status;
      if (!status) {
        transaction.deleteDate = new Date();
      }
    }

    await transaction.save();
    return res.status(200).json({ message: "Transacción actualizada correctamente", transaction });
  } catch (error: any) {
    console.error("Error al actualizar transacción:", error);
    return res.status(500).json({ message: "Ocurrió un error al actualizar la transacción", error: error.message });
  }
};

// Eliminar lógicamente una transacción
export const deleteTransaction = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Id no válido" });
    }
    const transaction = await Transaction.findById(id);
    if (!transaction || !transaction.status) {
      return res.status(404).json({ message: "Transacción no encontrada" });
    }
    transaction.status = false;
    transaction.deleteDate = new Date();
    await transaction.save();
    return res.status(200).json({ message: "Transacción eliminada correctamente", transaction });
  } catch (error) {
    console.error("Error al eliminar transacción:", error);
    return res.status(500).json({ message: "Ocurrió un error al eliminar la transacción" });
  }
};