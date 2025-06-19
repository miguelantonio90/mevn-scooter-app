<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Login/Register -->
    <Login v-if="!isAuthenticated" @login-success="handleLoginSuccess" />

    <!-- Aplicación principal -->
    <div v-else class="flex">
      <!-- Sidebar -->
      <Sidebar 
        :user="user"
        :current-view="currentView"
        :is-open="sidebarOpen"
        @navigate="handleNavigation"
        @close="sidebarOpen = false"
        @logout="handleLogout"
      />

      <!-- Contenido principal -->
      <div class="flex-1 lg:ml-64">
        <!-- Header móvil -->
        <div class="lg:hidden bg-white shadow-sm border-b border-gray-200">
          <div class="flex items-center justify-between px-4 py-3">
            <button @click="sidebarOpen = true" class="p-2 rounded-lg hover:bg-gray-100">
              <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
            <h1 class="text-lg font-semibold text-gray-900">Scooter Tracker</h1>
            <div class="w-8"></div>
          </div>
        </div>

        <!-- Contenido de la vista actual -->
        <main class="p-4 lg:p-8">
          <!-- Dashboard -->
          <Dashboard v-if="currentView === 'dashboard'" :logs="logs" :token="token" />

          <!-- Formulario -->
          <LogForm 
            v-else-if="currentView === 'form'"
            :logs="logs"
            :token="token"
            @log-saved="fetchLogs"
            @log-updated="fetchLogs"
            ref="logFormRef"
          />

          <!-- Historial de logs -->
          <div v-else-if="currentView === 'logs'" class="space-y-6">
            <div class="card">
              <div class="card-header">
                <h2 class="text-xl font-semibold text-gray-900">Historial de Viajes</h2>
              </div>
              <div class="card-body">
                <div class="overflow-hidden">
                  <div v-if="logs.length === 0" class="text-center py-12">
                    <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                    </svg>
                    <h3 class="mt-2 text-sm font-medium text-gray-900">No hay registros</h3>
                    <p class="mt-1 text-sm text-gray-500">Comienza agregando tu primer viaje.</p>
                  </div>
                  
                  <div v-else class="space-y-4">
                    <div 
                      v-for="log in logs" 
                      :key="log._id" 
                      class="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200"
                    >
                      <div class="flex items-start justify-between">
                        <div class="flex-1">
                          <div class="flex items-center space-x-3 mb-3">
                            <div class="flex items-center space-x-2">
                              <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                              </svg>
                              <span class="text-lg font-semibold text-gray-900">{{ formatDate(log.date) }}</span>
                            </div>
                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                              {{ log.kmTravelled }} km
                            </span>
                          </div>
                          
                          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                            <div>
                              <p class="text-sm font-medium text-gray-500">Voltaje</p>
                              <p class="text-sm text-gray-900">{{ log.voltageStart }}V → {{ log.voltageEnd }}V</p>
                            </div>
                            <div>
                              <p class="text-sm font-medium text-gray-500">Eficiencia</p>
                              <p class="text-sm text-gray-900">{{ log.efficiency ? log.efficiency.toFixed(2) : 'N/A' }} Wh/km</p>
                            </div>
                            <div>
                              <p class="text-sm font-medium text-gray-500">Consumo</p>
                              <p class="text-sm text-gray-900">{{ log.whConsumed ? log.whConsumed.toFixed(0) : 'N/A' }} Wh</p>
                            </div>
                            <div>
                              <p class="text-sm font-medium text-gray-500">Velocidad</p>
                              <p class="text-sm text-gray-900">{{ log.speed || 'N/A' }} km/h</p>
                            </div>
                          </div>
                          
                          <div v-if="log.weather || log.terrain || log.riderWeight" class="flex items-center space-x-4 mb-3">
                            <span v-if="log.weather" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {{ getWeatherEmoji(log.weather) }} {{ getWeatherText(log.weather) }}
                            </span>
                            <span v-if="log.terrain" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              {{ getTerrainEmoji(log.terrain) }} {{ getTerrainText(log.terrain) }}
                            </span>
                            <span v-if="log.riderWeight" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                              👤 {{ log.riderWeight }} kg
                            </span>
                          </div>
                          
                          <p v-if="log.notes" class="text-sm text-gray-600 italic">"{{ log.notes }}"</p>
                        </div>
                        
                        <div class="flex items-center space-x-2 ml-4">
                          <button 
                            @click="editLog(log)" 
                            class="inline-flex items-center p-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
                          >
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                            </svg>
                          </button>
                          <button 
                            @click="deleteLog(log._id)" 
                            class="inline-flex items-center p-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-danger-500 transition-colors duration-200"
                          >
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Perfil (placeholder) -->
          <div v-else-if="currentView === 'profile'" class="card">
            <div class="card-header">
              <h2 class="text-xl font-semibold text-gray-900">Perfil de Usuario</h2>
            </div>
            <div class="card-body">
              <p class="text-gray-600">Funcionalidad de perfil en desarrollo...</p>
            </div>
          </div>

          <!-- Configuración (placeholder) -->
          <div v-else-if="currentView === 'settings'" class="card">
            <div class="card-header">
              <h2 class="text-xl font-semibold text-gray-900">Configuración</h2>
            </div>
            <div class="card-body">
              <p class="text-gray-600">Funcionalidad de configuración en desarrollo...</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Login from './components/Login.vue'
