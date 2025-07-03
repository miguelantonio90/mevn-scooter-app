<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Configuración</h1>
      <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">Personaliza tu experiencia en la aplicación</p>
    </div>

    <!-- Configuraciones Generales -->
    <div class="card"> <!-- bg-white dark:bg-gray-800 border dark:border-gray-700 -->
      <div class="card-header"> <!-- border-b dark:border-gray-700 -->
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Configuraciones Generales</h2>
      </div>
      <div class="card-body space-y-6">
        <!-- Unidades de Medida -->
        <div>
          <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Unidades de Medida</h3>
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-700 dark:text-gray-300">Distancia</p>
                <p class="text-sm text-gray-500 dark:text-gray-400">Unidad para mostrar distancias</p>
              </div>
              <select v-model="settings.distanceUnit" class="form-input dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 w-32">
                <option value="km">Kilómetros</option>
                <option value="mi">Millas</option>
              </select>
            </div>
            
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-700 dark:text-gray-300">Velocidad</p>
                <p class="text-sm text-gray-500 dark:text-gray-400">Unidad para mostrar velocidades</p>
              </div>
              <select v-model="settings.speedUnit" class="form-input dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 w-32">
                <option value="kmh">km/h</option>
                <option value="mph">mph</option>
              </select>
            </div>
            
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-700 dark:text-gray-300">Temperatura</p>
                <p class="text-sm text-gray-500 dark:text-gray-400">Unidad para mostrar temperaturas</p>
              </div>
              <select v-model="settings.temperatureUnit" class="form-input dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 w-32">
                <option value="celsius">Celsius</option>
                <option value="fahrenheit">Fahrenheit</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Notificaciones -->
        <div>
          <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Notificaciones</h3>
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-700 dark:text-gray-300">Notificaciones de batería baja</p>
                <p class="text-sm text-gray-500 dark:text-gray-400">Recibe alertas cuando la batería esté baja</p>
              </div>
              <button
                @click="settings.batteryNotifications = !settings.batteryNotifications"
                :class="[
                  'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                  settings.batteryNotifications ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-600'
                ]"
              >
                <span
                  :class="[
                    'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                    settings.batteryNotifications ? 'translate-x-6' : 'translate-x-1'
                  ]"
                ></span>
              </button>
            </div>
            
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-700 dark:text-gray-300">Recordatorios de mantenimiento</p>
                <p class="text-sm text-gray-500 dark:text-gray-400">Recibe recordatorios para el mantenimiento</p>
              </div>
              <button
                @click="settings.maintenanceNotifications = !settings.maintenanceNotifications"
                :class="[
                  'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                  settings.maintenanceNotifications ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-600'
                ]"
              >
                <span
                  :class="[
                    'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                    settings.maintenanceNotifications ? 'translate-x-6' : 'translate-x-1'
                  ]"
                ></span>
              </button>
            </div>
          </div>
        </div>

        <!-- Privacidad -->
        <div>
          <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Privacidad</h3>
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-700 dark:text-gray-300">Compartir datos anónimos</p>
                <p class="text-sm text-gray-500 dark:text-gray-400">Ayuda a mejorar la aplicación compartiendo datos anónimos</p>
              </div>
              <button
                @click="settings.shareAnonymousData = !settings.shareAnonymousData"
                :class="[
                  'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                  settings.shareAnonymousData ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-600'
                ]"
              >
                <span
                  :class="[
                    'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                    settings.shareAnonymousData ? 'translate-x-6' : 'translate-x-1'
                  ]"
                ></span>
              </button>
            </div>
          </div>
        </div>

        <!-- Metas -->
        <div>
          <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Metas</h3>
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-700 dark:text-gray-300">Meta de Eficiencia (Wh/km)</p>
                <p class="text-sm text-gray-500 dark:text-gray-400">Establece tu objetivo de consumo energético.</p>
              </div>
              <input
                type="number"
                id="efficiencyGoal"
                v-model.number="settings.efficiencyGoal"
                min="1"
                max="1000"
                placeholder="Ej: 15"
                class="form-input dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 w-32"
              />
            </div>
          </div>
        </div>

        <!-- Tema -->
        <div>
          <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Tema</h3>
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-700 dark:text-gray-300">Modo Oscuro</p>
                <p class="text-sm text-gray-500 dark:text-gray-400">Activa el tema oscuro para la aplicación</p>
              </div>
              <button
                @click="toggleTheme"
                :class="[
                  'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                  isDarkMode ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-600'
                ]"
              >
                <span
                  :class="[
                    'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                    isDarkMode ? 'translate-x-6' : 'translate-x-1'
                  ]"
                ></span>
              </button>
            </div>
          </div>
        </div>

        <!-- Botón de guardar -->
        <div class="flex items-center justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
          <button 
            @click="saveSettings" 
            :disabled="saving"
            class="btn-primary dark:bg-primary-500 dark:hover:bg-primary-600"
          >
            <svg v-if="saving" class="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ saving ? 'Guardando...' : 'Guardar Configuración' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Información de la Aplicación -->
    <div class="card"> <!-- bg-white dark:bg-gray-800 border dark:border-gray-700 -->
      <div class="card-header"> <!-- border-b dark:border-gray-700 -->
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Información de la Aplicación</h2>
      </div>
      <div class="card-body space-y-4">
        <div class="flex items-center justify-between">
          <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Versión</span>
          <span class="text-sm text-gray-900 dark:text-gray-100">1.0.0</span>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Última actualización</span>
          <span class="text-sm text-gray-900 dark:text-gray-100">{{ new Date().toLocaleDateString() }}</span>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Desarrollador</span>
          <span class="text-sm text-gray-900 dark:text-gray-100">Scooter Tracker Team</span>
        </div>
      </div>
    </div>

    <!-- Acciones Peligrosas -->
    <div class="card border-danger-200 dark:border-danger-700">
      <div class="card-header"> <!-- border-b dark:border-danger-700 -->
        <h2 class="text-xl font-semibold text-danger-700 dark:text-danger-300">Zona de Peligro</h2>
      </div>
      <div class="card-body space-y-4">
        <div>
          <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Eliminar Datos</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">Estas acciones son irreversibles. Ten cuidado.</p>
          
          <div class="space-y-3">
            <button
              @click="clearAllData"
              class="inline-flex items-center px-4 py-2 border border-danger-300 dark:border-danger-600 rounded-md shadow-sm text-sm font-medium text-danger-700 dark:text-danger-300 bg-white dark:bg-gray-800 hover:bg-danger-50 dark:hover:bg-danger-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-danger-500"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
              Eliminar todos los datos
            </button>
            
            <button
              @click="exportData"
              class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              Exportar datos
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Success message -->
    <div v-if="successMessage" class="card bg-success-50 border-success-200 dark:bg-success-800 dark:border-success-600">
      <div class="card-body">
        <div class="flex">
          <svg class="w-5 h-5 text-success-400 dark:text-success-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
          <p class="ml-3 text-sm text-success-700 dark:text-success-200">{{ successMessage }}</p>
        </div>
      </div>
    </div>

    <!-- Error message -->
    <div v-if="errorMessage" class="card bg-danger-50 border-danger-200 dark:bg-danger-800 dark:border-danger-600">
      <div class="card-body">
        <div class="flex">
          <svg class="w-5 h-5 text-danger-400 dark:text-danger-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <p class="ml-3 text-sm text-danger-700 dark:text-danger-200">{{ errorMessage }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useTheme } from '@/composables/useTheme';

