import nodemailer from 'nodemailer';
import { create as createHandlebars } from 'express-handlebars';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const templatesDir = path.resolve(process.cwd(), 'src/templates');

const handlebarOptions = {
  viewEngine: createHandlebars({
    extname: '.handlebars',
    partialsDir: templatesDir,
    defaultLayout: false,
  }),
  viewPath: templatesDir,
  extName: '.handlebars',
};

// Variable para rastrear si handlebars ya está configurado
let isHandlebarsSetup = false;
let setupPromise: Promise<void> | null = null;

// Función asíncrona para configurar el plugin de handlebars
async function setupHandlebars(): Promise<void> {
  if (isHandlebarsSetup) return;
  
  if (setupPromise) return setupPromise;

  setupPromise = (async () => {
    try {
      // Use eval to prevent ts-node from transforming the dynamic import
      const hbs = await (eval('import("nodemailer-express-handlebars")') as Promise<any>);
      // Registra el plugin de handlebars en Nodemailer
      transporter.use('compile', hbs.default(handlebarOptions));
      isHandlebarsSetup = true;
      console.log('✅ Handlebars email templates configured successfully');
    } catch (error) {
      console.error('❌ Error loading nodemailer-express-handlebars:', error);
      throw error;
    }
  })();

  return setupPromise;
}

// Función wrapper para asegurar que handlebars esté configurado antes de enviar emails
export const getTransporter = async () => {
  await setupHandlebars();
  return transporter;
};

// No inicializar handlebars en el arranque para evitar el error de ES module
// setupHandlebars().catch(console.error);

export default transporter;
