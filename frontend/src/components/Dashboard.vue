<template>
  <div class="dashboard">
    <h2 class="mb-4 text-primary">Dashboard de Eficiencia</h2>
    
    <!-- Métricas principales -->
    <div class="row mb-4">
      <div class="col-md-3 mb-3">
        <div class="card bg-primary text-white">
          <div class="card-body text-center">
            <h5 class="card-title">Viajes Totales</h5>
            <h2 class="mb-0">{{ metrics.totalTrips }}</h2>
          </div>
        </div>
      </div>
      
      <div class="col-md-3 mb-3">
        <div class="card bg-success text-white">
          <div class="card-body text-center">
            <h5 class="card-title">Distancia Total</h5>
            <h2 class="mb-0">{{ metrics.totalDistance }} km</h2>
          </div>
        </div>
      </div>
      
      <div class="col-md-3 mb-3">
        <div class="card bg-info text-white">
          <div class="card-body text-center">
            <h5 class="card-title">Eficiencia Promedio</h5>
            <h2 class="mb-0">{{ metrics.averageWhPerKm }} Wh/km</h2>
          </div>
        </div>
      </div>
      
      <div class="col-md-3 mb-3">
        <div class="card bg-warning text-white">
          <div class="card-body text-center">
            <h5 class="card-title">Rango Estimado</h5>
            <h2 class="mb-0">{{ metrics.estimatedRange }} km</h2>
          </div>
        </div>
      </div>
    </div>

    <!-- Métricas secundarias -->
    <div class="row mb-4">
      <div class="col-md-4 mb-3">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Salud de la Batería</h5>
            <div class="progress mb-2" style="height: 25px;">
              <div
                class="progress-bar"
                :class="batteryHealthClass"
                :style="{ width: metrics.batteryHealth + '%' }"
                role="progressbar"
              >
                {{ metrics.batteryHealth.toFixed(1) }}%
              </div>
            </div>
            <small class="text-muted">Basado en voltaje máximo reciente vs histórico</small>
          </div>
        </div>
      </div>
      
      <div class="col-md-4 mb-3">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Eficiencia por Viaje</h5>
            <div class="row text-center">
              <div class="col-6">
                <h6 class="text-success">Mejor</h6>
                <h4>{{ metrics.bestEfficiency }} Wh/km</h4>
              </div>
              <div class="col-6">
                <h6 class="text-danger">Peor</h6>
                <h4>{{ metrics.worstEfficiency }} Wh/km</h4>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="col-md-4 mb-3">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Consumo Total</h5>
            <h3 class="text-center">{{ metrics.totalWhConsumed }} Wh</h3>
            <small class="text-muted">Energía total consumida en todos los viajes</small>
          </div>
        </div>
      </div>
    </div>

    <!-- Gráficos de eficiencia -->
    <div class="row">
      <div class="col-md-6 mb-4">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Eficiencia por Viaje</h5>
            <Line :chart-data="efficiencyChartData" :chart-options="chartOptions" />
          </div>
        </div>
      </div>
      
      <div class="col-md-6 mb-4">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Consumo por Viaje</h5>
            <Bar :chart-data="consumptionChartData" :chart-options="chartOptions" />
          </div>
        </div>
      </div>
    </div>

    <!-- Resumen de tendencias -->
    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Análisis de Tendencias</h5>
            <div class="row">
              <div class="col-md-3 text-center">
                <div class="border rounded p-3">
                  <h6>Distancia Promedio</h6>
                  <h4 class="text-primary">{{ metrics.averageDistance }} km</h4>
                </div>
              </div>
              <div class="col-md-3 text-center">
                <div class="border rounded p-3">
                  <h6>Eficiencia Promedio</h6>
                  <h4 class="text-success">{{ metrics.averageEfficiency }} Wh/km</h4>
                </div>
              </div>
              <div class="col-md-3 text-center">
                <div class="border rounded p-3">
                  <h6>Consumo Promedio</h6>
                  <h4 class="text-info">{{ averageConsumptionPerTrip }} Wh</h4>
                </div>
              </div>
              <div class="col-md-3 text-center">
                <div class="border rounded p-3">
                  <h6>Rango por Carga</h6>
                  <h4 class="text-warning">{{ metrics.estimatedRange }} km</h4>
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
  if (health >= 80) return 'bg-success'
  if (health >= 60) return 'bg-warning'
  return 'bg-danger'
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
    borderColor: 'rgba(75, 192, 192, 1)',
    backgroundColor: 'rgba(75, 192, 192, 0.2)',
    fill: true,
    tension: 0.3,
    pointRadius: 4
  }]
}))

const consumptionChartData = computed(() => ({
  labels: logs.value.slice(0, 10).map(log => new Date(log.date).toLocaleDateString()),
  datasets: [{
    label: 'Consumo (Wh)',
    data: logs.value.slice(0, 10).map(log => log.whConsumed || 0),
    backgroundColor: 'rgba(255, 99, 132, 0.8)',
    borderColor: 'rgba(255, 99, 132, 1)',
    borderWidth: 1
  }]
}))

const chartOptions = {
  responsive: true,
  plugins: {
    legend: { position: 'top' },
    tooltip: { mode: 'index', intersect: false }
  },
  scales: {
    x: { display: true },
    y: { display: true, beginAtZero: true }
  }
}

onMounted(() => {
  fetchMetrics()
  fetchLogs()
})
</script>

<style scoped>
.dashboard {
  padding: 20px 0;
}

.card {
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  border: none;
  border-radius: 8px;
}

.card-title {
  font-weight: 600;
  margin-bottom: 15px;
}

.progress {
  border-radius: 10px;
}

.progress-bar {
  border-radius: 10px;
}
</style> 