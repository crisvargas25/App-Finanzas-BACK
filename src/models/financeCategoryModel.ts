import { Document, Schema, model, Types } from "mongoose";

/**
 * FinanceCategory model.
 *
 * Representa una categoría que un usuario puede crear para clasificar
 * ingresos y gastos. Cada categoría pertenece a un usuario y se
 * identifica visualmente por un código de color.
 */
export interface IFinanceCategory extends Document {
  _id: Types.ObjectId;
  /** Usuario al que pertenece la categoría */
  userId: Types.ObjectId;
  /** Nombre de la categoría (ej. Alimentación, Transporte) */
  name: string;
  /** Tipo de la categoría: ingreso o gasto */
  type: "ingreso" | "gasto";
  /** Código de color en formato HEX para reportes */
  color: string;
  /** Fecha de creación de la categoría */
  creationDate: Date;
  /** Fecha de eliminación lógica de la categoría */
  deleteDate?: Date;
  /** Indica si la categoría está activa */
  status: boolean;
}

const financeCategorySchema = new Schema<IFinanceCategory>({
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
  type: {
    type: String,
    enum: ["ingreso", "gasto"],
    required: true,
  },
  color: {
    type: String,
    required: true,
    trim: true,
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

export const FinanceCategory = model<IFinanceCategory>(
  "FinanceCategory",
  financeCategorySchema,
  "financecategories"
);