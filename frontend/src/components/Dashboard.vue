<template>
  <div class="space-y-6">
    <!-- Header del Dashboard -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">Resumen de eficiencia y métricas de tu scooter</p>
      </div>
      <div class="flex items-center space-x-2">
        <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-success-100 text-success-800 dark:bg-success-800 dark:text-success-100">
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
          </svg>
          En línea
        </span>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="text-center py-12">
      <svg class="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
      </svg>
      <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">Cargando métricas...</p>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="text-center py-12">
      <svg class="mx-auto h-12 w-12 text-danger-400 dark:text-danger-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
      <p class="mt-2 text-sm text-danger-600 dark:text-danger-200">{{ error }}</p>
      <button @click="fetchData" class="mt-4 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600">
        Reintentar
      </button>
    </div>

    <!-- Content when loaded -->
    <div v-else>
      <!-- Métricas principales -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <BaseCard>
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-primary-100 dark:bg-primary-800 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-primary-600 dark:text-primary-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Total de Viajes</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ metrics.totalTrips }}</p>
            </div>
          </div>
        </BaseCard>

        <BaseCard>
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-success-100 dark:bg-success-800 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-success-600 dark:text-success-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m-6 3l6-3"></path>
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Distancia Total</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ metrics.totalDistance }} km</p>
            </div>
          </div>
        </BaseCard>

        <BaseCard>
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-warning-100 dark:bg-warning-800 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-warning-600 dark:text-warning-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Eficiencia Promedio</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ metrics.averageEfficiency }} Wh/km</p>
              <p v-if="userSettings.efficiencyGoal" class="text-xs text-gray-500 dark:text-gray-400">
                Meta: {{ userSettings.efficiencyGoal }} Wh/km
              </p>
            </div>
          </div>
        </BaseCard>

        <BaseCard>
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-info-100 dark:bg-info-800 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-info-600 dark:text-info-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Rango Estimado</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ metrics.estimatedRange }} km</p>
            </div>
          </div>
        </BaseCard>
      </div>

      <!-- Gráficos -->
      <div v-if="logs.length > 0" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BaseCard v-if="efficiencyChartData">
          <template #header>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Eficiencia por Viaje</h3>
          </template>
          <Line :chart-data="efficiencyChartData" :chart-options="chartOptionsWithTheme" />
        </BaseCard>
        
        <BaseCard v-if="consumptionChartData">
          <template #header>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Consumo de Energía</h3>
          </template>
          <Line :chart-data="consumptionChartData" :chart-options="chartOptionsWithTheme" />
        </BaseCard>
      </div>

      <!-- Mensaje cuando no hay datos para gráficos -->
      <BaseCard v-else>
        <div class="text-center py-12">
          <svg class="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">No hay datos para gráficos</h3>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Agrega algunos viajes para ver gráficos de eficiencia y consumo.</p>
        </div>
      </BaseCard>

      <!-- Métricas detalladas -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <BaseCard>
          <template #header>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Rendimiento de Batería</h3>
          </template>
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Salud de Batería</span>
              <span class="text-sm font-semibold text-gray-900 dark:text-white">{{ metrics.batteryHealth }}%</span>
            </div>
            <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                class="h-2 rounded-full transition-all duration-500"
                :class="batteryHealthClass"
                :style="{ width: metrics.batteryHealth + '%' }"
              ></div>
            </div>
            
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Mejor Eficiencia</span>
              <span class="text-sm font-semibold text-success-600 dark:text-success-400">{{ metrics.bestEfficiency }} Wh/km</span>
            </div>
            
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Peor Eficiencia</span>
              <span class="text-sm font-semibold text-danger-600 dark:text-danger-400">{{ metrics.worstEfficiency }} Wh/km</span>
            </div>
          </div>
        </BaseCard>

        <BaseCard>
          <template #header>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Estadísticas de Viaje</h3>
          </template>
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Distancia Promedio</span>
              <span class="text-sm font-semibold text-gray-900 dark:text-white">{{ metrics.averageDistance }} km</span>
            </div>
            
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Energía Total</span>
              <span class="text-sm font-semibold text-gray-900 dark:text-white">{{ metrics.totalWhConsumed }} Wh</span>
            </div>
            
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Consumo Promedio</span>
              <span class="text-sm font-semibold text-gray-900 dark:text-white">{{ metrics.averageWhPerKm }} Wh/km</span>
            </div>
          </div>
        </BaseCard>

        <BaseCard>
          <template #header>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Últimos Viajes</h3>
          </template>
          <div>
            <div v-if="recentLogs.length === 0" class="text-center py-8">
              <svg class="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
              </svg>
              <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">No hay viajes recientes</p>
            </div>
            
            <div v-else class="space-y-3">
              <div 
                v-for="log in recentLogs" 
                :key="log._id"
                class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div>
                  <p class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ formatDate(log.date) }}</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">{{ log.kmTravelled }} km</p>
                </div>
                <div class="text-right">
                  <p class="text-sm font-semibold text-gray-900 dark:text-gray-100">{{ log.efficiency ? log.efficiency.toFixed(1) : 'N/A' }} Wh/km</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">{{ log.voltageStart }}V</p>
                </div>
              </div>
            </div>
          </div>
        </BaseCard>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { useTheme } from '@/composables/useTheme'
