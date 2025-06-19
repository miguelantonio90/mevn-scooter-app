<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <!-- Loading overlay -->
    <div v-if="loading" class="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
      <div class="text-center">
        <svg class="mx-auto h-12 w-12 text-primary-600 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
        </svg>
        <p class="mt-2 text-sm text-gray-600">Cargando aplicación...</p>
      </div>
    </div>

    <!-- Main content -->
    <div v-else>
      <!-- Login/Register forms -->
      <div v-if="!isAuthenticated" class="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100">
        <div class="max-w-md w-full space-y-8">
          <div class="text-center">
            <h2 class="text-3xl font-bold text-gray-900">Scooter Tracker</h2>
            <p class="mt-2 text-sm text-gray-600">Gestiona tu scooter de manera inteligente</p>
          </div>
          
          <!-- Tab buttons -->
          <div class="flex rounded-lg bg-gray-100 p-1">
            <button 
              @click="activeTab = 'login'"
              :class="[
                'flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors',
                activeTab === 'login' 
                  ? 'bg-white text-primary-600 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
              ]"
            >
              Iniciar Sesión
            </button>
            <button 
              @click="activeTab = 'register'"
              :class="[
                'flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors',
                activeTab === 'register' 
                  ? 'bg-white text-primary-600 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
              ]"
            >
              Registrarse
            </button>
          </div>

          <!-- Error message -->
          <div v-if="authError" class="bg-danger-50 border border-danger-200 rounded-md p-4">
            <div class="flex">
              <svg class="w-5 h-5 text-danger-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <p class="ml-3 text-sm text-danger-700">{{ authError }}</p>
            </div>
          </div>

          <!-- Forms -->
          <Login v-if="activeTab === 'login'" @login-success="handleLoginSuccess" @login-error="handleAuthError" />
          <Register v-if="activeTab === 'register'" @register-success="handleRegisterSuccess" @register-error="handleAuthError" />
        </div>
      </div>

      <!-- Main app with sidebar -->
      <div v-else class="flex h-screen bg-gray-50">
        <!-- Sidebar -->
        <Sidebar 
          :current-page="currentPage" 
          @navigate="handleNavigation"
          @logout="handleLogout"
        />

        <!-- Main content area -->
        <div class="flex-1 flex flex-col overflow-hidden">
          <!-- Header -->
          <header class="bg-white shadow-sm border-b border-gray-200">
            <div class="px-6 py-4">
              <h1 class="text-2xl font-bold text-gray-900">
                {{ pageTitle }}
              </h1>
            </div>
          </header>

          <!-- Page content -->
          <main class="flex-1 overflow-y-auto p-6">
            <Dashboard v-if="currentPage === 'dashboard'" />
            <LogForm v-if="currentPage === 'form'" @log-created="handleLogCreated" />
          </main>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import Login from './components/Login.vue'
import Register from './components/Register.vue'
import Dashboard from './components/Dashboard.vue'
import LogForm from './components/LogForm.vue'
import Sidebar from './components/Sidebar.vue'

export default {
  name: 'App',
  components: {
    Login,
    Register,
    Dashboard,
    LogForm,
    Sidebar
  },
  setup() {
    const isAuthenticated = ref(false)
    const currentPage = ref('dashboard')
    const activeTab = ref('login')
    const loading = ref(true)
    const authError = ref('')

    const pageTitle = computed(() => {
      const titles = {
        dashboard: 'Dashboard',
        form: 'Nuevo Registro'
      }
      return titles[currentPage.value] || 'Dashboard'
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

    onMounted(() => {
      checkAuth()
      loading.value = false
    })

    return {
      isAuthenticated,
      currentPage,
      activeTab,
      loading,
      authError,
      pageTitle,
      handleLoginSuccess,
      handleRegisterSuccess,
      handleAuthError,
      handleNavigation,
      handleLogout,
      handleLogCreated
    }
  }
}
</script>
