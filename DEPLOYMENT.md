# 🚀 Guía de Despliegue - Scooter Tracker App

Esta guía te ayudará a desplegar tu aplicación MEVN de tracking de scooters en servidores gratuitos.

## 📋 Opciones de Despliegue Gratuito

### 1. **Render.com** (Recomendado) ⭐
- **Backend**: Node.js hosting gratuito
- **Frontend**: Static site hosting gratuito
- **Base de datos**: MongoDB Atlas (gratuito)
- **Ventajas**: Fácil configuración, SSL automático, dominio personalizado

### 2. **Railway.app**
- Backend y frontend en un solo lugar
- Base de datos incluida
- Muy fácil de configurar

### 3. **Vercel + Railway**
- Frontend en Vercel (muy rápido)
- Backend en Railway
- Excelente performance

## 🗄️ Configuración de Base de Datos

### MongoDB Atlas (Gratuito)
1. Ve a [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Crea una cuenta gratuita
3. Crea un nuevo cluster (gratuito)
4. Configura un usuario y contraseña
5. Obtén la URL de conexión
6. Configura las IPs permitidas (0.0.0.0/0 para desarrollo)

## 🚀 Despliegue en Render.com

### Paso 1: Preparar el Backend

1. **Fork o clona tu repositorio**
2. **Configura las variables de entorno en Render:**
   - `NODE_ENV=production`
   - `MONGODB_URI=tu_url_de_mongodb_atlas`
   - `JWT_SECRET=tu_clave_secreta_muy_larga`
   - `PORT=3000`

### Paso 2: Desplegar el Backend

1. Ve a [Render.com](https://render.com)
2. Crea una cuenta
3. Haz clic en "New Web Service"
4. Conecta tu repositorio de GitHub
5. Configura:
   - **Name**: `scooter-tracker-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: `Free`

### Paso 3: Desplegar el Frontend

1. En Render, haz clic en "New Static Site"
2. Conecta tu repositorio
3. Configura:
   - **Name**: `scooter-tracker-frontend`
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Publish Directory**: `frontend/dist`
   - **Plan**: `Free`

4. **Configura las variables de entorno:**
   - `VITE_API_BASE=https://tu-backend.onrender.com/api`

## 🚂 Despliegue en Railway

### Opción 1: Backend + Frontend Separados

1. Ve a [Railway.app](https://railway.app)
2. Crea una cuenta
3. Haz clic en "New Project"
4. Selecciona "Deploy from GitHub repo"
5. Configura dos servicios:

**Backend:**
- **Name**: `scooter-backend`
- **Root Directory**: `backend`
- **Build Command**: `npm install`
- **Start Command**: `npm start`

**Frontend:**
- **Name**: `scooter-frontend`
- **Root Directory**: `frontend`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm run serve`

### Opción 2: Todo en Uno (Recomendado)

1. Crea un nuevo proyecto en Railway
2. Conecta tu repositorio
3. Railway detectará automáticamente la estructura
4. Configura las variables de entorno

## ⚡ Despliegue en Vercel + Railway

### Frontend en Vercel

1. Ve a [Vercel.com](https://vercel.com)
2. Crea una cuenta
3. Importa tu repositorio
4. Configura:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

5. **Configura las variables de entorno:**
   - `VITE_API_BASE=https://tu-backend.railway.app/api`

### Backend en Railway

Sigue los pasos de Railway para el backend.

## 🔧 Variables de Entorno

### Backend (.env)
```env
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/scooter_tracker
JWT_SECRET=tu_clave_secreta_muy_larga_y_compleja
CORS_ORIGIN=https://tu-frontend.vercel.app
```

### Frontend (.env)
```env
VITE_API_BASE=https://tu-backend.onrender.com/api
VITE_APP_TITLE=Scooter Tracker
VITE_APP_VERSION=1.0.0
```

## 🌐 Dominios Personalizados

### Render.com
- Ve a tu servicio
- Settings → Custom Domains
- Agrega tu dominio
- Configura los DNS

### Vercel
- Dashboard → Settings → Domains
- Agrega tu dominio
- Sigue las instrucciones de DNS

## 🔒 SSL/HTTPS

- **Render**: Automático
- **Railway**: Automático
- **Vercel**: Automático

## 📊 Monitoreo

### Render.com
- Logs en tiempo real
- Métricas de performance
- Alertas automáticas

### Railway
- Logs en tiempo real
- Métricas de uso
- Health checks

### Vercel
- Analytics
- Performance insights
- Error tracking

## 🚨 Troubleshooting

### Problemas Comunes

1. **Error de CORS**
   - Verifica que `CORS_ORIGIN` esté configurado correctamente
   - Asegúrate de que la URL del frontend esté incluida

2. **Error de conexión a MongoDB**
   - Verifica la URL de MongoDB Atlas
   - Asegúrate de que las IPs estén configuradas correctamente

3. **Error de build**
   - Verifica que todas las dependencias estén en `package.json`
   - Revisa los logs de build

4. **Error de variables de entorno**
   - Verifica que todas las variables estén configuradas
   - Asegúrate de que los nombres coincidan exactamente

### Logs Útiles

```bash
# Render
render logs

# Railway
railway logs

# Vercel
vercel logs
```

## 📱 Testing Post-Despliegue

1. **Verifica el health check:**
   ```
   GET https://tu-backend.onrender.com/api/health
   ```

2. **Prueba el registro de usuarios:**
   ```
   POST https://tu-backend.onrender.com/api/auth/register
   ```

3. **Prueba el login:**
   ```
   POST https://tu-backend.onrender.com/api/auth/login
   ```

4. **Verifica el frontend:**
   - Navega a tu URL del frontend
   - Prueba el registro y login
   - Verifica que las funcionalidades funcionen

## 🎉 ¡Listo!

Tu aplicación estará disponible en:
- **Frontend**: `https://tu-app.vercel.app`
- **Backend**: `https://tu-backend.onrender.com`
- **API Docs**: `https://tu-backend.onrender.com/api/health`

## 📞 Soporte

Si tienes problemas:
1. Revisa los logs de la plataforma
2. Verifica la configuración de variables de entorno
3. Asegúrate de que MongoDB esté funcionando
4. Contacta el soporte de la plataforma si es necesario

¡Tu aplicación de tracking de scooters estará en línea y lista para usar! 🛴✨ 