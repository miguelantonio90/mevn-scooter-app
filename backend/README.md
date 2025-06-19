# Scooter Tracker Backend

Backend API para la aplicación de seguimiento de batería de scooters con autenticación JWT y métricas avanzadas.

## 🚀 Inicio Rápido

### Prerrequisitos
- Node.js v20.19.0 o superior
- MongoDB (local o en la nube)
- npm o yarn

### Instalación
```bash
npm install
```

### Variables de Entorno
Crear archivo `.env` en la raíz del backend:
```env
MONGO_URI=mongodb://localhost:27020/scooter-logs
JWT_SECRET=your-secret-key-change-in-production
PORT=3000
```

### Ejecutar el Servidor
```bash
# Desarrollo (con nodemon)
npm run dev

# Producción
npm start

# Crear usuario admin manualmente
node scripts/createAdmin.js
```

## 👤 Usuario Administrador por Defecto

Al iniciar el servidor por primera vez, se crea automáticamente un usuario administrador:

- **Email:** admin@scooter.com
- **Password:** admin123
- **Nombre:** Administrador

### Crear Usuario Admin Manualmente
```bash
node scripts/createAdmin.js
```

## 📊 Datos de Ejemplo

El sistema también crea automáticamente logs de ejemplo para el usuario administrador, incluyendo:

- Diferentes condiciones climáticas
- Varios tipos de terreno
- Diferentes distancias y eficiencias
- Notas descriptivas
- Datos para mostrar métricas y gráficos

## 🔧 Estructura del Proyecto

```
backend/
├── config/
│   ├── database.js          # Configuración MongoDB y conexión
│   ├── initData.js          # Inicialización de datos por defecto
│   └── sampleData.js        # Datos de ejemplo para testing
├── controllers/
│   ├── authController.js    # Lógica de autenticación y usuarios
│   └── logController.js     # CRUD de logs y cálculos de eficiencia
├── middleware/
│   └── auth.js             # Middleware JWT para rutas protegidas
├── models/
│   ├── User.js             # Modelo de Usuario con validaciones
│   └── Log.js              # Modelo de Log con cálculos automáticos
├── routes/
│   ├── auth.js             # Rutas de autenticación y perfil
│   └── logs.js             # Rutas de gestión de logs
├── scripts/
│   └── createAdmin.js      # Script para crear usuario admin
├── package.json
└── server.js               # Servidor Express principal
```

## 🔌 Endpoints API

### 🔐 Autenticación
- `POST /api/auth/register` - Registrar nuevo usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/profile` - Obtener perfil del usuario (protegido)
- `PUT /api/auth/profile` - Actualizar perfil del usuario (protegido)

### 📊 Logs y Métricas
- `GET /api/logs` - Obtener todos los logs del usuario autenticado
- `POST /api/logs` - Crear nuevo log de batería
- `PUT /api/logs/:id` - Actualizar log existente
- `DELETE /api/logs/:id` - Eliminar log
- `GET /api/logs/efficiency` - Obtener métricas de eficiencia

### 🏥 Sistema
- `GET /api/health` - Health check del servidor

## 📋 Esquemas de Datos

### Usuario (User)
```javascript
{
  name: String,           // Requerido: Nombre completo
  email: String,          // Requerido: Email único
  password: String,       // Requerido: Contraseña encriptada
  motorPower: Number,     // Opcional: Potencia del motor en watts
  batteryCapacity: Number // Opcional: Capacidad de batería en Ah
}
```

### Log de Batería (Log)
```javascript
{
  userId: ObjectId,       // Requerido: Referencia al usuario
  date: Date,             // Requerido: Fecha del registro
  voltage: Number,        // Requerido: Voltaje (60V-84V)
  kmTravelled: Number,    // Requerido: Distancia en kilómetros
  notes: String,          // Opcional: Notas adicionales
  efficiency: Number      // Calculado: Porcentaje de eficiencia
}
```

## 🔐 Seguridad

### Autenticación JWT
- Tokens JWT con expiración de 24 horas
- Middleware de autenticación para rutas protegidas
- Validación automática de tokens en cada petición

### Encriptación
- Contraseñas encriptadas con bcrypt (salt rounds: 10)
- Validación de datos en modelos con Mongoose
- Sanitización de inputs

### Validaciones
- Email único por usuario
- Voltaje entre 60V y 84V
- Distancia positiva
- Campos requeridos validados

## 📊 Cálculos Automáticos

### Eficiencia de Batería
```javascript
efficiency = (kmTravelled / (voltage * batteryCapacity)) * 100
```

### Porcentaje de Batería
```javascript
batteryPercent = ((voltage - 60) / (84 - 60)) * 100
```

## 🚀 Scripts Disponibles

### Desarrollo
```bash
npm run dev          # Servidor con nodemon
npm start           # Servidor de producción
```

### Utilidades
```bash
node scripts/createAdmin.js  # Crear usuario admin
```

## 📝 Logging

El servidor registra todas las peticiones HTTP con timestamp:
```
2024-01-20T10:30:00.000Z - POST /api/auth/login - 200
2024-01-20T10:30:01.000Z - GET /api/logs - 200
2024-01-20T10:30:02.000Z - POST /api/logs - 201
```

## 🔧 Configuración

### MongoDB
- Conexión automática al iniciar el servidor
- Reintentos de conexión automáticos
- Soporte para MongoDB local y en la nube

### CORS
- Configurado para permitir peticiones del frontend
- Headers de autorización habilitados
- Métodos HTTP permitidos: GET, POST, PUT, DELETE

### Rate Limiting
- Límites de peticiones por IP
- Protección contra ataques de fuerza bruta

## 🐛 Debugging

### Variables de Entorno de Desarrollo
```env
NODE_ENV=development
DEBUG=true
LOG_LEVEL=debug
```

### Logs de Error
- Errores detallados en desarrollo
- Logs estructurados en producción
- Stack traces para debugging

## 📈 Métricas y Monitoreo

### Health Check
- Estado de la base de datos
- Memoria del servidor
- Tiempo de respuesta

### Métricas de Eficiencia
- Promedio de eficiencia por usuario
- Tendencias temporales
- Comparativas de rendimiento

## 🚀 Deployment

### Variables de Producción
```env
NODE_ENV=production
MONGO_URI=mongodb+srv://...
JWT_SECRET=very-secure-secret-key
PORT=3000
```

### Optimizaciones
- Compresión gzip
- Cache headers
- Rate limiting
- Logging estructurado