facturairez/
├── docs/                        # Plantilla base y especificaciones fiscales
├── public/
│   └── favicon.ico
├── src/
│   ├── assets/
│   │   └── logo.png             # Logotipo oficial
│   ├── components/
│   │   ├── auth/
│   │   │   └── Login.jsx        # Pantalla de acceso restringido con Google
│   │   ├── layout/
│   │   │   ├── Navbar.jsx       # Barra superior con logo, botón '+ Nueva Factura' y perfil
│   │   │   └── Tabs.jsx         # Selector de pestañas: España, Europa, Resto del Mundo
│   │   ├── invoices/
│   │   │   ├── InvoiceCard.jsx  # Tarjeta individual con acciones (Editar/Eliminar)
│   │   │   ├── InvoiceList.jsx  # Grid responsivo de tarjetas
│   │   │   ├── InvoiceModal.jsx # Formulario reactivo para alta/edición de factura
│   │   │   └── InvoicePrint.jsx # Plantilla de visualización e impresión DIN-A4
│   │   └── ui/                  # Componentes base (Botones, Modales, Inputs accesibles)
│   ├── context/
│   │   └── AuthContext.jsx      # Proveedor de autenticación Firebase
│   ├── hooks/
│   │   └── useInvoices.js       # Hook reactivo de sincronización con Firestore
│   ├── services/
│   │   ├── firebase.js          # Inicialización del SDK de Firebase
│   │   └── invoiceService.js    # Operaciones CRUD en Firestore
│   ├── styles/
│   │   ├── globals.css          # Configuración de Tailwind y fuentes
│   │   └── print.css            # Reglas @media print para generar A4 limpio
│   ├── App.jsx
│   └── main.jsx
├── tailwind.config.js
├── vite.config.js
└── package.json