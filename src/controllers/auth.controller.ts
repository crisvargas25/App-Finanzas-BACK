import { Request, request, Response, response } from "express";
import NodeCache from "node-cache";
import { generateAccessToken, generateRecoveryToken } from "../utils/generateToken";
import { cache } from "../utils/cache";
import dayjs from "dayjs";
import { User } from "../models/userModel";
import bcrypt from 'bcryptjs';
import { publishRecoveryEvent } from '../services/rabbitServiceEvent';
import jwt from 'jsonwebtoken';

// Login controller
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: 'Email and password are required' });
      return;
    }

    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    if (!user.status) {
      res.status(403).json({ message: 'User account is disabled' });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const userId = (user._id as string | { toString(): string }).toString();
    const accessToken = generateAccessToken(userId);
    cache.set(userId, accessToken, 60 * 15); // 15 minutes TTL

    res.status(200).json({
      message: 'Login successful',
      token: accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error during login',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get remaining time before token expires
export const getTimeToken = (req = request, res = response) => {
  const { userId } = req.body;

  const ttl = cache.getTtl(userId); // Time to live in milliseconds

  if (!ttl) {
    return res.status(404).json({ message: "Token does not exist" });
  }

  const now = Date.now();
  const timeToLive = Math.floor((ttl - now) / 1000); // Remaining seconds
  const expTime = dayjs(ttl).format('HH:mm:ss'); // Exact expiration time

  return res.json({
    timeToLive,
    expTime
  });
};

// Renew token TTL
export const updateToken = (req: Request, res: Response) => {
  const { userId } = req.query;

  if (typeof userId !== 'string') {
    return res.status(400).json({ message: "'userId' parameter is required and must be a string" });
  }

  const ttl = cache.getTtl(userId);

  if (!ttl) {
    return res.status(404).json({ message: "Token does not exist" });
  }

  const newTTL: number = 60 * 15;
  cache.ttl(userId, newTTL);

  return res.json({ message: "Token updated successfully" });
};

// Forgot password controller – triggers recovery email
export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const token = generateRecoveryToken(email);

  await publishRecoveryEvent({
    name: user.name,
    email: user.email,
    token,
  });

  res.json({ message: 'Recovery email sent' });
};

// Reset password using token
export const resetPassword = async (req: Request, res: Response) => {
  const { token, newPassword } = req.body;

  try {
    const secret = process.env.JWT_SECRET!;
    const payload = jwt.verify(token, secret) as { email: string };

    const user = await User.findOne({ email: payload.email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: 'Password successfully updated' });
  } catch (err) {
    console.error('❌ Invalid or expired token:', err);
    res.status(400).json({ message: 'Invalid or expired token' });
  }
};