import { Line } from 'vue-chartjs'
import BaseCard from './BaseCard.vue' // Importar BaseCard
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

export default {
  name: 'Dashboard',
  components: {
    Line,
    BaseCard // Registrar BaseCard
  },
  setup() {
    const { isDarkMode } = useTheme();

    const userSettings = computed(() => {
      try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        return user.settings || {};
      } catch {
        return {};
      }
    });

    const logs = ref([])
    const metrics = ref({
      totalTrips: 0,
      totalDistance: 0,
      averageEfficiency: 0,
      estimatedRange: 0,
      batteryHealth: 0,
      bestEfficiency: 0,
      worstEfficiency: 0,
      averageDistance: 0,
      totalWhConsumed: 0,
      averageWhPerKm: 0
    })
    const loading = ref(true)
    const error = ref(null)

    // Solo crear datos de gráficos si hay logs válidos
    const efficiencyChartData = computed(() => {
      if (!logs.value || logs.value.length === 0) {
        return null
      }

      const validLogs = logs.value.filter(log => 
        log.date && 
        log.efficiency !== undefined && 
        log.efficiency !== null && 
        !isNaN(Number(log.efficiency))
      )

      if (validLogs.length === 0) {
        return null
      }

      const sortedLogs = validLogs.sort((a, b) => new Date(a.date) - new Date(b.date))
      
      return {
        labels: sortedLogs.map(log => {
          const date = new Date(log.date)
          return `${date.getDate()}/${date.getMonth() + 1}`
        }),
        datasets: [{
          label: 'Eficiencia (Wh/km)',
          data: sortedLogs.map(log => Number(log.efficiency)),
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.1
        }]
      }
    })

    const consumptionChartData = computed(() => {
      if (!logs.value || logs.value.length === 0) {
        return null
      }

      const validLogs = logs.value.filter(log => 
        log.date && 
        log.efficiency !== undefined && 
        log.kmTravelled !== undefined &&
        !isNaN(Number(log.efficiency)) &&
        !isNaN(Number(log.kmTravelled))
      )

      if (validLogs.length === 0) {
        return null
      }

      const sortedLogs = validLogs.sort((a, b) => new Date(a.date) - new Date(b.date))
      
      return {
        labels: sortedLogs.map(log => {
          const date = new Date(log.date)
          return `${date.getDate()}/${date.getMonth() + 1}`
        }),
        datasets: [{
          label: 'Consumo (Wh)',
          data: sortedLogs.map(log => {
            const efficiency = Number(log.efficiency)
            const distance = Number(log.kmTravelled)
            return efficiency * distance
          }),
          borderColor: 'rgb(16, 185, 129)',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          tension: 0.1
        }]
      }
    })

    const chartOptionsWithTheme = computed(() => {
      const legendColor = isDarkMode.value ? '#e5e7eb' : '#374151'; // gray-200 or gray-700
      const gridColor = isDarkMode.value ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
      const ticksColor = isDarkMode.value ? '#d1d5db' : '#6b7280'; // gray-300 dark or gray-500 light

      return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              color: legendColor,
            }
          },
          title: {
            display: false,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: gridColor,
            },
            ticks: {
              color: ticksColor,
            }
          },
          x: {
            grid: {
              color: gridColor,
            },
            ticks: {
              color: ticksColor,
            }
          }
        },
      }
    })

    const recentLogs = computed(() => {
      if (!logs.value || logs.value.length === 0) return []
      return [...logs.value]
        .filter(log => log.date)
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5)
    })

    const batteryHealthClass = computed(() => {
      const health = metrics.value.batteryHealth
      if (health >= 80) return 'bg-success-500'
      if (health >= 60) return 'bg-warning-500'
      return 'bg-danger-500'
    })

    const formatDate = (dateString) => {
      try {
        const date = new Date(dateString)
        return date.toLocaleDateString('es-ES', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        })
      } catch (err) {
        return 'Fecha inválida'
      }
    }

    const calculateMetrics = (logsData) => {
      if (!logsData || logsData.length === 0) {
        return {
          totalTrips: 0,
          totalDistance: 0,
          averageEfficiency: 0,
          estimatedRange: 0,
          batteryHealth: 0,
          bestEfficiency: 0,
          worstEfficiency: 0,
          averageDistance: 0,
          totalWhConsumed: 0,
          averageWhPerKm: 0
        }
      }

      const totalTrips = logsData.length
      const totalDistance = logsData.reduce((sum, log) => sum + (Number(log.kmTravelled) || 0), 0)
      const efficiencies = logsData
        .map(log => Number(log.efficiency) || 0)
        .filter(eff => eff > 0)
      
      const averageEfficiency = efficiencies.length > 0 ? efficiencies.reduce((sum, eff) => sum + eff, 0) / efficiencies.length : 0
      const bestEfficiency = efficiencies.length > 0 ? Math.min(...efficiencies) : 0
      const worstEfficiency = efficiencies.length > 0 ? Math.max(...efficiencies) : 0
      const averageDistance = totalDistance / totalTrips
      const totalWhConsumed = logsData.reduce((sum, log) => {
        const efficiency = Number(log.efficiency) || 0
        const distance = Number(log.kmTravelled) || 0
        return sum + (efficiency * distance)
      }, 0)
      const averageWhPerKm = totalDistance > 0 ? totalWhConsumed / totalDistance : 0

      // Calcular salud de batería basada en el voltaje promedio
      const voltages = logsData
        .map(log => Number(log.voltageStart) || 0)
        .filter(v => v > 0)
      const avgVoltage = voltages.length > 0 ? voltages.reduce((sum, v) => sum + v, 0) / voltages.length : 0
      const batteryHealth = avgVoltage > 0 ? Math.min(100, Math.max(0, ((avgVoltage - 36) / (42 - 36)) * 100)) : 0

      // Rango estimado (asumiendo batería de 10.4Ah a 42V = ~437Wh)
      const batteryCapacity = 437 // Wh
      const estimatedRange = averageEfficiency > 0 ? batteryCapacity / averageEfficiency : 0

      return {
        totalTrips,
        totalDistance: Math.round(totalDistance * 100) / 100,
        averageEfficiency: Math.round(averageEfficiency * 100) / 100,
        estimatedRange: Math.round(estimatedRange * 100) / 100,
        batteryHealth: Math.round(batteryHealth),
        bestEfficiency: Math.round(bestEfficiency * 100) / 100,
        worstEfficiency: Math.round(worstEfficiency * 100) / 100,
        averageDistance: Math.round(averageDistance * 100) / 100,
        totalWhConsumed: Math.round(totalWhConsumed),
        averageWhPerKm: Math.round(averageWhPerKm * 100) / 100
      }
    }

    const fetchData = async () => {
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
        metrics.value = calculateMetrics(logs.value)
        
      } catch (err) {
        console.error('Error fetching data:', err)
        error.value = err.message
        logs.value = []
        metrics.value = calculateMetrics([])
      } finally {
        loading.value = false
      }
    }

    onMounted(() => {
      fetchData()
    })

    return {
      logs,
      metrics,
      loading,
      error,
      efficiencyChartData,
      consumptionChartData,
      chartOptionsWithTheme, // Asegurarse que se usa el nombre correcto aquí también
      recentLogs,
      batteryHealthClass,
      formatDate,
      fetchData,
      userSettings // Exponer userSettings al template
    }
  }
}
</script> 