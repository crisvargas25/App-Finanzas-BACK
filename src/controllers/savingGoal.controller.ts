import { Request, Response } from "express";
import { Types } from "mongoose";
import { SavingGoal } from "../models/savingGoalModel";

/**
 * Controlador para gestionar metas de ahorro.
 */

// Crear una nueva meta de ahorro
export const createSavingGoal = async (req: Request, res: Response) => {
  try {
    const {
      userId,
      nombreMeta,
      montoObjetivo,
      montoActual,
      fechaMeta,
      estado,
    }: {
      userId: string;
      nombreMeta: string;
      montoObjetivo: number;
      montoActual?: number;
      fechaMeta: string | Date;
      estado?: string;
    } = req.body;

    // Validar campos obligatorios
    if (!userId || !nombreMeta || montoObjetivo === undefined || !fechaMeta) {
      return res.status(400).json({ message: "Los campos 'userId', 'nombreMeta', 'montoObjetivo' y 'fechaMeta' son obligatorios" });
    }
    if (!Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "userId no es un identificador válido" });
    }
    const goalDate = new Date(fechaMeta);
    if (isNaN(goalDate.getTime())) {
      return res.status(400).json({ message: "fechaMeta no es válida" });
    }
    let estadoMeta: "en_progreso" | "cumplida" | "cancelada" | undefined;
    if (estado) {
      if (!["en_progreso", "cumplida", "cancelada"].includes(estado)) {
        return res.status(400).json({ message: "estado debe ser 'en_progreso', 'cumplida' o 'cancelada'" });
      }
      estadoMeta = estado as any;
    }

    const savingGoal = await SavingGoal.create({
      userId,
      nombreMeta: nombreMeta.trim(),
      montoObjetivo,
      montoActual: montoActual ?? 0,
      fechaMeta: goalDate,
      estado: estadoMeta,
    });

    return res.status(201).json({ message: "Meta de ahorro creada correctamente", savingGoal });
  } catch (error: any) {
    console.error("Error al crear la meta de ahorro:", error);
    return res.status(500).json({ message: "Ocurrió un error al crear la meta de ahorro", error: error.message });
  }
};

// Obtener todas las metas de ahorro de un usuario (o todas si no se especifica usuario)
export const getSavingGoals = async (req: Request, res: Response) => {
  try {
    const { userId } = req.query as { userId?: string };
    const filter: any = { status: true };
    if (userId) {
      if (!Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: "userId no es un identificador válido" });
      }
      filter.userId = userId;
    }
    const goals = await SavingGoal.find(filter);
    return res.status(200).json(goals);
  } catch (error) {
    console.error("Error al obtener metas de ahorro:", error);
    return res.status(500).json({ message: "Ocurrió un error al obtener las metas de ahorro" });
  }
};

// Obtener una meta de ahorro por id
export const getSavingGoalById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Id no válido" });
    }
    const goal = await SavingGoal.findById(id);
    if (!goal || !goal.status) {
      return res.status(404).json({ message: "Meta de ahorro no encontrada" });
    }
    return res.status(200).json(goal);
  } catch (error) {
    console.error("Error al obtener la meta de ahorro:", error);
    return res.status(500).json({ message: "Ocurrió un error al obtener la meta de ahorro" });
  }
};

// Actualizar una meta de ahorro
export const updateSavingGoal = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Id no válido" });
    }
    const goal = await SavingGoal.findById(id);
    if (!goal || !goal.status) {
      return res.status(404).json({ message: "Meta de ahorro no encontrada" });
    }
    const {
      nombreMeta,
      montoObjetivo,
      montoActual,
      fechaMeta,
      estado,
      status,
    }: Partial<{ nombreMeta: string; montoObjetivo: number; montoActual: number; fechaMeta: string | Date; estado: string; status: boolean }> = req.body;

    if (nombreMeta) goal.nombreMeta = nombreMeta.trim();
    if (montoObjetivo !== undefined) goal.montoObjetivo = montoObjetivo;
    if (montoActual !== undefined) goal.montoActual = montoActual;
    if (fechaMeta) {
      const d = new Date(fechaMeta);
      if (isNaN(d.getTime())) {
        return res.status(400).json({ message: "fechaMeta no es válida" });
      }
      goal.fechaMeta = d;
    }
    if (estado) {
      if (!["en_progreso", "cumplida", "cancelada"].includes(estado)) {
        return res.status(400).json({ message: "estado debe ser 'en_progreso', 'cumplida' o 'cancelada'" });
      }
      goal.estado = estado as any;
    }
    if (typeof status === "boolean") {
      goal.status = status;
      if (!status) {
        goal.deleteDate = new Date();
      }
    }

    await goal.save();
    return res.status(200).json({ message: "Meta de ahorro actualizada correctamente", goal });
  } catch (error: any) {
    console.error("Error al actualizar la meta de ahorro:", error);
    return res.status(500).json({ message: "Ocurrió un error al actualizar la meta de ahorro", error: error.message });
  }
};

// Eliminar lógicamente una meta de ahorro
export const deleteSavingGoal = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Id no válido" });
    }
    const goal = await SavingGoal.findById(id);
    if (!goal || !goal.status) {
      return res.status(404).json({ message: "Meta de ahorro no encontrada" });
    }
    goal.status = false;
    goal.deleteDate = new Date();
    await goal.save();
    return res.status(200).json({ message: "Meta de ahorro eliminada correctamente", goal });
  } catch (error) {
    console.error("Error al eliminar la meta de ahorro:", error);
    return res.status(500).json({ message: "Ocurrió un error al eliminar la meta de ahorro" });
  }
};