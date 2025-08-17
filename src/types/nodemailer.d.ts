declare module 'nodemailer-express-handlebars';

import 'nodemailer/lib/mailer';

declare module 'nodemailer/lib/mailer' {
  interface Options {
    
    template?: string;
    
    context?: Record<string, any>;
  }
}

// This module declaration is used to allow TypeScript to understand the 'nodemailer' package
// when it is imported in the project. It helps in avoiding type errors during compilation.