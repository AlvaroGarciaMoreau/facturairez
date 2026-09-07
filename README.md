# Facturairez

Facturairez es una aplicación web moderna diseñada para la gestión, creación y extracción inteligente de facturas y pedidos. Integrada con Inteligencia Artificial, permite a los autónomos procesar documentos PDF automáticamente para generar facturas listas para imprimir o enviar.

## 🚀 Características Principales

- **Gestión de Facturas (CRUD)**: Crea, edita, visualiza y elimina facturas fácilmente.
- **Facturación Inteligente (OCR con IA)**: Sube un PDF de un pedido (ej. Shopify) y la IA extraerá todos los datos (cliente, NIF, dirección, artículos, importes y número de pedido) rellenando el formulario de manera automática.
- **Multizona**: Soporte para facturación local (España), Intracomunitaria (Europa) y Extracomunitaria (Resto del Mundo) con gestión automática del IVA.
- **Impresión Profesional**: Plantillas de facturas limpias y listas para imprimir en formato A4 o guardar como PDF nativo desde el navegador.
- **Seguridad Robusta**: Autenticación con Google, bases de datos protegidas por reglas de seguridad granulares por usuario y validación estricta de entorno mediante Firebase App Check (reCAPTCHA Enterprise).

## 🛠️ Tecnologías Utilizadas

- **Frontend**: React 19, Vite, Tailwind CSS 4, Lucide React.
- **Backend & Base de Datos**: Firebase Cloud Firestore (NoSQL).
- **Autenticación**: Firebase Auth (Google Sign-In).
- **Inteligencia Artificial**: Firebase AI Logic (`gemini-3.6-flash`).
- **Seguridad**: Firebase App Check con reCAPTCHA Enterprise.

## 📦 Instalación y Configuración Local

Sigue estos pasos para desplegar el proyecto en tu entorno local:

### 1. Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/facturairez.git
cd facturairez
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar Firebase
Para que el entorno local funcione con tu proyecto, asegúrate de estar autenticado en Firebase CLI:
```bash
npx firebase-tools login
```
El archivo de configuración local `src/services/firebase.js` ya está apuntando a tu proyecto, pero recuerda que el **App Check Debug Mode** solo se activa si ejecutas el proyecto en modo de desarrollo (`import.meta.env.DEV`).

### 4. Arrancar el servidor de desarrollo
```bash
npm run dev
```
La aplicación estará disponible en `http://localhost:5173`. Para poder usar el motor OCR con IA en local, copia el *Debug Token* que aparecerá en la consola del navegador y regístralo en tu Firebase Console.

## 🏗️ Construcción para Producción

Para compilar la aplicación y prepararla para su despliegue:

```bash
npm run build
```
Esto generará una carpeta `dist` con los archivos estáticos listados y minificados. Puedes subir el contenido de esta carpeta a cualquier servicio de hosting estático (Firebase Hosting, Vercel, Netlify o tu propio servidor). 

> **Nota:** En producción, la aplicación utiliza reCAPTCHA Enterprise para validar el entorno y permitir el uso de la IA de Google de manera segura.

## 📄 Licencia

Este proyecto es de uso privado. Todos los derechos reservados.
