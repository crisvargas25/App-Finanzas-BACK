import { Request, Response } from "express";
import { Menu } from "../models/menuModel"; // Ajusta esta ruta si es necesario

export const createNewMenu = async (req: Request, res: Response) => {
  try {
    const { title, description, path, icon, roles } = req.body;
    const status = req.body.status !== undefined ? req.body.status : true; // default: true

    // Validaciones básicas
    if (
      !title || !description || !path || !icon || !roles ||
      !Array.isArray(roles) || roles.length === 0 ||
      typeof status !== "boolean"
    ) {
      return res.status(400).json({
        message:
          "Los campos 'title', 'description', 'path', 'icon', 'roles' son obligatorios. 'roles' debe ser un array no vacío y 'status' debe ser booleano.",
      });
    }

    // Verificar si ya existe un menú con ese path
    const existingMenu = await Menu.findOne({ path });
    if (existingMenu) {
      return res.status(409).json({
        message: `Ya existe un menú con el path '${path}'`,
      });
    }

    // Crear y guardar el nuevo menú
    const newMenu = new Menu({ title, description, path, icon, roles, status });
    const saved = await newMenu.save();
    res.status(201).json(saved);
  } catch (error) {
    console.error("❌ Error al guardar el menú:", error);
    res.status(400).json({ message: "Error al guardar el menú", error });
  }
};

export const getMenusByRole = async (req: Request, res: Response) => {
  const { role } = req.query;
  try {
    if (!role) {
      return res.status(400).json({ message: "El parámetro 'role' es requerido" });
    }
    const menus = await Menu.find({ "roles.type": role });
    res.status(200).json(menus);
  } catch (error) {
    console.error("❌ Error al obtener los menús:", error);
    res.status(500).json({ message: "Error al obtener los menús", error });
  }
};


export const deleteMenu = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const updated = await Menu.findByIdAndUpdate(
      id,
      { status: false },
      { new: true } // para devolver el documento actualizado
    );

    if (!updated) {
      return res.status(404).json({ message: "Menú no encontrado" });
    }

    res.status(200).json({
      message: "Menú desactivado correctamente",
      menu: updated,
    });
  } catch (error) {
    console.error("❌ Error al desactivar el menú:", error);
    res.status(400).json({ message: "Error al desactivar el menú", error });
  }
};