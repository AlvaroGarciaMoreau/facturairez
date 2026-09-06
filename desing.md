Documento de Diseño de Software (SDD)
Proyecto: Sistema de Facturación para Autónomo

Stack Tecnológico: React + Vite / Tailwind CSS / Firebase (Auth & Cloud Firestore)

Versión: 1.0

Fecha: Septiembre 2026

1. Introducción y Objetivos
1.1 Propósito
Definir la arquitectura, diseño de interfaz, modelo de datos y flujo funcional de una aplicación web ligera para la gestión, visualización e impresión de facturas divididas en tres regímenes fiscales (España, Unión Europea y Extracomunitaria/Resto del Mundo).

1.2 Alcance
Autenticación restringida mediante Google Sign-In (usuarios preautorizados en consola de Firebase).

Panel de control (Dashboard) con navegación superior y filtrado por pestañas.

CRUD básico de facturas (crear, listar, visualizar, editar y eliminar).

Vista previa imprimible de la factura conforme al diseño base almacenado en /docs.

Persistencia segura aislada por usuario en Firestore.

2. Arquitectura General y Tecnologías
2.1 Stack Técnico
Frontend: React (SPA) con Vite o Create React App.

Estilos: Tailwind CSS o CSS Modules para garantizar una interfaz limpia, moderna y legible.

Iconos: Lucide React o React Icons.

Backend como Servicio (BaaS): Firebase.

Firebase Authentication: Proveedor Google OAuth.

Cloud Firestore: Base de datos NoSQL documental para las facturas.

Impresión / Exportación: Estilos @media print de CSS nativo o react-to-print.

2.2 Estructura del Proyecto
Plaintext
facturacion-app/
├── public/
├── docs/                        # Plantilla base de factura (referencia de diseño)
├── src/
│   ├── assets/                  # Logotipo de la app y recursos estáticos
│   │   └── logo.png
│   ├── components/
│   │   ├── common/              # Navbar, Buttons, Inputs, Modal
│   │   ├── dashboard/           # Tabs, InvoiceCard, InvoiceList
│   │   └── invoices/            # InvoiceForm, InvoiceDetailView, PrintLayout
│   ├── context/
│   │   └── AuthContext.jsx      # Gestión del estado de sesión
│   ├── hooks/
│   │   └── useInvoices.js       # Hook personalizado para operaciones en Firestore
│   ├── services/
│   │   ├── firebase.js          # Inicialización de Firebase SDK
│   │   └── invoiceService.js    # Llamadas a Firestore (CRUD)
│   ├── styles/                  # Estilos globales y reglas de impresión
│   ├── App.jsx                  # Enrutador principal y layout
│   └── main.jsx
├── firebase.json
└── package.json
3. Flujo de Autenticación y Seguridad
3.1 Control de Acceso (Google Sign-In)
No existe pantalla ni enlace de autoregistro.

La pantalla inicial muestra únicamente el botón "Iniciar sesión con Google".

Si un usuario no registrado o no autorizado en la consola de Firebase intenta autenticarse, la app detecta que no está en la lista de accesos permitidos y cierra la sesión de inmediato mostrando un mensaje de advertencia.

3.2 Reglas de Seguridad en Firestore
Los datos se almacenan de forma jerárquica bajo el identificador de cada usuario autenticado (userId), garantizando total aislamiento:

