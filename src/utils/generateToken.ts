import jwt from 'jsonwebtoken';


const secret = process.env.JWT_SECRET!;

// Function to generate an access token
export const generateAccessToken = (userId: string) => {
    return jwt.sign({ userId },secret,{ expiresIn: "15m" });
};

export const generateRecoveryToken = (email: string): string => {
  return jwt.sign({ email }, secret, { expiresIn: '15m' });
};