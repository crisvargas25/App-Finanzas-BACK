import express, { Application } from 'express';
import userRoutes from './routes/user.routes'
import authRoutes from './routes/auth.route';
import menuRoutes from './routes/menu.routes';
import emailRoutes from './routes/emailRoutes';

const app: Application = express();

// Middlewares
app.use(express.json());

// Rutas
app.use('/api/users', userRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/email', emailRoutes);

export default app;