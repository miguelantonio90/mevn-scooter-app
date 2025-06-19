#!/bin/bash

# 🚀 Script de Despliegue Automatizado - Scooter Tracker App
# Este script te ayuda a desplegar tu aplicación en servidores gratuitos

set -e  # Salir si hay algún error

echo "🚀 Iniciando despliegue de Scooter Tracker App..."
echo "=================================================="

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para imprimir con colores
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ] && [ ! -f "backend/package.json" ]; then
    print_error "No se encontró package.json. Asegúrate de estar en el directorio raíz del proyecto."
    exit 1
fi

print_status "Verificando estructura del proyecto..."

# Verificar estructura del proyecto
if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    print_error "Estructura del proyecto incorrecta. Debe tener carpetas 'backend' y 'frontend'."
    exit 1
fi

print_success "Estructura del proyecto verificada"

# Verificar que Git esté configurado
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    print_error "No se encontró un repositorio Git. Inicializa Git primero."
    exit 1
fi

print_status "Verificando estado de Git..."

# Verificar si hay cambios sin commitear
if ! git diff-index --quiet HEAD --; then
    print_warning "Hay cambios sin commitear. ¿Quieres hacer commit antes del despliegue? (y/n)"
    read -r response
    if [[ "$response" =~ ^[Yy]$ ]]; then
        print_status "Haciendo commit de cambios..."
        git add .
        git commit -m "Deploy: $(date)"
        print_success "Cambios commiteados"
    else
        print_warning "Continuando sin commit..."
    fi
fi

# Verificar que el repositorio tenga un remote
if ! git remote get-url origin > /dev/null 2>&1; then
    print_error "No se encontró un remote 'origin'. Configura tu repositorio de GitHub primero."
    exit 1
fi

print_success "Repositorio Git verificado"

# Mostrar opciones de despliegue
echo ""
echo "📋 Opciones de despliegue disponibles:"
echo "1. Render.com (Recomendado)"
echo "2. Railway.app"
echo "3. Vercel + Railway"
echo "4. Solo verificar configuración"
echo ""

read -p "Selecciona una opción (1-4): " choice

case $choice in
    1)
        print_status "Preparando despliegue en Render.com..."
        deploy_render
        ;;
    2)
        print_status "Preparando despliegue en Railway..."
        deploy_railway
        ;;
    3)
        print_status "Preparando despliegue en Vercel + Railway..."
        deploy_vercel_railway
        ;;
    4)
        print_status "Verificando configuración..."
        check_configuration
        ;;
    *)
        print_error "Opción inválida"
        exit 1
        ;;
esac

# Función para verificar configuración
check_configuration() {
    echo ""
    print_status "Verificando configuración del proyecto..."
    
    # Verificar package.json del backend
    if [ -f "backend/package.json" ]; then
        print_success "✓ backend/package.json encontrado"
        
        # Verificar scripts
        if grep -q '"start"' backend/package.json; then
            print_success "✓ Script 'start' encontrado en backend"
        else
            print_error "✗ Script 'start' no encontrado en backend"
        fi
    else
        print_error "✗ backend/package.json no encontrado"
    fi
    
    # Verificar package.json del frontend
    if [ -f "frontend/package.json" ]; then
        print_success "✓ frontend/package.json encontrado"
        
        # Verificar scripts
        if grep -q '"build"' frontend/package.json; then
            print_success "✓ Script 'build' encontrado en frontend"
        else
            print_error "✗ Script 'build' no encontrado en frontend"
        fi
    else
        print_error "✗ frontend/package.json no encontrado"
    fi
    
    # Verificar archivos de configuración
    if [ -f "backend/render.yaml" ]; then
        print_success "✓ backend/render.yaml encontrado"
    else
        print_warning "⚠ backend/render.yaml no encontrado"
    fi
    
    if [ -f "frontend/render.yaml" ]; then
        print_success "✓ frontend/render.yaml encontrado"
    else
        print_warning "⚠ frontend/render.yaml no encontrado"
    fi
    
    if [ -f "frontend/vercel.json" ]; then
        print_success "✓ frontend/vercel.json encontrado"
    else
        print_warning "⚠ frontend/vercel.json no encontrado"
    fi
    
    # Verificar variables de entorno
    if [ -f "backend/env.example" ]; then
        print_success "✓ backend/env.example encontrado"
    else
        print_warning "⚠ backend/env.example no encontrado"
    fi
    
    if [ -f "frontend/env.example" ]; then
        print_success "✓ frontend/env.example encontrado"
    else
        print_warning "⚠ frontend/env.example no encontrado"
    fi
    
    echo ""
    print_success "Verificación completada"
    echo ""
    echo "📝 Próximos pasos:"
    echo "1. Configura MongoDB Atlas (gratuito)"
    echo "2. Sigue la guía en DEPLOYMENT.md"
    echo "3. Configura las variables de entorno en tu plataforma"
}

