<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
    <!-- Header del Dashboard -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Dashboard de Eficiencia</h1>
            <p class="mt-1 text-sm text-gray-600">Análisis completo del rendimiento de tu scooter</p>
          </div>
          <div class="flex items-center space-x-3">
            <div class="flex items-center space-x-2">
              <div class="w-3 h-3 bg-success-500 rounded-full animate-pulse-slow"></div>
              <span class="text-sm text-gray-600">Sistema Activo</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Métricas Principales -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="metric-card group">
          <div class="flex items-center justify-between">
            <div>
              <p class="metric-label">Viajes Totales</p>
              <p class="metric-value text-primary-600">{{ metrics.totalTrips }}</p>
            </div>
            <div class="p-3 bg-primary-100 rounded-full group-hover:bg-primary-200 transition-colors">
              <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
              </svg>
            </div>
          </div>
        </div>

        <div class="metric-card group">
          <div class="flex items-center justify-between">
            <div>
              <p class="metric-label">Distancia Total</p>
              <p class="metric-value text-success-600">{{ metrics.totalDistance }} km</p>
            </div>
            <div class="p-3 bg-success-100 rounded-full group-hover:bg-success-200 transition-colors">
              <svg class="w-6 h-6 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m-6 3l6-3"></path>
              </svg>
            </div>
          </div>
        </div>

        <div class="metric-card group">
          <div class="flex items-center justify-between">
            <div>
              <p class="metric-label">Eficiencia Promedio</p>
              <p class="metric-value text-warning-600">{{ metrics.averageWhPerKm }} Wh/km</p>
            </div>
            <div class="p-3 bg-warning-100 rounded-full group-hover:bg-warning-200 transition-colors">
              <svg class="w-6 h-6 text-warning-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
          </div>
        </div>

        <div class="metric-card group">
          <div class="flex items-center justify-between">
            <div>
              <p class="metric-label">Rango Estimado</p>
              <p class="metric-value text-indigo-600">{{ metrics.estimatedRange }} km</p>
            </div>
            <div class="p-3 bg-indigo-100 rounded-full group-hover:bg-indigo-200 transition-colors">
              <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Métricas Secundarias -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <!-- Salud de la Batería -->
        <div class="card">
          <div class="card-header">
            <h3 class="text-lg font-semibold text-gray-900">Salud de la Batería</h3>
          </div>
          <div class="card-body">
            <div class="flex items-center justify-between mb-4">
              <span class="text-2xl font-bold text-gray-900">{{ metrics.batteryHealth.toFixed(1) }}%</span>
              <span :class="batteryHealthClass">{{ batteryHealthText }}</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-3">
              <div 
                :class="batteryHealthBarClass"
                class="h-3 rounded-full transition-all duration-500 ease-out"
                :style="{ width: metrics.batteryHealth + '%' }"
              ></div>
            </div>
            <p class="text-sm text-gray-600 mt-2">Basado en voltaje máximo reciente vs histórico</p>
          </div>
        </div>

        <!-- Eficiencia por Viaje -->
        <div class="card">
          <div class="card-header">
            <h3 class="text-lg font-semibold text-gray-900">Eficiencia por Viaje</h3>
          </div>
          <div class="card-body">
            <div class="space-y-4">
              <div class="flex items-center justify-between p-3 bg-success-50 rounded-lg">
                <div>
                  <p class="text-sm font-medium text-success-800">Mejor Eficiencia</p>
                  <p class="text-lg font-bold text-success-900">{{ metrics.bestEfficiency }} Wh/km</p>
                </div>
                <svg class="w-8 h-8 text-success-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
                </svg>
              </div>
              <div class="flex items-center justify-between p-3 bg-danger-50 rounded-lg">
                <div>
                  <p class="text-sm font-medium text-danger-800">Peor Eficiencia</p>
                  <p class="text-lg font-bold text-danger-900">{{ metrics.worstEfficiency }} Wh/km</p>
                </div>
                <svg class="w-8 h-8 text-danger-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Consumo Total -->
        <div class="card">
          <div class="card-header">
            <h3 class="text-lg font-semibold text-gray-900">Consumo Total</h3>
          </div>
          <div class="card-body">
            <div class="text-center">
              <div class="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full mb-4">
                <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
              <p class="text-3xl font-bold text-gray-900 mb-2">{{ metrics.totalWhConsumed }} Wh</p>
              <p class="text-sm text-gray-600">Energía total consumida en todos los viajes</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Gráficos -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div class="card">
          <div class="card-header">
            <h3 class="text-lg font-semibold text-gray-900">Eficiencia por Viaje</h3>
          </div>
          <div class="card-body">
            <Line :chart-data="efficiencyChartData" :chart-options="chartOptions" />
          </div>
        </div>
        
        <div class="card">
          <div class="card-header">
            <h3 class="text-lg font-semibold text-gray-900">Consumo por Viaje</h3>
          </div>
          <div class="card-body">
            <Bar :chart-data="consumptionChartData" :chart-options="chartOptions" />
          </div>
        </div>
      </div>

      <!-- Análisis de Tendencias -->
      <div class="card">
        <div class="card-header">
          <h3 class="text-lg font-semibold text-gray-900">Análisis de Tendencias</h3>
        </div>
        <div class="card-body">
          <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div class="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
              <div class="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m-6 3l6-3"></path>
                </svg>
              </div>
              <p class="text-sm font-medium text-blue-800">Distancia Promedio</p>
              <p class="text-xl font-bold text-blue-900">{{ metrics.averageDistance }} km</p>
            </div>
            
            <div class="text-center p-4 bg-gradient-to-br from-success-50 to-success-100 rounded-xl">
              <div class="w-12 h-12 bg-success-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
              <p class="text-sm font-medium text-success-800">Eficiencia Promedio</p>
              <p class="text-xl font-bold text-success-900">{{ metrics.averageEfficiency }} Wh/km</p>
            </div>
            
            <div class="text-center p-4 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl">
              <div class="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
              <p class="text-sm font-medium text-indigo-800">Consumo Promedio</p>
              <p class="text-xl font-bold text-indigo-900">{{ averageConsumptionPerTrip }} Wh</p>
            </div>
            
            <div class="text-center p-4 bg-gradient-to-br from-warning-50 to-warning-100 rounded-xl">
              <div class="w-12 h-12 bg-warning-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <p class="text-sm font-medium text-warning-800">Rango por Carga</p>
              <p class="text-xl font-bold text-warning-900">{{ metrics.estimatedRange }} km</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Line, Bar } from 'vue-chartjs'
