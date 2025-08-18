import { Document, Schema, model, Types } from "mongoose";

/**
 * Transaction model.
 *
 * Representa un ingreso o gasto registrado por el usuario. Cada
 * transacción está asociada a una categoría financiera y, de manera
 * opcional, a un presupuesto. Las transacciones afectan el balance
 * del usuario y se utilizan para generar reportes y alertas.
 */
export interface ITransaction extends Document {
  _id: Types.ObjectId;
  /** Usuario que realizó la transacción */
  userId: Types.ObjectId;
  /** Tipo de transacción: ingreso o gasto */
  type: "ingreso" | "gasto";
  /** Monto de la transacción */
  monto: number;
  /** Fecha y hora en que se realizó la transacción */
  fecha: Date;
  /** Categoría financiera asociada */
  categoriaId: Types.ObjectId;
  /** Presupuesto asociado a la transacción (opcional) */
  presupuestoId?: Types.ObjectId;
  /** Nota o descripción opcional */
  nota?: string;
  /** Fecha de creación del registro */
  creationDate: Date;
  /** Fecha de eliminación lógica */
  deleteDate?: Date;
  /** Indica si la transacción está activa */
  status: boolean;
}

const transactionSchema = new Schema<ITransaction>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    enum: ["ingreso", "gasto"],
    required: true,
  },
  monto: {
    type: Number,
    required: true,
    min: [0, "El monto debe ser mayor o igual a cero"],
  },
  fecha: {
    type: Date,
    required: true,
  },
  categoriaId: {
    type: Schema.Types.ObjectId,
    ref: "FinanceCategory",
    required: true,
  },
  presupuestoId: {
    type: Schema.Types.ObjectId,
    ref: "Budget",
    required: false,
  },
  nota: {
    type: String,
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

export const Transaction = model<ITransaction>(
  "Transaction",
  transactionSchema,
  "transactions"
);