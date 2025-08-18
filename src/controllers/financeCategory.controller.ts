import { Request, Response } from "express";
import { Types } from "mongoose";
import { FinanceCategory } from "../models/financeCategoryModel";

/**
 * Controlador para gestionar categorías financieras (ingresos y gastos).
 */

// Crear una nueva categoría financiera
export const createFinanceCategory = async (req: Request, res: Response) => {
  try {
    const { userId, name, type, color } = req.body;

    // Validar campos obligatorios
    if (!userId || !name || !type || !color) {
      return res.status(400).json({ message: "Los campos 'userId', 'name', 'type' y 'color' son obligatorios" });
    }

    // Validar ObjectId
    if (!Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "userId no es un identificador válido" });
    }

    // Validar el tipo de categoría
    if (!["ingreso", "gasto"].includes(type)) {
      return res.status(400).json({ message: "type debe ser 'ingreso' o 'gasto'" });
    }

    // Verificar si ya existe una categoría con el mismo nombre y tipo para el usuario
    const existing = await FinanceCategory.findOne({ userId, name: name.trim(), type });
    if (existing) {
      return res.status(409).json({ message: `Ya existe la categoría '${name}' del tipo '${type}' para este usuario` });
    }

    const category = await FinanceCategory.create({
      userId,
      name: name.trim(),
      type,
      color: color.trim(),
    });

    return res.status(201).json({
      message: "Categoría creada correctamente",
      category,
    });
  } catch (error) {
    console.error("Error al crear la categoría financiera:", error);
    return res.status(500).json({
      message: "Ocurrió un error al crear la categoría financiera",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Obtener todas las categorías financieras de un usuario (o todas si no se especifica usuario)
export const getFinanceCategories = async (req: Request, res: Response) => {
  try {
    const { userId } = req.query as { userId?: string };

    const filter: any = { status: true };
    if (userId) {
      if (!Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: "userId no es un identificador válido" });
      }
      filter.userId = userId;
    }

    const categories = await FinanceCategory.find(filter);
    return res.status(200).json(categories);
  } catch (error) {
    console.error("Error al obtener categorías financieras:", error);
    return res.status(500).json({ message: "Ocurrió un error al obtener categorías" });
  }
};

// Obtener una categoría financiera por id
export const getFinanceCategoryById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Id no válido" });
    }
    const category = await FinanceCategory.findById(id);
    if (!category || !category.status) {
      return res.status(404).json({ message: "Categoría no encontrada" });
    }
    return res.status(200).json(category);
  } catch (error) {
    console.error("Error al obtener la categoría financiera por id:", error);
    return res.status(500).json({ message: "Error al obtener la categoría" });
  }
};

// Actualizar una categoría financiera existente
export const updateFinanceCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, type, color, status }: { name?: string; type?: string; color?: string; status?: boolean } = req.body;

    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Id no válido" });
    }

    const category = await FinanceCategory.findById(id);
    if (!category || !category.status) {
      return res.status(404).json({ message: "Categoría no encontrada" });
    }

    // Actualizar campos permitidos
    if (name) category.name = name.trim();
    if (type) {
      if (!["ingreso", "gasto"].includes(type)) {
        return res.status(400).json({ message: "type debe ser 'ingreso' o 'gasto'" });
      }
      category.type = type as "ingreso" | "gasto";
    }
    if (color) category.color = color.trim();
    if (typeof status === "boolean") {
      category.status = status;
      if (!status) {
        category.deleteDate = new Date();
      }
    }

    await category.save();
    return res.status(200).json({ message: "Categoría actualizada correctamente", category });
  } catch (error) {
    console.error("Error al actualizar la categoría financiera:", error);
    return res.status(500).json({ message: "Error al actualizar la categoría" });
  }
};

// Eliminar lógicamente una categoría financiera
export const deleteFinanceCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Id no válido" });
    }
    const category = await FinanceCategory.findById(id);
    if (!category || !category.status) {
      return res.status(404).json({ message: "Categoría no encontrada" });
    }
    category.status = false;
    category.deleteDate = new Date();
    await category.save();
    return res.status(200).json({ message: "Categoría eliminada correctamente", category });
  } catch (error) {
    console.error("Error al eliminar la categoría financiera:", error);
    return res.status(500).json({ message: "Error al eliminar la categoría" });
  }
};