import {
  Chart,
  LineElement,
  BarElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  Tooltip,
  Legend
} from 'chart.js'

Chart.register(LineElement, BarElement, PointElement, LinearScale, Title, CategoryScale, Tooltip, Legend)

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

const logs = ref([])
const apiBase = import.meta.env.VITE_API_BASE || 'http://localhost:3000/api'

async function fetchMetrics() {
  try {
    const res = await fetch(`${apiBase}/efficiency-metrics`)
    metrics.value = await res.json()
  } catch (err) {
    console.error('Error fetching metrics:', err)
  }
}

async function fetchLogs() {
  try {
    const res = await fetch(`${apiBase}/logs`)
    logs.value = await res.json()
  } catch (err) {
    console.error('Error fetching logs:', err)
  }
}

const batteryHealthClass = computed(() => {
  const health = metrics.value.batteryHealth
  if (health >= 80) return 'status-success'
  if (health >= 60) return 'status-warning'
  return 'status-danger'
})

const batteryHealthText = computed(() => {
  const health = metrics.value.batteryHealth
  if (health >= 80) return 'Excelente'
  if (health >= 60) return 'Buena'
  return 'Requiere Atención'
})

const batteryHealthBarClass = computed(() => {
  const health = metrics.value.batteryHealth
  if (health >= 80) return 'bg-success-500'
  if (health >= 60) return 'bg-warning-500'
  return 'bg-danger-500'
})

const averageConsumptionPerTrip = computed(() => {
  if (metrics.value.totalTrips === 0) return 0
  return Math.round((metrics.value.totalWhConsumed / metrics.value.totalTrips) * 100) / 100
})

const efficiencyChartData = computed(() => ({
  labels: logs.value.slice(0, 10).map(log => new Date(log.date).toLocaleDateString()),
  datasets: [{
    label: 'Eficiencia (Wh/km)',
    data: logs.value.slice(0, 10).map(log => log.efficiency || 0),
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

const consumptionChartData = computed(() => ({
  labels: logs.value.slice(0, 10).map(log => new Date(log.date).toLocaleDateString()),
  datasets: [{
    label: 'Consumo (Wh)',
    data: logs.value.slice(0, 10).map(log => log.whConsumed || 0),
    backgroundColor: 'rgba(239, 68, 68, 0.8)',
    borderColor: 'rgb(239, 68, 68)',
    borderWidth: 2,
    borderRadius: 8,
    borderSkipped: false
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
  fetchMetrics()
  fetchLogs()
})
</script> 