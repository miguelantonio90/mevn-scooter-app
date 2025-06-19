<template>
  <div class="space-y-6">
    <!-- Header del Dashboard -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p class="mt-1 text-sm text-gray-600">Resumen de eficiencia y métricas de tu scooter</p>
      </div>
      <div class="flex items-center space-x-2">
        <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-success-100 text-success-800">
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
          </svg>
          En línea
        </span>
      </div>
    </div>

    <!-- Métricas principales -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="card">
        <div class="card-body">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Total de Viajes</p>
              <p class="text-2xl font-bold text-gray-900">{{ metrics.totalTrips }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-body">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-success-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m-6 3l6-3"></path>
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Distancia Total</p>
              <p class="text-2xl font-bold text-gray-900">{{ metrics.totalDistance }} km</p>
            </div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-body">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-warning-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-warning-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Eficiencia Promedio</p>
              <p class="text-2xl font-bold text-gray-900">{{ metrics.averageEfficiency }} Wh/km</p>
            </div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-body">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-info-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-info-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Rango Estimado</p>
              <p class="text-2xl font-bold text-gray-900">{{ metrics.estimatedRange }} km</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Gráficos -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="card">
        <div class="card-header">
          <h3 class="text-lg font-semibold text-gray-900">Eficiencia por Viaje</h3>
        </div>
        <div class="card-body">
          <div v-if="!props.logs || props.logs.length === 0" class="text-center py-12">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
            <p class="mt-2 text-sm text-gray-500">No hay datos para mostrar</p>
          </div>
          <Line v-else :chart-data="efficiencyChartData" :chart-options="chartOptions" />
        </div>
      </div>
      
      <div class="card">
        <div class="card-header">
          <h3 class="text-lg font-semibold text-gray-900">Consumo de Energía</h3>
        </div>
        <div class="card-body">
          <div v-if="!props.logs || props.logs.length === 0" class="text-center py-12">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
            <p class="mt-2 text-sm text-gray-500">No hay datos para mostrar</p>
          </div>
          <Line v-else :chart-data="consumptionChartData" :chart-options="chartOptions" />
        </div>
      </div>
    </div>

    <!-- Métricas detalladas -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="card">
        <div class="card-header">
          <h3 class="text-lg font-semibold text-gray-900">Rendimiento de Batería</h3>
        </div>
        <div class="card-body space-y-4">
          <div class="flex items-center justify-between">
            <span class="text-sm font-medium text-gray-700">Salud de Batería</span>
            <span class="text-sm font-semibold text-gray-900">{{ metrics.batteryHealth }}%</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div 
              class="h-2 rounded-full transition-all duration-500"
              :class="batteryHealthClass"
              :style="{ width: metrics.batteryHealth + '%' }"
            ></div>
          </div>
          
          <div class="flex items-center justify-between">
            <span class="text-sm font-medium text-gray-700">Mejor Eficiencia</span>
            <span class="text-sm font-semibold text-success-600">{{ metrics.bestEfficiency }} Wh/km</span>
          </div>
          
          <div class="flex items-center justify-between">
            <span class="text-sm font-medium text-gray-700">Peor Eficiencia</span>
            <span class="text-sm font-semibold text-danger-600">{{ metrics.worstEfficiency }} Wh/km</span>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <h3 class="text-lg font-semibold text-gray-900">Estadísticas de Viaje</h3>
        </div>
        <div class="card-body space-y-4">
          <div class="flex items-center justify-between">
            <span class="text-sm font-medium text-gray-700">Distancia Promedio</span>
            <span class="text-sm font-semibold text-gray-900">{{ metrics.averageDistance }} km</span>
          </div>
          
          <div class="flex items-center justify-between">
            <span class="text-sm font-medium text-gray-700">Energía Total</span>
            <span class="text-sm font-semibold text-gray-900">{{ metrics.totalWhConsumed }} Wh</span>
          </div>
          
          <div class="flex items-center justify-between">
            <span class="text-sm font-medium text-gray-700">Consumo Promedio</span>
            <span class="text-sm font-semibold text-gray-900">{{ metrics.averageWhPerKm }} Wh/km</span>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <h3 class="text-lg font-semibold text-gray-900">Últimos Viajes</h3>
        </div>
        <div class="card-body">
          <div v-if="recentLogs.length === 0" class="text-center py-8">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
            </svg>
            <p class="mt-2 text-sm text-gray-500">No hay viajes recientes</p>
          </div>
          
          <div v-else class="space-y-3">
            <div 
              v-for="log in recentLogs" 
              :key="log._id"
              class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div>
                <p class="text-sm font-medium text-gray-900">{{ formatDate(log.date) }}</p>
                <p class="text-xs text-gray-500">{{ log.kmTravelled }} km</p>
              </div>
              <div class="text-right">
                <p class="text-sm font-semibold text-gray-900">{{ log.efficiency ? log.efficiency.toFixed(1) : 'N/A' }} Wh/km</p>
                <p class="text-xs text-gray-500">{{ log.voltageStart }}V</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { Line } from 'vue-chartjs'
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

const props = defineProps({
  logs: {
    type: Array,
    default: () => []
  },
  token: String
})

const metrics = ref({
  totalTrips: 0,
  totalDistance: 0,
  averageEfficiency: 0,
  bestEfficiency: 0,
  worstEfficiency: 0,
  averageDistance: 0,
  batteryHealth: 0,
  totalWhConsumed: 0,
  averageWhPerKm: 0,
  estimatedRange: 0
})

const apiBase = import.meta.env.VITE_API_BASE || 'http://localhost:3000/api'

const recentLogs = computed(() => {
  return props.logs.slice(0, 5)
})

const batteryHealthClass = computed(() => {
  const health = metrics.value.batteryHealth
  if (health > 80) return 'bg-success-500'
  if (health > 60) return 'bg-warning-500'
  if (health > 40) return 'bg-orange-500'
  return 'bg-danger-500'
})

// Chart data
const efficiencyChartData = computed(() => {
  if (!props.logs || props.logs.length === 0) {
    return {
      labels: [],
      datasets: [{
        label: 'Eficiencia (Wh/km)',
        data: [],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: 'rgb(59, 130, 246)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2
      }]
    }
  }
  
  return {
    labels: props.logs.map(log => new Date(log.date).toLocaleDateString()),
    datasets: [{
      label: 'Eficiencia (Wh/km)',
      data: props.logs.map(log => log.efficiency || 0),
      borderColor: 'rgb(59, 130, 246)',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      fill: true,
      tension: 0.4,
      pointRadius: 4,
      pointBackgroundColor: 'rgb(59, 130, 246)',
      pointBorderColor: '#fff',
      pointBorderWidth: 2
    }]
  }
})

const consumptionChartData = computed(() => {
  if (!props.logs || props.logs.length === 0) {
    return {
      labels: [],
      datasets: [{
        label: 'Consumo (Wh)',
        data: [],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: 'rgb(34, 197, 94)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2
      }]
    }
  }
  
  return {
    labels: props.logs.map(log => new Date(log.date).toLocaleDateString()),
    datasets: [{
      label: 'Consumo (Wh)',
      data: props.logs.map(log => log.whConsumed || 0),
      borderColor: 'rgb(34, 197, 94)',
      backgroundColor: 'rgba(34, 197, 94, 0.1)',
      fill: true,
      tension: 0.4,
      pointRadius: 4,
      pointBackgroundColor: 'rgb(34, 197, 94)',
      pointBorderColor: '#fff',
      pointBorderWidth: 2
    }]
  }
})

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

async function fetchMetrics() {
  try {
    console.log('🔍 Fetching metrics...')
    const response = await fetch(`${apiBase}/logs/metrics/efficiency`, {
      headers: {
        'Authorization': `Bearer ${props.token}`
      }
    })
    
    console.log('📊 Response status:', response.status)
    
    if (response.ok) {
      const result = await response.json()
      console.log('📈 Metrics result:', result)
      metrics.value = result.data
    } else {
      console.error('❌ Error response:', response.status, response.statusText)
    }
  } catch (err) {
    console.error('❌ Error fetching metrics:', err)
  }
}

function formatDate(date) {
  return new Date(date).toLocaleDateString('es-ES', {
    month: 'short',
    day: 'numeric'
  })
}

// Fetch metrics when component mounts or logs change
onMounted(() => {
  fetchMetrics()
})

watch(() => props.logs, () => {
  fetchMetrics()
}, { deep: true })
</script> 