# Función para despliegue en Render
deploy_render() {
    echo ""
    print_status "Despliegue en Render.com"
    echo "============================"
    echo ""
    echo "📋 Pasos para desplegar en Render:"
    echo ""
    echo "1. 🌐 Ve a https://render.com y crea una cuenta"
    echo ""
    echo "2. 🗄️ Configura MongoDB Atlas:"
    echo "   - Ve a https://www.mongodb.com/atlas"
    echo "   - Crea un cluster gratuito"
    echo "   - Obtén la URL de conexión"
    echo ""
    echo "3. 🚀 Despliega el Backend:"
    echo "   - Haz clic en 'New Web Service'"
    echo "   - Conecta tu repositorio de GitHub"
    echo "   - Configura:"
    echo "     • Name: scooter-tracker-backend"
    echo "     • Environment: Node"
    echo "     • Build Command: npm install"
    echo "     • Start Command: npm start"
    echo "     • Plan: Free"
    echo ""
    echo "4. ⚙️ Configura las variables de entorno del backend:"
    echo "   • NODE_ENV=production"
    echo "   • MONGODB_URI=tu_url_de_mongodb_atlas"
    echo "   • JWT_SECRET=tu_clave_secreta_muy_larga"
    echo "   • PORT=3000"
    echo ""
    echo "5. 🌐 Despliega el Frontend:"
    echo "   - Haz clic en 'New Static Site'"
    echo "   - Conecta tu repositorio"
    echo "   - Configura:"
    echo "     • Name: scooter-tracker-frontend"
    echo "     • Build Command: cd frontend && npm install && npm run build"
    echo "     • Publish Directory: frontend/dist"
    echo "     • Plan: Free"
    echo ""
    echo "6. ⚙️ Configura las variables de entorno del frontend:"
    echo "   • VITE_API_BASE=https://tu-backend.onrender.com/api"
    echo ""
    print_success "¡Tu aplicación estará disponible en Render!"
}

# Función para despliegue en Railway
deploy_railway() {
    echo ""
    print_status "Despliegue en Railway.app"
    echo "============================="
    echo ""
    echo "📋 Pasos para desplegar en Railway:"
    echo ""
    echo "1. 🌐 Ve a https://railway.app y crea una cuenta"
    echo ""
    echo "2. 🚂 Crea un nuevo proyecto:"
    echo "   - Haz clic en 'New Project'"
    echo "   - Selecciona 'Deploy from GitHub repo'"
    echo "   - Conecta tu repositorio"
    echo ""
    echo "3. ⚙️ Configura las variables de entorno:"
    echo "   • NODE_ENV=production"
    echo "   • MONGODB_URI=tu_url_de_mongodb_atlas"
    echo "   • JWT_SECRET=tu_clave_secreta_muy_larga"
    echo "   • PORT=3000"
    echo ""
    echo "4. 🔧 Railway detectará automáticamente la estructura"
    echo "   - Backend en la carpeta 'backend'"
    echo "   - Frontend en la carpeta 'frontend'"
    echo ""
    print_success "¡Tu aplicación estará disponible en Railway!"
}

# Función para despliegue en Vercel + Railway
deploy_vercel_railway() {
    echo ""
    print_status "Despliegue en Vercel + Railway"
    echo "==================================="
    echo ""
    echo "📋 Pasos para desplegar:"
    echo ""
    echo "1. 🚂 Primero despliega el Backend en Railway:"
    echo "   - Ve a https://railway.app"
    echo "   - Crea un nuevo proyecto"
    echo "   - Conecta tu repositorio"
    echo "   - Configura las variables de entorno"
    echo ""
    echo "2. ⚡ Luego despliega el Frontend en Vercel:"
    echo "   - Ve a https://vercel.com"
    echo "   - Crea una cuenta"
    echo "   - Importa tu repositorio"
    echo "   - Configura:"
    echo "     • Framework Preset: Vite"
    echo "     • Root Directory: frontend"
    echo "     • Build Command: npm run build"
    echo "     • Output Directory: dist"
    echo ""
    echo "3. ⚙️ Configura las variables de entorno en Vercel:"
    echo "   • VITE_API_BASE=https://tu-backend.railway.app/api"
    echo ""
    print_success "¡Tu aplicación estará disponible en Vercel + Railway!"
}

echo ""
print_success "¡Despliegue completado! 🎉"
echo ""
echo "📚 Para más detalles, consulta DEPLOYMENT.md"
echo "🆘 Si tienes problemas, revisa la sección de troubleshooting" 