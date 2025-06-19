<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Historial de Viajes</h1>
        <p class="mt-1 text-sm text-gray-600">Gestiona todos tus registros de viajes</p>
      </div>
      <div class="flex items-center space-x-3">
        <button
          @click="refreshLogs"
          :disabled="loading"
          class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
          </svg>
          {{ loading ? 'Actualizando...' : 'Actualizar' }}
        </button>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="text-center py-12">
      <svg class="mx-auto h-12 w-12 text-gray-400 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
      </svg>
      <p class="mt-2 text-sm text-gray-500">Cargando historial...</p>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="text-center py-12">
      <svg class="mx-auto h-12 w-12 text-danger-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
      <p class="mt-2 text-sm text-danger-600">{{ error }}</p>
      <button @click="fetchLogs" class="mt-4 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">
        Reintentar
      </button>
    </div>

    <!-- Empty state -->
    <div v-else-if="logs.length === 0" class="text-center py-12">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">No hay registros</h3>
      <p class="mt-1 text-sm text-gray-500">Comienza agregando tu primer viaje.</p>
    </div>

    <!-- Logs list -->
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
</template>

<script>
import { ref, onMounted } from 'vue'

export default {
  name: 'LogHistory',
  emits: ['edit-log'],
  setup(props, { emit }) {
    const logs = ref([])
    const loading = ref(true)
    const error = ref(null)

    const fetchLogs = async () => {
      try {
        loading.value = true
        error.value = null
        
        const token = localStorage.getItem('token')
        if (!token) {
          throw new Error('No hay token de autenticación')
        }

        const response = await fetch(`${import.meta.env.VITE_API_BASE}/logs`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`)
        }

        const data = await response.json()
        logs.value = data.logs || []
        
      } catch (err) {
        console.error('Error fetching logs:', err)
        error.value = err.message
        logs.value = []
      } finally {
        loading.value = false
      }
    }

    const refreshLogs = () => {
      fetchLogs()
    }

    const deleteLog = async (id) => {
      if (!confirm('¿Estás seguro de que quieres eliminar este registro?')) {
        return
      }

      try {
        const token = localStorage.getItem('token')
        const response = await fetch(`${import.meta.env.VITE_API_BASE}/logs/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        if (response.ok) {
          await fetchLogs()
        } else {
          throw new Error('Error al eliminar el registro')
        }
      } catch (err) {
        console.error('Error deleting log:', err)
        alert('Error al eliminar el registro')
      }
    }

    const editLog = (log) => {
      emit('edit-log', log)
    }

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }

    const getWeatherEmoji = (weather) => {
      const emojis = {
        sunny: '☀️',
        cloudy: '☁️',
        rainy: '🌧️',
        windy: '💨'
      }
      return emojis[weather] || ''
    }

    const getWeatherText = (weather) => {
      const texts = {
        sunny: 'Soleado',
        cloudy: 'Nublado',
        rainy: 'Lluvioso',
        windy: 'Ventoso'
      }
      return texts[weather] || weather
    }

    const getTerrainEmoji = (terrain) => {
      const emojis = {
        flat: '🛣️',
        hilly: '⛰️',
        mixed: '🔄'
      }
      return emojis[terrain] || ''
    }

    const getTerrainText = (terrain) => {
      const texts = {
        flat: 'Plano',
        hilly: 'Montañoso',
        mixed: 'Mixto'
      }
      return texts[terrain] || terrain
    }

    onMounted(() => {
      fetchLogs()
    })

    return {
      logs,
      loading,
      error,
      fetchLogs,
      refreshLogs,
      deleteLog,
      editLog,
      formatDate,
      getWeatherEmoji,
      getWeatherText,
      getTerrainEmoji,
      getTerrainText
    }
  }
}
</script> 