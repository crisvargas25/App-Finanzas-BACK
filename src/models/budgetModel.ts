import { Document, Schema, model, Types } from "mongoose";

/**
 * Budget model.
 *
 * Representa un presupuesto para un periodo específico. Un presupuesto
 * pertenece a un usuario y tiene un nombre descriptivo. La suma de
 * los límites por categoría debería ser menor o igual al monto
 * total del presupuesto, aunque esa validación se debe realizar en
 * la lógica de negocio en lugar del modelo.
 */
export interface IBudget extends Document {
  _id: Types.ObjectId;
  /** Usuario propietario del presupuesto */
  userId: Types.ObjectId;
  /** Nombre del presupuesto (por ejemplo "Vacaciones 2025") */
  name: string;
  /** Monto total asignado al presupuesto */
  montoTotal: number;
  /** Periodo del presupuesto: mensual, semanal o personalizado */
  periodo: "mensual" | "semanal" | "personalizado";
  /** Fecha de inicio del presupuesto */
  fechaInicio: Date;
  /** Fecha de finalización del presupuesto */
  fechaFin: Date;
  /** Estado actual del presupuesto: activo, cerrado o cancelado */
  estado?: "activo" | "cerrado" | "cancelado";
  /** Fecha de creación del presupuesto */
  creationDate: Date;
  /** Fecha de eliminación lógica */
  deleteDate?: Date;
  /** Indica si el presupuesto está activo */
  status: boolean;
}

const budgetSchema = new Schema<IBudget>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  montoTotal: {
    type: Number,
    required: true,
    min: [0, "El monto total debe ser mayor o igual a cero"],
  },
  periodo: {
    type: String,
    enum: ["mensual", "semanal", "personalizado"],
    required: true,
  },
  fechaInicio: {
    type: Date,
    required: true,
  },
  fechaFin: {
    type: Date,
    required: true,
  },
  estado: {
    type: String,
    enum: ["activo", "cerrado", "cancelado"],
    default: "activo",
  },
  creationDate: {
    type: Date,
    default: Date.now,
  },
  deleteDate: {
    type: Date,
  },
  status: {
    type: Boolean,
    default: true,
  },
});

// Índice único sugerido: un presupuesto por periodo (o ventana de fechas) para un usuario y nombre
budgetSchema.index(
  { userId: 1, fechaInicio: 1, fechaFin: 1, name: 1 },
  { unique: true }
);

export const Budget = model<IBudget>("Budget", budgetSchema, "budgets");