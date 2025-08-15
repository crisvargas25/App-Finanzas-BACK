# 💰 App de Finanzas Personales y Ahorro

Una aplicación móvil diseñada para ayudarte a **llevar el control de tus finanzas personales**, incluyendo **gastos, ingresos, presupuestos** y **metas de ahorro**. Esta app combina una interfaz intuitiva con funcionalidades potentes y seguras para una gestión financiera diaria.

---

## 🚀 Características Principales

- 📱 **Navegación eficiente** con Drawer Navigator + Bottom Navigator
- 🧠 **Estado local** para edición de entradas, filtros dinámicos y experiencia fluida
- 🌍 **Estado global** para controlar presupuesto mensual y metas de ahorro
- 📊 **Componentes personalizados** como gráficas interactivas y tablas dinámicas
- 🧮 **Hook personalizado** para cálculo de balance y alertas automáticas
- 🔐 **Autenticación segura** mediante tokens (JWT)
- 🔒 **Encriptación de datos financieros** para máxima privacidad
- 🗃️ **Bases de datos combinadas**:
  - SQLite para almacenamiento local offline
  - MongoDB en la nube para respaldo y sincronización
- 🌐 **Backend robusto** con Express.js + autenticación JWT
- 🛠️ **Desarrollo modular** usando metodología KANBAN
- 🎨 **Iconografía atractiva** para mejorar la experiencia de usuario

---

## 🧩 Tecnologías Usadas

| Frontend | Backend | Base de Datos | Seguridad |
|----------|---------|---------------|-----------|
| React Native | Express.js | SQLite & MongoDB Atlas | JWT & Encriptación |
| React Navigation | Node.js | Mongoose | Tokens & Hooks |

---

## 📌 Organización del Proyecto

- `/src/components` – Gráficas, tablas y componentes reutilizables
- `/src/screens` – Pantallas principales de la app
- `/src/hooks` – Lógica personalizada (balance, alertas)
- `/src/context` – Estado global (presupuesto, metas)
- `/server` – Backend con rutas protegidas, controladores y conexión a MongoDB

---

## 🔄 Metodología de Trabajo

Este proyecto fue desarrollado utilizando la metodología **KANBAN**, organizando las tareas en módulos independientes como:

- Módulo de autenticación
- Módulo de ingresos y gastos
- Módulo de visualización de datos
- Módulo de sincronización y respaldo en la nube

---

## 📷 Vistas Previas

> *(Aquí puedes agregar imágenes de la app o GIFs del funcionamiento)*

---

## 👨‍💻 Instalación y Uso

```bash
# Clona el repositorio
git clone https://github.com/usuario/app-finanzas.git

# Entra al directorio
cd app-finanzas

# Instala dependencias (cliente)
npm install

# Instala dependencias del backend
cd server
npm install

# Inicia backend
npm run dev

# Vuelve al cliente y ejecuta la app
cd ..
npm start
