<template>
  <div class="container my-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1 class="text-primary mb-0">Scooter Battery Charge Logs & Status</h1>
      <div>
        <button @click="showDashboard = !showDashboard" class="btn btn-outline-primary">
          {{ showDashboard ? 'Ver Formulario' : 'Ver Dashboard' }}
        </button>
      </div>
    </div>

    <!-- Dashboard -->
    <Dashboard v-if="showDashboard" />

    <!-- Formulario y contenido original -->
    <div v-else>
      <!-- Formulario -->
      <form @submit.prevent="saveLog" class="mb-4">
        <div class="row">
          <div class="col-md-2">
            <div class="form-group">
              <label for="date">Fecha</label>
              <input id="date" type="date" v-model="form.date" required class="form-control" />
            </div>
          </div>
          <div class="col-md-2">
            <div class="form-group">
              <label for="voltageStart">Voltaje Inicial (V)</label>
              <input id="voltageStart" type="number" v-model.number="form.voltageStart" step="0.1" min="0" max="100" required class="form-control" />
            </div>
          </div>
          <div class="col-md-2">
            <div class="form-group">
              <label for="voltageEnd">Voltaje Final (V)</label>
              <input id="voltageEnd" type="number" v-model.number="form.voltageEnd" step="0.1" min="0" max="100" required class="form-control" />
            </div>
          </div>
          <div class="col-md-2">
            <div class="form-group">
              <label for="kmTravelled">Kilómetros</label>
              <input id="kmTravelled" type="number" v-model.number="form.kmTravelled" step="0.1" min="0" required class="form-control" />
            </div>
          </div>
          <div class="col-md-2">
            <div class="form-group">
              <label for="batteryCapacity">Capacidad Batería (Wh)</label>
              <input id="batteryCapacity" type="number" v-model.number="form.batteryCapacity" step="100" min="0" required class="form-control" />
            </div>
          </div>
          <div class="col-md-2">
            <div class="form-group">
              <label for="speed">Velocidad Promedio (km/h)</label>
              <input id="speed" type="number" v-model.number="form.speed" step="1" min="0" class="form-control" />
            </div>
          </div>
        </div>
        
        <div class="row mt-3">
          <div class="col-md-3">
            <div class="form-group">
              <label for="weather">Clima</label>
              <select id="weather" v-model="form.weather" class="form-control">
                <option value="">Seleccionar clima</option>
                <option value="sunny">Soleado</option>
                <option value="cloudy">Nublado</option>
                <option value="rainy">Lluvioso</option>
                <option value="windy">Ventoso</option>
              </select>
            </div>
          </div>
          <div class="col-md-3">
            <div class="form-group">
              <label for="terrain">Terreno</label>
              <select id="terrain" v-model="form.terrain" class="form-control">
                <option value="">Seleccionar terreno</option>
                <option value="flat">Plano</option>
                <option value="hilly">Montañoso</option>
                <option value="mixed">Mixto</option>
              </select>
            </div>
          </div>
          <div class="col-md-3">
            <div class="form-group">
              <label for="riderWeight">Peso Conductor (kg)</label>
              <input id="riderWeight" type="number" v-model.number="form.riderWeight" step="1" min="0" class="form-control" />
            </div>
          </div>
          <div class="col-md-3">
            <div class="form-group">
              <label for="notes">Notas</label>
              <input id="notes" type="text" v-model="form.notes" placeholder="Notas opcionales" class="form-control" />
            </div>
          </div>
        </div>
        
        <div class="mt-3">
          <button type="submit" class="btn btn-primary mr-2">{{ editId ? 'Actualizar Log' : 'Agregar Log' }}</button>
          <button v-if="editId" @click="cancelEdit" type="button" class="btn btn-secondary">Cancelar</button>
        </div>
      </form>

      <!-- Battery Status -->
      <div class="mb-4">
        <h4>Estado de la Batería:</h4>
        <div class="progress" style="height: 25px;">
          <div
            class="progress-bar"
            role="progressbar"
            :style="{ width: batteryPercent + '%' }"
            :class="batteryBarClass"
            :aria-valuenow="batteryPercent"
            aria-valuemin="0"
            aria-valuemax="100"
          >
            {{ batteryPercent.toFixed(1) }}%
          </div>
        </div>
        <small class="text-muted">Voltaje: {{ latestVoltage }} V</small>
      </div>

      <!-- Charts -->
      <div class="row">
        <div class="col-md-6 mb-4">
          <Line :chart-data="voltageChartData" :chart-options="chartOptions" />
        </div>
        <div class="col-md-6 mb-4">
          <Line :chart-data="kmChartData" :chart-options="chartOptions" />
        </div>
      </div>

      <!-- Logs List -->
      <ul class="list-group">
        <li v-for="log in logs" :key="log._id" class="list-group-item d-flex justify-content-between align-items-center">
          <div>
            <strong>{{ formatDate(log.date) }}</strong> — {{ log.kmTravelled }} km
            <br />
            <small class="text-muted">
              Voltaje: {{ log.voltageStart }}V → {{ log.voltageEnd }}V | 
              Eficiencia: {{ log.efficiency ? log.efficiency.toFixed(2) : 'N/A' }} Wh/km |
              Consumo: {{ log.whConsumed ? log.whConsumed.toFixed(0) : 'N/A' }} Wh
            </small>
            <br />
            <em>{{ log.notes || 'Sin notas' }}</em>
          </div>
          <div>
            <button @click="editLog(log)" class="btn btn-sm btn-outline-primary mr-2">Editar</button>
            <button @click="deleteLog(log._id)" class="btn btn-sm btn-outline-danger">Eliminar</button>
          </div>
        </li>
      </ul>
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
    latestVoltage.value = logs.value[0].voltageStart // assume sorted desc by date
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
  if (confirm('¿Estás seguro de que quieres eliminar este log?')) {
    await fetch(`${apiBase}/logs/${id}`, { method: 'DELETE' })
    await fetchLogs()
  }
}

function formatDate(date) {
  return new Date(date).toLocaleDateString()
}

// Battery % assuming voltage range 60-84V
const batteryPercent = computed(() => {
  const v = latestVoltage.value
  if (v <= 60) return 0
  if (v >= 84) return 100
  return ((v - 60) / (84 - 60)) * 100
})

const batteryBarClass = computed(() => {
  if (batteryPercent.value > 75) return 'bg-success'
  if (batteryPercent.value > 50) return 'bg-info'
  if (batteryPercent.value > 25) return 'bg-warning'
  return 'bg-danger'
})

// Chart data
const voltageChartData = computed(() => ({
  labels: logs.value.map(log => new Date(log.date).toLocaleDateString()),
  datasets: [{
    label: 'Voltaje Inicial (V)',
    data: logs.value.map(log => log.voltageStart || log.voltage),
    borderColor: 'rgba(54, 162, 235, 1)',
    backgroundColor: 'rgba(54, 162, 235, 0.2)',
    fill: true,
    tension: 0.3,
    pointRadius: 3
  }]
}))

const kmChartData = computed(() => ({
  labels: logs.value.map(log => new Date(log.date).toLocaleDateString()),
  datasets: [{
    label: 'Kilómetros Recorridos',
    data: logs.value.map(log => log.kmTravelled),
    borderColor: 'rgba(255, 159, 64, 1)',
    backgroundColor: 'rgba(255, 159, 64, 0.2)',
    fill: true,
    tension: 0.3,
    pointRadius: 3
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
  fetchLogs()
})
</script>

<style scoped>
</style>
