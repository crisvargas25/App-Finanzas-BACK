import nodemailer from 'nodemailer';
import hbs from 'nodemailer-express-handlebars';
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

// Registra el plugin de handlebars en Nodemailer
transporter.use('compile', hbs(handlebarOptions));

export default transporter;
