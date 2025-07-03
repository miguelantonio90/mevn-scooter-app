<template>
  <div id="app" class="min-h-screen bg-gray-50 dark:bg-gray-900 dark:text-gray-200">
    <!-- Loading overlay -->
    <div v-if="loading" class="fixed inset-0 bg-white dark:bg-gray-900 bg-opacity-75 dark:bg-opacity-75 flex items-center justify-center z-50">
      <div class="text-center">
        <svg class="mx-auto h-12 w-12 text-primary-600 dark:text-primary-400 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
        </svg>
        <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">Cargando aplicación...</p>
      </div>
    </div>

    <!-- Main content -->
    <div v-else>
      <!-- Login/Register forms -->
      <div v-if="!isAuthenticated" class="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-800 dark:to-gray-900">
        <div class="max-w-md w-full space-y-8 p-8 bg-white dark:bg-gray-800 shadow-xl rounded-lg">
          <div class="text-center">
            <h2 class="text-3xl font-bold text-gray-900 dark:text-white">Scooter Tracker</h2>
            <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">Gestiona tu scooter de manera inteligente</p>
          </div>
          
          <!-- Tab buttons -->
          <div class="flex rounded-lg bg-gray-100 dark:bg-gray-700 p-1">
            <button 
              @click="activeTab = 'login'"
              :class="[
                'flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors',
                activeTab === 'login' 
                  ? 'bg-white dark:bg-primary-500 dark:text-white text-primary-600 shadow-sm'
                  : 'text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white'
              ]"
            >
              Iniciar Sesión
            </button>
            <button 
              @click="activeTab = 'register'"
              :class="[
                'flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors',
                activeTab === 'register' 
                  ? 'bg-white dark:bg-primary-500 dark:text-white text-primary-600 shadow-sm'
                  : 'text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white'
              ]"
            >
              Registrarse
            </button>
          </div>

          <!-- Error message -->
          <div v-if="authError" class="bg-danger-50 dark:bg-danger-900 border border-danger-200 dark:border-danger-700 rounded-md p-4">
            <div class="flex">
              <svg class="w-5 h-5 text-danger-400 dark:text-danger-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <p class="ml-3 text-sm text-danger-700 dark:text-danger-200">{{ authError }}</p>
            </div>
          </div>

          <!-- Forms -->
          <Login v-if="activeTab === 'login'" @login-success="handleLoginSuccess" @login-error="handleAuthError" />
          <Register v-if="activeTab === 'register'" @register-success="handleRegisterSuccess" @register-error="handleAuthError" />
        </div>
      </div>

      <!-- Main app with sidebar -->
      <div v-else class="flex h-screen bg-gray-50 dark:bg-gray-900">
        <!-- Sidebar -->
        <Sidebar 
          :current-page="currentPage" 
          :is-open="sidebarOpen"
          @navigate="handleNavigation"
          @close="sidebarOpen = false"
          @logout="handleLogout"
        />

        <!-- Main content area -->
        <div class="flex-1 flex flex-col overflow-hidden transition-all duration-300 ease-in-out lg:ml-64" :class="sidebarOpen ? 'ml-64' : 'ml-0'">
          <!-- Header -->
          <header class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out">
            <div class="flex items-center justify-between px-6 py-4">
              <div class="flex items-center space-x-4">
                <!-- Toggle sidebar button - solo visible en tablet/móvil -->
                <button 
                  @click="sidebarOpen = !sidebarOpen"
                  class="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  :title="sidebarOpen ? 'Ocultar menú' : 'Mostrar menú'"
                >
                  <svg v-if="sidebarOpen" class="w-6 h-6 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                  <svg v-else class="w-6 h-6 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                  </svg>
                </button>
                
                <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
                  {{ pageTitle }}
                </h1>
              </div>
              
              <!-- User info in header -->
              <div class="flex items-center space-x-3">
                <div class="text-right">
                  <p class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ user?.name || 'Usuario' }}</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">{{ user?.email || 'usuario@email.com' }}</p>
                </div>
                <div class="w-8 h-8 bg-gradient-to-br from-primary-500 to-indigo-600 rounded-full flex items-center justify-center">
                  <span class="text-white font-semibold text-xs">{{ userInitials }}</span>
                </div>
              </div>
            </div>
          </header>

          <!-- Page content -->
          <main class="flex-1 overflow-y-auto p-6 transition-all duration-300 ease-in-out bg-gray-100 dark:bg-gray-800">
            <Dashboard v-if="currentPage === 'dashboard'" />
            <LogForm v-if="currentPage === 'form'" @log-created="handleLogCreated" />
            <LogHistory v-if="currentPage === 'history'" @edit-log="handleEditLog" />
            <Profile v-if="currentPage === 'profile'" />
            <Settings v-if="currentPage === 'settings'" />
          </main>
        </div>
      </div>
    </div>
    <NotificationContainer />
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useTheme } from './composables/useTheme'
import Login from './components/Login.vue'
import Register from './components/Register.vue'
import Dashboard from './components/Dashboard.vue'
import LogForm from './components/LogForm.vue'
import LogHistory from './components/LogHistory.vue'
import Profile from './components/Profile.vue'
import Settings from './components/Settings.vue'
import Sidebar from './components/Sidebar.vue'
import NotificationContainer from './components/NotificationContainer.vue'

