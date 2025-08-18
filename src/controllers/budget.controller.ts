import { Request, Response } from "express";
import { Types } from "mongoose";
import { Budget } from "../models/budgetModel";

/**
 * Controlador para gestionar presupuestos.
 */

// Crear un nuevo presupuesto
export const createBudget = async (req: Request, res: Response) => {
  try {
    const {
      userId,
      name,
      montoTotal,
      periodo,
      fechaInicio,
      fechaFin,
      estado,
    }: {
      userId: string;
      name: string;
      montoTotal: number;
      periodo: string;
      fechaInicio: string | Date;
      fechaFin: string | Date;
      estado?: string;
    } = req.body;

    // Validar campos obligatorios
    if (!userId || !name || montoTotal === undefined || !periodo || !fechaInicio || !fechaFin) {
      return res.status(400).json({ message: "Los campos 'userId', 'name', 'montoTotal', 'periodo', 'fechaInicio' y 'fechaFin' son obligatorios" });
    }

    // Validar ObjectId
    if (!Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "userId no es un identificador válido" });
    }

    // Validar periodo
    if (!["mensual", "semanal", "personalizado"].includes(periodo)) {
      return res.status(400).json({ message: "periodo debe ser 'mensual', 'semanal' o 'personalizado'" });
    }

    // Validar fechas
    const startDate = new Date(fechaInicio);
    const endDate = new Date(fechaFin);
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return res.status(400).json({ message: "Las fechas proporcionadas no son válidas" });
    }
    if (startDate > endDate) {
      return res.status(400).json({ message: "La fecha de inicio debe ser anterior a la fecha de fin" });
    }

    // Validar estado
    let estadoPresupuesto: "activo" | "cerrado" | "cancelado" | undefined;
    if (estado) {
      if (!["activo", "cerrado", "cancelado"].includes(estado)) {
        return res.status(400).json({ message: "estado debe ser 'activo', 'cerrado' o 'cancelado'" });
      }
      estadoPresupuesto = estado as "activo" | "cerrado" | "cancelado";
    }

    // Crear y guardar
    const budget = await Budget.create({
      userId,
      name: name.trim(),
      montoTotal,
      periodo,
      fechaInicio: startDate,
      fechaFin: endDate,
      estado: estadoPresupuesto,
    });

    return res.status(201).json({ message: "Presupuesto creado correctamente", budget });
  } catch (error: any) {
    console.error("Error al crear presupuesto:", error);
    // Manejar error por índice único duplicado
    if (error.code === 11000) {
      return res.status(409).json({ message: "Ya existe un presupuesto para el mismo periodo y nombre del usuario" });
    }
    return res.status(500).json({ message: "Ocurrió un error al crear el presupuesto", error: error.message });
  }
};

// Obtener todos los presupuestos de un usuario (o todos si no se especifica usuario)
export const getBudgets = async (req: Request, res: Response) => {
  try {
    const { userId } = req.query as { userId?: string };
    const filter: any = { status: true };
    if (userId) {
      if (!Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: "userId no es un identificador válido" });
      }
      filter.userId = userId;
    }
    const budgets = await Budget.find(filter);
    return res.status(200).json(budgets);
  } catch (error) {
    console.error("Error al obtener presupuestos:", error);
    return res.status(500).json({ message: "Ocurrió un error al obtener los presupuestos" });
  }
};

// Obtener un presupuesto por id
export const getBudgetById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Id no válido" });
    }
    const budget = await Budget.findById(id);
    if (!budget || !budget.status) {
      return res.status(404).json({ message: "Presupuesto no encontrado" });
    }
    return res.status(200).json(budget);
  } catch (error) {
    console.error("Error al obtener presupuesto:", error);
    return res.status(500).json({ message: "Ocurrió un error al obtener el presupuesto" });
  }
};

// Actualizar un presupuesto existente
export const updateBudget = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Id no válido" });
    }
    const budget = await Budget.findById(id);
    if (!budget || !budget.status) {
      return res.status(404).json({ message: "Presupuesto no encontrado" });
    }
    const { name, montoTotal, periodo, fechaInicio, fechaFin, estado, status }: Partial<{ name: string; montoTotal: number; periodo: string; fechaInicio: string | Date; fechaFin: string | Date; estado: string; status: boolean }> = req.body;

    // Actualizar campos permitidos
    if (name) budget.name = name.trim();
    if (montoTotal !== undefined) budget.montoTotal = montoTotal;
    if (periodo) {
      if (!["mensual", "semanal", "personalizado"].includes(periodo)) {
        return res.status(400).json({ message: "periodo debe ser 'mensual', 'semanal' o 'personalizado'" });
      }
      budget.periodo = periodo as any;
    }
    if (fechaInicio) {
      const startDate = new Date(fechaInicio);
      if (isNaN(startDate.getTime())) {
        return res.status(400).json({ message: "fechaInicio no es válida" });
      }
      budget.fechaInicio = startDate;
    }
    if (fechaFin) {
      const endDate = new Date(fechaFin);
      if (isNaN(endDate.getTime())) {
        return res.status(400).json({ message: "fechaFin no es válida" });
      }
      budget.fechaFin = endDate;
    }
    if (estado) {
      if (!["activo", "cerrado", "cancelado"].includes(estado)) {
        return res.status(400).json({ message: "estado debe ser 'activo', 'cerrado' o 'cancelado'" });
      }
      budget.estado = estado as any;
    }
    if (typeof status === "boolean") {
      budget.status = status;
      if (!status) {
        budget.deleteDate = new Date();
      }
    }

    // Verificar que la fecha de inicio sea anterior a la de fin si ambas están definidas
    if (budget.fechaInicio && budget.fechaFin && budget.fechaInicio > budget.fechaFin) {
      return res.status(400).json({ message: "La fecha de inicio debe ser anterior a la fecha de fin" });
    }

    await budget.save();
    return res.status(200).json({ message: "Presupuesto actualizado correctamente", budget });
  } catch (error: any) {
    console.error("Error al actualizar presupuesto:", error);
    if (error.code === 11000) {
      return res.status(409).json({ message: "Ya existe un presupuesto para el mismo periodo y nombre del usuario" });
    }
    return res.status(500).json({ message: "Ocurrió un error al actualizar el presupuesto", error: error.message });
  }
};

// Eliminar lógicamente un presupuesto
export const deleteBudget = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Id no válido" });
    }
    const budget = await Budget.findById(id);
    if (!budget || !budget.status) {
      return res.status(404).json({ message: "Presupuesto no encontrado" });
    }
    budget.status = false;
    budget.deleteDate = new Date();
    await budget.save();
    return res.status(200).json({ message: "Presupuesto eliminado correctamente", budget });
  } catch (error) {
    console.error("Error al eliminar presupuesto:", error);
    return res.status(500).json({ message: "Ocurrió un error al eliminar el presupuesto" });
  }
};