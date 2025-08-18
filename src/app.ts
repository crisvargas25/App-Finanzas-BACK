import express, { Application } from 'express';
import cors from 'cors';
import userRoutes from './routes/user.routes';
import authRoutes from './routes/auth.route';
import menuRoutes from './routes/menu.routes';
import emailRoutes from './routes/emailRoutes';

// Importar rutas para entidades de finanzas
import financeCategoryRoutes from './routes/financeCategory.routes';
import budgetRoutes from './routes/budget.routes';
import savingGoalRoutes from './routes/savingGoal.routes';
import transactionRoutes from './routes/transaction.routes';

const app: Application = express();

// Middlewares
app.use(express.json());



// Rutas
app.use('/api/users', userRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/email', emailRoutes);

// Rutas para la aplicación de finanzas
// Categorías financieras (ingresos y gastos)
app.use('/api/finance-categories', financeCategoryRoutes);
// Presupuestos
app.use('/api/budgets', budgetRoutes);
// Metas de ahorro
app.use('/api/saving-goals', savingGoalRoutes);
// Transacciones (ingresos y gastos)
app.use('/api/transactions', transactionRoutes);

export default app;