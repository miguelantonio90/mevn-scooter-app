# Scooter Tracker Backend

## 🚀 Inicio Rápido

### Instalación
```bash
npm install
```

### Variables de Entorno
```bash
MONGO_URI=mongodb://localhost:27020/scooter-logs
JWT_SECRET=your-secret-key-change-in-production
PORT=3000
```

### Ejecutar el Servidor
```bash
# Desarrollo
npm run dev

# Producción
npm start
```

## 👤 Usuario Administrador por Defecto

Al iniciar el servidor por primera vez, se crea automáticamente un usuario administrador:

- **Email:** admin@gmail.com
- **Password:** admin
- **Username:** admin
- **Nombre:** Administrador

### Crear Usuario Admin Manualmente
```bash
npm run create-admin
```

## 📊 Datos de Ejemplo

El sistema también crea automáticamente 5 logs de ejemplo para el usuario administrador, incluyendo:

- Diferentes condiciones climáticas
- Varios tipos de terreno
- Diferentes distancias y eficiencias
- Notas descriptivas

## 🔧 Estructura del Proyecto

```
backend/
├── config/
│   ├── database.js          # Configuración MongoDB
│   ├── initData.js          # Inicialización de datos
│   └── sampleData.js        # Datos de ejemplo
├── controllers/
│   ├── authController.js    # Autenticación
│   └── logController.js     # Logs y métricas
├── middleware/
│   └── auth.js             # JWT Auth
├── models/
│   ├── User.js             # Modelo Usuario
│   └── Log.js              # Modelo Log
├── routes/
│   ├── auth.js             # Rutas Auth
│   └── logs.js             # Rutas Logs
├── scripts/
│   └── createAdmin.js      # Script Admin
└── server.js               # Servidor Principal
```

## 🔌 Endpoints API

### Autenticación
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/verify` - Verificar token

### Logs
- `GET /api/logs` - Obtener logs del usuario
- `POST /api/logs` - Crear nuevo log
- `PUT /api/logs/:id` - Actualizar log
- `DELETE /api/logs/:id` - Eliminar log
- `GET /api/logs/metrics/efficiency` - Métricas de eficiencia

### Sistema
- `GET /api/health` - Health check

## 🔐 Seguridad

- Contraseñas encriptadas con bcrypt
- JWT tokens con expiración de 24 horas
- Validación de datos en modelos
- Middleware de autenticación en rutas protegidas

## 📝 Logs

El servidor registra todas las peticiones HTTP con timestamp:
```
2024-01-20T10:30:00.000Z - POST /api/auth/login
2024-01-20T10:30:01.000Z - GET /api/logs
``` 