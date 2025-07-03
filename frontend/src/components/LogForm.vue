<template>
  <div class="space-y-6">
    <!-- Battery Status Card -->
    <BaseCard>
      <template #header>
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Estado de la Batería</h2>
      </template>
      <div class="flex items-center justify-between">
        <div class="flex-1">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Nivel de Batería</span>
            <span class="text-sm font-medium text-gray-900 dark:text-white">{{ batteryPercent.toFixed(1) }}%</span>
          </div>
          <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
            <div
              class="h-4 rounded-full transition-all duration-500 ease-out"
              :class="batteryBarClass"
              :style="{ width: batteryPercent + '%' }"
            ></div>
          </div>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-2">Voltaje actual: {{ latestVoltage }}V</p>
        </div>
        <div class="ml-6">
          <div class="w-16 h-16 rounded-full flex items-center justify-center" :class="batteryIconClass">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
          </div>
        </div>
      </div>
    </BaseCard>

    <!-- Formulario -->
    <BaseCard>
      <template #header>
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
          {{ editId ? 'Editar Registro' : 'Nuevo Registro de Viaje' }}
        </h2>
      </template>
      <form @submit.prevent="saveLog" class="space-y-6">
        <!-- Primera fila -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <BaseFormLabel forInput="date">Fecha</BaseFormLabel>
            <input
              id="date"
              type="date"
              v-model="form.date"
              required
              class="form-input dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
            />
          </div>

          <div>
            <BaseFormLabel forInput="voltageStart">Voltaje Inicial (V)</BaseFormLabel>
            <input
              id="voltageStart"
              type="number"
              v-model.number="form.voltageStart"
              step="0.1"
              min="0"
              max="100"
              required
              class="form-input dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
              placeholder="84.0"
            />
          </div>

          <div>
            <BaseFormLabel forInput="voltageEnd">Voltaje Final (V)</BaseFormLabel>
            <input
              id="voltageEnd"
              type="number"
              v-model.number="form.voltageEnd"
              step="0.1"
              min="0"
              max="100"
              required
              class="form-input dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
              placeholder="72.0"
            />
          </div>
        </div>

        <!-- Segunda fila -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <BaseFormLabel forInput="kmTravelled">Kilómetros Recorridos</BaseFormLabel>
            <input
              id="kmTravelled"
              type="number"
              v-model.number="form.kmTravelled"
              step="0.1"
              min="0"
              required
              class="form-input dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
              placeholder="15.5"
            />
          </div>

          <div>
            <BaseFormLabel forInput="speed">Velocidad Promedio (km/h)</BaseFormLabel>
            <input
              id="speed"
              type="number"
              v-model.number="form.speed"
              step="1"
              min="0"
              class="form-input dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
              placeholder="25"
            />
          </div>

          <div>
            <BaseFormLabel forInput="riderWeight">Peso del Conductor (kg)</BaseFormLabel>
            <input
              id="riderWeight"
              type="number"
              v-model.number="form.riderWeight"
              step="1"
              min="0"
              class="form-input dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
              placeholder="70"
            />
          </div>
        </div>

        <!-- Tercera fila -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <BaseFormLabel forInput="weather">Condiciones Climáticas</BaseFormLabel>
            <select id="weather" v-model="form.weather" class="form-input dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600">
              <option value="">Seleccionar clima</option>
              <option value="sunny">☀️ Soleado</option>
              <option value="cloudy">☁️ Nublado</option>
              <option value="rainy">🌧️ Lluvioso</option>
              <option value="windy">💨 Ventoso</option>
            </select>
          </div>

          <div>
            <BaseFormLabel forInput="terrain">Tipo de Terreno</BaseFormLabel>
            <select id="terrain" v-model="form.terrain" class="form-input dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600">
              <option value="">Seleccionar terreno</option>
              <option value="flat">🛣️ Plano</option>
              <option value="hilly">⛰️ Montañoso</option>
              <option value="mixed">🔄 Mixto</option>
            </select>
          </div>
        </div>

        <!-- Cuarta fila -->
        <div>
          <BaseFormLabel forInput="notes">Notas Adicionales</BaseFormLabel>
          <textarea
            id="notes"
            v-model="form.notes"
            rows="3"
            class="form-input dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
            placeholder="Observaciones sobre el viaje, condiciones especiales, etc..."
          ></textarea>
        </div>

        <!-- Botones -->
        <div class="flex items-center justify-end space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            v-if="editId"
            @click="cancelEdit"
            type="button"
            class="btn-secondary dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-gray-200"
          >
            Cancelar
          </button>
          <button
            type="submit"
            :disabled="loading"
            class="btn-primary dark:bg-primary-500 dark:hover:bg-primary-600"
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
    </BaseCard>
    <!-- Mensajes de éxito/error eliminados, se usarán notificaciones globales -->
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useNotifications } from '@/composables/useNotifications'
import BaseCard from './BaseCard.vue' // Asumo que también usaremos BaseCard aquí
import BaseFormLabel from './BaseFormLabel.vue'

export default {
  name: 'LogForm',
  components: { // Añadir BaseCard y BaseFormLabel a los componentes
    BaseCard,
    BaseFormLabel
  },
  emits: ['log-created'],
  setup(props, { emit }) {
    const { addNotification } = useNotifications();
    const form = ref({
      date: new Date().toISOString().slice(0, 10),
      voltageStart: 0,
      voltageEnd: 0,
      kmTravelled: 0,
      weather: '',
      terrain: '',
      riderWeight: 0,
      speed: 0,
      notes: ''
    })
    
    const editId = ref(null)
    const latestVoltage = ref(0)
    const loading = ref(false)
    // const successMessage = ref('') // Eliminado
    // const errorMessage = ref('') // Eliminado

    const saveLog = async () => {
      try {
        loading.value = true
        // errorMessage.value = '' // Eliminado
        // successMessage.value = '' // Eliminado
        
        const token = localStorage.getItem('token')
        if (!token) {
          throw new Error('No hay token de autenticación')
        }

        const headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }

        const response = await fetch(`${import.meta.env.VITE_API_BASE}/logs`, {
          method: 'POST',
          headers,
          body: JSON.stringify(form.value),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Error al guardar el registro')
        }

        // const data = await response.json() // No es necesario si no se usa
        addNotification('Registro guardado exitosamente', 'success');
        resetForm()
        emit('log-created')
        
      } catch (err) {
        console.error('Error saving log:', err)
        addNotification(err.message || 'Error al guardar el registro', 'error');
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
      // successMessage, // Eliminado
      // errorMessage, // Eliminado
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