<template>
  <div class="container my-4">
    <h1 class="mb-4 text-primary">Scooter Battery Charge Logs & Status</h1>

    <!-- Formulario -->
    <form @submit.prevent="saveLog" class="mb-4">
      <div class="form-row">
        <div class="form-group col-md-3">
          <label for="date">Date</label>
          <input id="date" type="date" v-model="form.date" required class="form-control" />
        </div>
        <div class="form-group col-md-3">
          <label for="voltage">Voltage (V)</label>
          <input id="voltage" type="number" v-model.number="form.voltage" step="0.1" min="0" max="100" required class="form-control" />
        </div>
        <div class="form-group col-md-3">
          <label for="kmTravelled">Kilometers travelled</label>
          <input id="kmTravelled" type="number" v-model.number="form.kmTravelled" step="0.1" min="0" required class="form-control" />
        </div>
        <div class="form-group col-md-3">
          <label for="notes">Notes</label>
          <input id="notes" type="text" v-model="form.notes" placeholder="Optional notes" class="form-control" />
        </div>
      </div>
      <button type="submit" class="btn btn-primary mr-2">{{ editId ? 'Update Log' : 'Add Log' }}</button>
      <button v-if="editId" @click="cancelEdit" type="button" class="btn btn-secondary">Cancel</button>
    </form>

    <!-- Battery Status -->
    <div class="mb-4">
      <h4>Battery Status:</h4>
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
      <small class="text-muted">Voltage: {{ latestVoltage }} V</small>
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
          <strong>{{ formatDate(log.date) }}</strong> — {{ log.kmTravelled }} km, {{ log.voltage }} V
          <br />
          <em>{{ log.notes || 'No notes' }}</em>
        </div>
        <div>
          <button @click="editLog(log)" class="btn btn-sm btn-outline-primary mr-2">Edit</button>
          <button @click="deleteLog(log._id)" class="btn btn-sm btn-outline-danger">Delete</button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
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

const logs = ref([])
const form = ref({
  date: '',
  voltage: 0,
  kmTravelled: 0,
  notes: ''
})
const editId = ref(null)
const latestVoltage = ref(0)

const apiBase = import.meta.env.VITE_API_BASE || 'http://localhost:3000/api'

async function fetchLogs() {
  const res = await fetch(`${apiBase}/logs`)
  logs.value = await res.json()
  if (logs.value.length) {
    latestVoltage.value = logs.value[0].voltage // assume sorted desc by date
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
  form.value = { ...log, date: log.date.slice(0, 10) }
}

function cancelEdit() {
  resetForm()
}

function resetForm() {
  form.value = {
    date: '',
    voltage: 0,
    kmTravelled: 0,
    notes: ''
  }
  editId.value = null
}

async function deleteLog(id) {
  if (confirm('Are you sure you want to delete this log?')) {
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
    label: 'Voltage (V)',
    data: logs.value.map(log => log.voltage),
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
    label: 'Kilometers Travelled',
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
