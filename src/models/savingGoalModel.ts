import { Document, Schema, model, Types } from "mongoose";

/**
 * SavingGoal model.
 *
 * Representa una meta de ahorro que un usuario quiere alcanzar. Cada
 * meta tiene un nombre, un monto objetivo, un monto actual y una
 * fecha límite. El estado indica si la meta está en progreso,
 * cumplida o cancelada.
 */
export interface ISavingGoal extends Document {
  _id: Types.ObjectId;
  /** Usuario propietario de la meta de ahorro */
  userId: Types.ObjectId;
  /** Nombre descriptivo de la meta (ej. "Ahorro para vacaciones") */
  nombreMeta: string;
  /** Monto objetivo a alcanzar */
  montoObjetivo: number;
  /** Monto acumulado hasta el momento */
  montoActual: number;
  /** Fecha límite para alcanzar la meta */
  fechaMeta: Date;
  /** Estado de la meta: en progreso, cumplida o cancelada */
  estado: "en_progreso" | "cumplida" | "cancelada";
  /** Fecha de creación de la meta */
  creationDate: Date;
  /** Fecha de eliminación lógica */
  deleteDate?: Date;
  /** Indica si la meta está activa */
  status: boolean;
}

const savingGoalSchema = new Schema<ISavingGoal>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  nombreMeta: {
    type: String,
    required: true,
    trim: true,
  },
  montoObjetivo: {
    type: Number,
    required: true,
    min: [0, "El monto objetivo debe ser mayor o igual a cero"],
  },
  montoActual: {
    type: Number,
    default: 0,
    min: [0, "El monto actual debe ser mayor o igual a cero"],
  },
  fechaMeta: {
    type: Date,
    required: true,
  },
  estado: {
    type: String,
    enum: ["en_progreso", "cumplida", "cancelada"],
    default: "en_progreso",
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

export const SavingGoal = model<ISavingGoal>(
  "SavingGoal",
  savingGoalSchema,
  "savinggoals"
);