export default {
  name: 'Settings',
  setup() {
    const { isDarkMode, toggleTheme } = useTheme();
    const { addNotification } = useNotifications();

    const settings = ref({
      distanceUnit: 'km',
      speedUnit: 'kmh',
      temperatureUnit: 'celsius',
      batteryNotifications: true,
      maintenanceNotifications: true,
      shareAnonymousData: false,
      efficiencyGoal: null // Nuevo campo para la meta de eficiencia
    })
    
    const saving = ref(false)
    // const successMessage = ref('') // Eliminado
    // const errorMessage = ref('') // Eliminado

    const loadSettings = () => {
      const savedSettings = localStorage.getItem('appSettings')
      if (savedSettings) {
        settings.value = { ...settings.value, ...JSON.parse(savedSettings) }
      }
    }

    const saveSettings = async () => {
      try {
        saving.value = true
        // errorMessage.value = '' // Eliminado
        // successMessage.value = '' // Eliminado
        
        // Guardar en localStorage
        localStorage.setItem('appSettings', JSON.stringify(settings.value))
        
        // Aquí podrías enviar al backend si es necesario
        const token = localStorage.getItem('token')
        if (token) {
          const response = await fetch(`${import.meta.env.VITE_API_BASE}/auth/settings`, {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(settings.value)
          })
          
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Error al guardar configuración en servidor')
          }
        }
        
        addNotification('Configuración guardada exitosamente', 'success');
        
      } catch (err) {
        console.error('Error saving settings:', err)
        addNotification(err.message || 'Error al guardar configuración', 'error');
      } finally {
        saving.value = false
      }
    }

    const clearAllData = () => {
      if (confirm('¿Estás seguro de que quieres eliminar todos los datos locales? Esta acción no se puede deshacer.')) {
        localStorage.clear()
        addNotification('Datos locales eliminados. Recargando...', 'info', 3000)
        setTimeout(() => window.location.reload(), 3000);
      }
    }

    const exportData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          addNotification('Debes estar autenticado para exportar datos.', 'error');
          throw new Error('No autenticado');
        }

        addNotification('Preparando datos para exportación...', 'info', 2000);

        // 1. Obtener logs del backend
        const logsResponse = await fetch(`${import.meta.env.VITE_API_BASE}/logs/export`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!logsResponse.ok) {
          const errorData = await logsResponse.json();
          throw new Error(errorData.error || 'Error al obtener logs para exportar');
        }
        const logsData = await logsResponse.json();

        // 2. Preparar todos los datos para la exportación
        const dataToExport = {
          userInfo: JSON.parse(localStorage.getItem('user') || '{}'),
          appSettings: JSON.parse(localStorage.getItem('appSettings') || '{}'),
          exportedLogs: logsData,
          exportDate: new Date().toISOString()
        };
        
        // 3. Crear y descargar el archivo JSON
        const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `scooter-tracker-data-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        addNotification('Datos exportados exitosamente (incluyendo logs)', 'success');
      } catch (err) {
        console.error('Error exporting data:', err);
        addNotification(err.message || 'Error al exportar datos', 'error');
      }
    };

    onMounted(() => {
      loadSettings()
    })

    return {
      settings,
      saving,
      successMessage,
      errorMessage,
      saveSettings,
      clearAllData,
      exportData
    }
  }
}
</script> 