JavaScript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/invoices/{invoiceId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
4. Diseño de la Interfaz de Usuario (UI/UX)
4.1 Pantalla de Login
Tarjeta centrada y sobria.

Logotipo de /assets/logo.png.

Título descriptivo y botón de inicio de sesión con Google.

4.2 Dashboard y Navegación
Navbar Superior:

Logotipo corporativo a la izquierda.

Título o indicador de espacio de trabajo.

Botón primario "+ Nueva Factura".

Avatar y botón de desconexión (Logout) a la derecha.

Pestañas de Navegación (Tabs):

España: Operaciones nacionales (IVA general, reducido, superreducido, IRPF si aplica).

Europa: Operaciones intracomunitarias (VIES / ROI, exención o inversión de sujeto pasivo).

Resto del Mundo: Exportaciones extracomunitarias (sin repercusión de IVA).

Listado de Facturas (Cards):

Cada tarjeta muestra: Número correlativo, fecha de emisión, nombre/empresa del cliente, importe total y estado.

Botones de acción directos: Editar y Eliminar (con modal de confirmación).

Al hacer clic sobre la tarjeta, se despliega la vista detallada de la factura.

4.3 Formulario de Factura (Modal o Vista dedicada)
Selector de tipo de factura (España, Europa, Resto del Mundo).

Campos del emisor (precargados por defecto con los datos del autónomo).

Campos del receptor (Razón social, NIF/CIF/VAT ID, dirección completa, email).

Fechas (Fecha de emisión y fecha de operación).

Tabla dinámica de líneas de factura:

Descripción, cantidad, precio unitario, tasa de IVA (%) y subtotal calculado automáticamente.

Desglose: Base imponible, IVA desglosado, retención de IRPF (si aplica) y total neto.

Botones de acción: Guardar (persistencia en Firebase) y Cancelar.

4.4 Vista Detallada e Impresión
Renderizado visual idéntico a la plantilla de referencia en /docs.

Encabezado con logotipo, datos fiscales de emisor y cliente, desglose correlativo y totales.

Botón "Imprimir / Guardar PDF" que dispara el comando window.print() con CSS adaptado (oculta navbar, botones y fondos innecesarios para un formato DIN-A4 perfecto).

5. Modelo de Datos (Cloud Firestore)
Ruta: /users/{userId}/invoices/{invoiceId}

TypeScript
interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  vatRate: number; // Ej: 21, 10, 4, 0
  total: number;
}

interface Invoice {
  id?: string;
  type: 'spain' | 'europe' | 'world';
  invoiceNumber: string;         // Ej: INV-2026-001
  issueDate: string;             // ISO Date (YYYY-MM-DD)
  supplyDate?: string;
  
  // Emisor
  issuer: {
    name: string;
    nif: string;
    address: string;
    city: string;
    postalCode: string;
    province: string;
    country: string;
    email: string;
  };

  // Receptor / Cliente
  client: {
    name: string;
    taxId: string;               // NIF/CIF o VAT ID europeo
    address: string;
    city: string;
    postalCode: string;
    province: string;
    country: string;
    email?: string;
  };

  items: InvoiceItem[];
  
  // Totales
  subtotal: number;
  vatTotal: number;
  irpfRate?: number;            // Porcentaje de retención si aplica (ej: 15% o 7%)
  irpfTotal?: number;
  shippingCost?: number;
  total: number;
  
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
6. Módulos y Lógica de Negocio
6.1 Cálculo Fiscal por Región
Facturas España:

Admite desglose de IVA (21%, 10%, 4%) y cálculo automático de retención de IRPF si el cliente es otra empresa o autónomo en España.

Facturas Europa:

Validación de NIF-IVA intracomunitario. Se emite por defecto al 0% de IVA (Inversión del sujeto pasivo / entrega intracomunitaria exenta) con mención legal correspondiente en las notas de la factura.

Facturas Resto del Mundo:

Operaciones exentas de IVA por considerarse exportación de servicios o bienes.

6.2 Eliminación y Modificación
La edición de una factura existente actualiza su updatedAt sin duplicar el registro.

La eliminación solicita confirmación modal previa para evitar pérdidas accidentales.

7. Requisitos de Impresión (Estilos Print)
Se incorporará una hoja de estilos @media print en la vista de detalle:

Ocultación de cabeceras de navegación, barras laterales y botones de acción (display: none;).

Ajuste de márgenes a tamaño estándar de hoja A4 (margin: 15mm;).

Eliminación de sombras, bordes decorativos innecesarios y optimización de contraste blanco y negro para tóner/tinta.