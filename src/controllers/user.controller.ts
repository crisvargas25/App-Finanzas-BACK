import { Request, Response } from "express";
import { User, IUser } from "../models/userModel";
import { Types } from "mongoose";
import { userCreatedEvent } from "../services/rabbitServiceEvent";
import bcrypt from "bcryptjs";
import { RoleType, IRole } from "../models/roleModel";

// Create a new user
export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, role, currency }: { name: string; currency: string; email: string; password: string; role: IRole[] } = req.body;

    if (!name || !email || !currency || !password || !role || !Array.isArray(role)) {
      res.status(400).json({ message: "All required fields must be provided and role must be an array" });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({ message: "Invalid email format" });
      return;
    }

    // Validate roles
    for (const r of role) {
      if (!Object.values(RoleType).includes(r.type)) {
        res.status(400).json({ message: `Invalid role type: ${r.type}` });
        return;
      }
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "User with this email already exists" });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user: IUser = await User.create({
      name,
      email,
      password: passwordHash,
      role,
      status: true,
      currency
    });

    await userCreatedEvent({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role.map((r: IRole) => r.type).join(","),
      creationDate: new Date(),
      currency: user.currency
    });

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      message: "An error occurred while creating user",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Get all users
export const getAllUsers = async (_req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json({
      message: "Users retrieved successfully",
      users,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      message: "An error occurred while getting all users",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Get a single user by ID
export const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: "Invalid user ID" });
      return;
    }

    const user = await User.findById(id).select("-password");
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({
      message: "User retrieved successfully",
      user,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      message: "An error occurred while getting user by ID",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Update a user
export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, email, role, status }: Partial<IUser> = req.body;

    if (!Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: "Invalid user ID" });
      return;
    }

    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    if (role) {
      if (!Array.isArray(role)) {
        res.status(400).json({ message: "Role must be an array" });
        return;
      }

      for (const r of role) {
        if (!Object.values(RoleType).includes(r.type)) {
          res.status(400).json({ message: `Invalid role type: ${r.type}` });
          return;
        }
      }

      user.role = role;
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (typeof status === "boolean") user.status = status;

    await user.save();

    res.status(200).json({
      message: "User updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      message: "An error occurred while updating user",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
// Delete a user (logical delete)
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: "Invalid user ID" });
      return;
    }

    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    user.status = false;
    user.deleteDate = new Date(); // <--- Establece la fecha de eliminación
    await user.save();

    res.status(200).json({
      message: "User logically deleted successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        deleteDate: user.deleteDate, // <--- Inclúyelo en la respuesta también
      },
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      message: "An error occurred while deleting user",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Get all users with the "admin" role
export const getAdmins = async (_req: Request, res: Response): Promise<void> => {
  try {
    const admins = await User.find(
      { role: { $elemMatch: { type: RoleType.ADMIN } } },
      "email name"
    );
    res.status(200).json(admins);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Error fetching admin users" });
  }
};
