<template>
  <div class="space-y-6">
    <!-- Battery Status Card -->
    <div class="card">
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
    <div class="card">
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
              :disabled="loading"
              class="btn-primary"
            >
              <svg v-if="loading" class="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <svg v-else class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              {{ loading ? 'Guardando...' : (editId ? 'Actualizar Registro' : 'Guardar Registro') }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Success message -->
    <div v-if="successMessage" class="card bg-success-50 border-success-200">
      <div class="card-body">
        <div class="flex">
          <svg class="w-5 h-5 text-success-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
          <p class="ml-3 text-sm text-success-700">{{ successMessage }}</p>
        </div>
      </div>
    </div>

    <!-- Error message -->
    <div v-if="errorMessage" class="card bg-danger-50 border-danger-200">
      <div class="card-body">
        <div class="flex">
          <svg class="w-5 h-5 text-danger-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <p class="ml-3 text-sm text-danger-700">{{ errorMessage }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'

export default {
  name: 'LogForm',
  emits: ['log-created'],
  setup(props, { emit }) {
    const form = ref({
      date: new Date().toISOString().slice(0, 10),
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
    const loading = ref(false)
    const successMessage = ref('')
    const errorMessage = ref('')

    const saveLog = async () => {
      try {
        loading.value = true
        errorMessage.value = ''
        successMessage.value = ''
        
        const token = localStorage.getItem('token')
        if (!token) {
          throw new Error('No hay token de autenticación')
        }

        const headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }

        const response = await fetch('http://localhost:3000/api/logs', {
          method: 'POST',
          headers,
          body: JSON.stringify(form.value),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Error al guardar el registro')
        }

        const data = await response.json()
        successMessage.value = 'Registro guardado exitosamente'
        resetForm()
        emit('log-created')
        
        // Limpiar mensaje de éxito después de 3 segundos
        setTimeout(() => {
          successMessage.value = ''
        }, 3000)
        
      } catch (err) {
        console.error('Error saving log:', err)
        errorMessage.value = err.message
        
        // Limpiar mensaje de error después de 5 segundos
        setTimeout(() => {
          errorMessage.value = ''
        }, 5000)
      } finally {
        loading.value = false
      }
    }

    const cancelEdit = () => {
      resetForm()
    }

    const resetForm = () => {
      form.value = {
        date: new Date().toISOString().slice(0, 10),
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

    onMounted(() => {
      // Establecer voltaje inicial por defecto
      latestVoltage.value = 84
    })

    return {
      form,
      editId,
      latestVoltage,
      loading,
      successMessage,
      errorMessage,
      batteryPercent,
      batteryBarClass,
      batteryIconClass,
      saveLog,
      cancelEdit,
      resetForm
    }
  }
}
</script> 