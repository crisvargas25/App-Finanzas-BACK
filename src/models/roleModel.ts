import { Schema } from "mongoose";

export enum RoleType {
  USER = "user",
  ADMIN = "admin",
}

export interface IRole {
  type: RoleType;
}

export const roleSchema = new Schema<IRole>(
  {
    type: {
      type: String,
      enum: Object.values(RoleType), // Solo "user" o "admin"
      required: true,
    },
  },
  { _id: false } // Se embebe sin crear un _id propio por cada rol
);
