<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Scooter Battery Tracker</h1>
            <p class="mt-1 text-sm text-gray-600">Seguimiento inteligente de batería y eficiencia</p>
          </div>
          <div class="flex items-center space-x-4">
            <button 
              @click="showDashboard = !showDashboard" 
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
              {{ showDashboard ? 'Ver Formulario' : 'Ver Dashboard' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Dashboard -->
    <Dashboard v-if="showDashboard" />

    <!-- Formulario y contenido original -->
    <div v-else class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Battery Status Card -->
      <div class="card mb-8">
        <div class="card-header">
          <h2 class="text-xl font-semibold text-gray-900">Estado de la Batería</h2>
        </div>
        <div class="card-body">
          <div class="flex items-center justify-between">
            <div class="flex-1">
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm font-medium text-gray-700">Nivel de Batería</span>
                <span class="text-sm font-medium text-gray-900">{{ batteryPercent.toFixed(1) }}%</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-4">
                <div
                  class="h-4 rounded-full transition-all duration-500 ease-out"
                  :class="batteryBarClass"
                  :style="{ width: batteryPercent + '%' }"
                ></div>
              </div>
              <p class="text-sm text-gray-600 mt-2">Voltaje actual: {{ latestVoltage }}V</p>
            </div>
            <div class="ml-6">
              <div class="w-16 h-16 rounded-full flex items-center justify-center" :class="batteryIconClass">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Formulario -->
      <div class="card mb-8">
        <div class="card-header">
          <h2 class="text-xl font-semibold text-gray-900">
            {{ editId ? 'Editar Registro' : 'Nuevo Registro de Viaje' }}
          </h2>
        </div>
        <div class="card-body">
          <form @submit.prevent="saveLog" class="space-y-6">
            <!-- Primera fila -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label for="date" class="form-label">Fecha</label>
                <input 
                  id="date" 
                  type="date" 
                  v-model="form.date" 
                  required 
                  class="form-input"
                />
              </div>
              
              <div>
                <label for="voltageStart" class="form-label">Voltaje Inicial (V)</label>
                <input 
                  id="voltageStart" 
                  type="number" 
                  v-model.number="form.voltageStart" 
                  step="0.1" 
                  min="0" 
                  max="100" 
                  required 
                  class="form-input"
                  placeholder="84.0"
                />
              </div>
              
              <div>
                <label for="voltageEnd" class="form-label">Voltaje Final (V)</label>
                <input 
                  id="voltageEnd" 
                  type="number" 
                  v-model.number="form.voltageEnd" 
                  step="0.1" 
                  min="0" 
                  max="100" 
                  required 
                  class="form-input"
                  placeholder="72.0"
                />
              </div>
            </div>

            <!-- Segunda fila -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label for="kmTravelled" class="form-label">Kilómetros Recorridos</label>
                <input 
                  id="kmTravelled" 
                  type="number" 
                  v-model.number="form.kmTravelled" 
                  step="0.1" 
                  min="0" 
                  required 
                  class="form-input"
                  placeholder="15.5"
                />
              </div>
              
              <div>
                <label for="batteryCapacity" class="form-label">Capacidad Batería (Wh)</label>
                <input 
                  id="batteryCapacity" 
                  type="number" 
                  v-model.number="form.batteryCapacity" 
                  step="100" 
                  min="0" 
                  required 
                  class="form-input"
                  placeholder="1000"
                />
              </div>
              
              <div>
                <label for="speed" class="form-label">Velocidad Promedio (km/h)</label>
                <input 
                  id="speed" 
                  type="number" 
                  v-model.number="form.speed" 
                  step="1" 
                  min="0" 
                  class="form-input"
                  placeholder="25"
                />
              </div>
            </div>

            <!-- Tercera fila -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label for="weather" class="form-label">Condiciones Climáticas</label>
                <select id="weather" v-model="form.weather" class="form-input">
                  <option value="">Seleccionar clima</option>
                  <option value="sunny">☀️ Soleado</option>
                  <option value="cloudy">☁️ Nublado</option>
                  <option value="rainy">🌧️ Lluvioso</option>
                  <option value="windy">💨 Ventoso</option>
                </select>
              </div>
              
              <div>
                <label for="terrain" class="form-label">Tipo de Terreno</label>
                <select id="terrain" v-model="form.terrain" class="form-input">
                  <option value="">Seleccionar terreno</option>
                  <option value="flat">🛣️ Plano</option>
                  <option value="hilly">⛰️ Montañoso</option>
                  <option value="mixed">🔄 Mixto</option>
                </select>
              </div>
              
              <div>
                <label for="riderWeight" class="form-label">Peso del Conductor (kg)</label>
                <input 
                  id="riderWeight" 
                  type="number" 
                  v-model.number="form.riderWeight" 
                  step="1" 
                  min="0" 
                  class="form-input"
                  placeholder="70"
                />
              </div>
            </div>

            <!-- Cuarta fila -->
            <div>
              <label for="notes" class="form-label">Notas Adicionales</label>
              <textarea 
                id="notes" 
                v-model="form.notes" 
                rows="3"
                class="form-input"
                placeholder="Observaciones sobre el viaje, condiciones especiales, etc..."
              ></textarea>
            </div>

            <!-- Botones -->
            <div class="flex items-center justify-end space-x-4 pt-4 border-t border-gray-200">
              <button 
                v-if="editId" 
                @click="cancelEdit" 
                type="button" 
                class="btn-secondary"
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                class="btn-primary"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                {{ editId ? 'Actualizar Registro' : 'Guardar Registro' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Gráficos -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div class="card">
          <div class="card-header">
            <h3 class="text-lg font-semibold text-gray-900">Evolución del Voltaje</h3>
          </div>
          <div class="card-body">
            <Line :chart-data="voltageChartData" :chart-options="chartOptions" />
          </div>
        </div>
        
        <div class="card">
          <div class="card-header">
            <h3 class="text-lg font-semibold text-gray-900">Distancia Recorrida</h3>
          </div>
          <div class="card-body">
            <Line :chart-data="kmChartData" :chart-options="chartOptions" />
          </div>
        </div>
      </div>

      <!-- Lista de Registros -->
      <div class="card">
        <div class="card-header">
          <h3 class="text-lg font-semibold text-gray-900">Historial de Viajes</h3>
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
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Line } from 'vue-chartjs'
import Dashboard from './components/Dashboard.vue'
import {
  Chart,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  Tooltip,
  Legend
} from 'chart.js'

Chart.register(LineElement, PointElement, LinearScale, Title, CategoryScale, Tooltip, Legend)

const showDashboard = ref(false)
const logs = ref([])
const form = ref({
  date: '',
  voltageStart: 0,
  voltageEnd: 0,
  kmTravelled: 0,
  batteryCapacity: 1000,
  weather: '',
  terrain: '',
  riderWeight: 0,
  speed: 0,
  notes: ''
})
const editId = ref(null)
const latestVoltage = ref(0)

const apiBase = import.meta.env.VITE_API_BASE || 'http://localhost:3000/api'

async function fetchLogs() {
  const res = await fetch(`${apiBase}/logs`)
  logs.value = await res.json()
  if (logs.value.length) {
    latestVoltage.value = logs.value[0].voltageStart
  }
}

async function saveLog() {
  if (editId.value) {
    await fetch(`${apiBase}/logs/${editId.value}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form.value),
    })
  } else {
    await fetch(`${apiBase}/logs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form.value),
    })
  }
  resetForm()
  await fetchLogs()
}

function editLog(log) {
  editId.value = log._id
  form.value = { 
    ...log, 
    date: log.date.slice(0, 10),
    voltageStart: log.voltageStart || log.voltage,
    voltageEnd: log.voltageEnd || log.voltage
  }
}

function cancelEdit() {
  resetForm()
}

function resetForm() {
  form.value = {
    date: '',
    voltageStart: 0,
    voltageEnd: 0,
    kmTravelled: 0,
    batteryCapacity: 1000,
    weather: '',
    terrain: '',
    riderWeight: 0,
    speed: 0,
    notes: ''
  }
  editId.value = null
}

async function deleteLog(id) {
  if (confirm('¿Estás seguro de que quieres eliminar este registro?')) {
    await fetch(`${apiBase}/logs/${id}`, { method: 'DELETE' })
    await fetchLogs()
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

// Battery % assuming voltage range 60-84V
const batteryPercent = computed(() => {
  const v = latestVoltage.value
  if (v <= 60) return 0
  if (v >= 84) return 100
  return ((v - 60) / (84 - 60)) * 100
})

const batteryBarClass = computed(() => {
  if (batteryPercent.value > 75) return 'bg-success-500'
  if (batteryPercent.value > 50) return 'bg-warning-500'
  if (batteryPercent.value > 25) return 'bg-orange-500'
  return 'bg-danger-500'
})

const batteryIconClass = computed(() => {
  if (batteryPercent.value > 75) return 'bg-success-500'
  if (batteryPercent.value > 50) return 'bg-warning-500'
  if (batteryPercent.value > 25) return 'bg-orange-500'
  return 'bg-danger-500'
})

// Chart data
const voltageChartData = computed(() => ({
  labels: logs.value.map(log => new Date(log.date).toLocaleDateString()),
  datasets: [{
    label: 'Voltaje Inicial (V)',
    data: logs.value.map(log => log.voltageStart || log.voltage),
    borderColor: 'rgb(59, 130, 246)',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    fill: true,
    tension: 0.4,
    pointRadius: 6,
    pointBackgroundColor: 'rgb(59, 130, 246)',
    pointBorderColor: '#fff',
    pointBorderWidth: 2
  }]
}))

const kmChartData = computed(() => ({
  labels: logs.value.map(log => new Date(log.date).toLocaleDateString()),
  datasets: [{
    label: 'Kilómetros Recorridos',
    data: logs.value.map(log => log.kmTravelled),
    borderColor: 'rgb(34, 197, 94)',
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    fill: true,
    tension: 0.4,
    pointRadius: 6,
    pointBackgroundColor: 'rgb(34, 197, 94)',
    pointBorderColor: '#fff',
    pointBorderWidth: 2
  }]
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { 
      position: 'top',
      labels: {
        usePointStyle: true,
        padding: 20,
        font: {
          family: 'Inter',
          size: 12
        }
      }
    },
    tooltip: { 
      mode: 'index', 
      intersect: false,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      titleColor: '#fff',
      bodyColor: '#fff',
      borderColor: 'rgba(255, 255, 255, 0.1)',
      borderWidth: 1
    }
  },
  scales: {
    x: { 
      display: true,
      grid: {
        display: false
      },
      ticks: {
        font: {
          family: 'Inter',
          size: 11
        }
      }
    },
    y: { 
      display: true, 
      beginAtZero: true,
      grid: {
        color: 'rgba(0, 0, 0, 0.05)'
      },
      ticks: {
        font: {
          family: 'Inter',
          size: 11
        }
      }
    }
  }
}

onMounted(() => {
  fetchLogs()
})
</script>