import Sidebar from './components/Sidebar.vue'
import Dashboard from './components/Dashboard.vue'
import LogForm from './components/LogForm.vue'

const isAuthenticated = ref(false)
const user = ref(null)
const token = ref('')
const currentView = ref('dashboard')
const sidebarOpen = ref(false)
const logs = ref([])
const logFormRef = ref(null)

const apiBase = import.meta.env.VITE_API_BASE || 'http://localhost:3000/api'

// Verificar autenticación al cargar
onMounted(() => {
  const savedToken = localStorage.getItem('token')
  const savedUser = localStorage.getItem('user')
  
  if (savedToken && savedUser) {
    token.value = savedToken
    user.value = JSON.parse(savedUser)
    isAuthenticated.value = true
    fetchLogs()
  }
})

async function handleLoginSuccess(data) {
  token.value = data.token
  user.value = data.user
  isAuthenticated.value = true
  currentView.value = 'dashboard'
  await fetchLogs()
}

function handleLogout() {
  isAuthenticated.value = false
  user.value = null
  token.value = ''
  logs.value = []
  currentView.value = 'dashboard'
}

function handleNavigation(view) {
  currentView.value = view
}

async function fetchLogs() {
  try {
    const response = await fetch(`${apiBase}/logs`, {
      headers: {
        'Authorization': `Bearer ${token.value}`
      }
    })
    
    if (response.ok) {
      logs.value = await response.json()
    } else if (response.status === 401) {
      handleLogout()
    }
  } catch (err) {
    console.error('Error fetching logs:', err)
  }
}

async function deleteLog(id) {
  if (confirm('¿Estás seguro de que quieres eliminar este registro?')) {
    try {
      const response = await fetch(`${apiBase}/logs/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token.value}`
        }
      })
      
      if (response.ok) {
        await fetchLogs()
      }
    } catch (err) {
      console.error('Error deleting log:', err)
    }
  }
}

function editLog(log) {
  if (logFormRef.value) {
    logFormRef.value.editLog(log)
    currentView.value = 'form'
  }
}

function formatDate(date) {
  return new Date(date).toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

function getWeatherEmoji(weather) {
  const emojis = {
    sunny: '☀️',
    cloudy: '☁️',
    rainy: '🌧️',
    windy: '💨'
  }
  return emojis[weather] || ''
}

function getWeatherText(weather) {
  const texts = {
    sunny: 'Soleado',
    cloudy: 'Nublado',
    rainy: 'Lluvioso',
    windy: 'Ventoso'
  }
  return texts[weather] || weather
}

function getTerrainEmoji(terrain) {
  const emojis = {
    flat: '🛣️',
    hilly: '⛰️',
    mixed: '🔄'
  }
  return emojis[terrain] || ''
}

function getTerrainText(terrain) {
  const texts = {
    flat: 'Plano',
    hilly: 'Montañoso',
    mixed: 'Mixto'
  }
  return texts[terrain] || terrain
}
</script>