export default {
  name: 'App',
  components: {
    Login,
    Register,
    Dashboard,
    LogForm,
    LogHistory,
    Profile,
    Settings,
    Sidebar,
    NotificationContainer
  },
  setup() {
    const { isDarkMode, loadTheme } = useTheme(); // Cargar y exponer estado del tema

    const isAuthenticated = ref(false)
    const currentPage = ref('dashboard')
    const activeTab = ref('login')
    const loading = ref(true)
    const authError = ref('')
    const sidebarOpen = ref(true)

    const pageTitle = computed(() => {
      const titles = {
        dashboard: 'Dashboard',
        form: 'Nuevo Registro',
        history: 'Historial de Viajes',
        profile: 'Perfil de Usuario',
        settings: 'Configuración'
      }
      return titles[currentPage.value] || 'Dashboard'
    })

    const user = computed(() => {
      try {
        return JSON.parse(localStorage.getItem('user') || '{}')
      } catch {
        return {}
      }
    })

    const userInitials = computed(() => {
      if (!user.value.name) return 'U'
      return user.value.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    })

    const checkAuth = () => {
      const token = localStorage.getItem('token')
      if (token) {
        // Verificar si el token es válido
        try {
          const payload = JSON.parse(atob(token.split('.')[1]))
          const now = Date.now() / 1000
          if (payload.exp > now) {
            isAuthenticated.value = true
          } else {
            localStorage.removeItem('token')
            isAuthenticated.value = false
          }
        } catch (error) {
          console.error('Error parsing token:', error)
          localStorage.removeItem('token')
          isAuthenticated.value = false
        }
      } else {
        isAuthenticated.value = false
      }
    }

    const handleLoginSuccess = (data) => {
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      isAuthenticated.value = true
      currentPage.value = 'dashboard'
      authError.value = ''
      console.log('Login successful:', data)
    }

    const handleRegisterSuccess = (data) => {
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      isAuthenticated.value = true
      currentPage.value = 'dashboard'
      authError.value = ''
      console.log('Registration successful:', data)
    }

    const handleAuthError = (error) => {
      authError.value = error
      console.error('Auth error:', error)
    }

    const handleNavigation = (page) => {
      currentPage.value = page
      // Solo cerrar sidebar en tablet/móvil (pantallas pequeñas)
      if (window.innerWidth < 1024) {
        sidebarOpen.value = false
      }
      // En desktop, mantener el sidebar siempre abierto
      console.log('Navigating to:', page)
    }

    const handleLogout = () => {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      isAuthenticated.value = false
      currentPage.value = 'dashboard'
      authError.value = ''
      console.log('Logout successful')
    }

    const handleLogCreated = () => {
      // Opcional: mostrar mensaje de éxito o navegar al dashboard
      currentPage.value = 'dashboard'
      console.log('Log created successfully')
    }

    const handleEditLog = (log) => {
      // Navegar al formulario con los datos del log para editar
      currentPage.value = 'form'
      // Aquí podrías pasar los datos del log al formulario
      console.log('Edit log:', log)
    }

    // Función para manejar el cambio de tamaño de ventana
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        // En desktop, siempre mantener el sidebar abierto
        sidebarOpen.value = true
      } else {
        // En tablet/móvil, cerrar el sidebar
        sidebarOpen.value = false
      }
    }

    onMounted(() => {
      checkAuth()
      loading.value = false
      
      // Agregar listener para el cambio de tamaño de ventana
      window.addEventListener('resize', handleResize)
      
      // Configurar estado inicial del sidebar según el tamaño de pantalla
      handleResize()
    })

    // Cleanup del listener cuando el componente se desmonte
    onUnmounted(() => {
      window.removeEventListener('resize', handleResize)
    })

    return {
      isAuthenticated,
      currentPage,
      activeTab,
      loading,
      authError,
      sidebarOpen,
      pageTitle,
      user,
      userInitials,
      handleLoginSuccess,
      handleRegisterSuccess,
      handleAuthError,
      handleNavigation,
      handleLogout,
      handleLogCreated,
      handleEditLog
    }
  }
}
</script>
