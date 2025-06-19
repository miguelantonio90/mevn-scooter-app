<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-3xl font-bold text-gray-900">Perfil de Usuario</h1>
      <p class="mt-1 text-sm text-gray-600">Gestiona tu información personal y datos del scooter</p>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="text-center py-12">
      <svg class="mx-auto h-12 w-12 text-gray-400 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
      </svg>
      <p class="mt-2 text-sm text-gray-500">Cargando perfil...</p>
    </div>

    <!-- Content -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Información Personal -->
      <div class="card">
        <div class="card-header">
          <h2 class="text-xl font-semibold text-gray-900">Información Personal</h2>
        </div>
        <div class="card-body">
          <form @submit.prevent="updateProfile" class="space-y-4">
            <div>
              <label for="name" class="form-label">Nombre Completo</label>
              <input 
                id="name" 
                v-model="profile.name" 
                type="text" 
                required 
                class="form-input"
              />
            </div>
            
            <div>
              <label for="username" class="form-label">Nombre de Usuario</label>
              <input 
                id="username" 
                v-model="profile.username" 
                type="text" 
                required 
                class="form-input"
              />
            </div>
            
            <div>
              <label for="email" class="form-label">Correo Electrónico</label>
              <input 
                id="email" 
                v-model="profile.email" 
                type="email" 
                required 
                class="form-input"
              />
            </div>

            <div class="flex items-center justify-end pt-4">
              <button 
                type="submit" 
                :disabled="updating"
                class="btn-primary"
              >
                <svg v-if="updating" class="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ updating ? 'Actualizando...' : 'Actualizar Perfil' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Información del Scooter -->
      <div class="card">
        <div class="card-header">
          <h2 class="text-xl font-semibold text-gray-900">Datos del Scooter</h2>
        </div>
        <div class="card-body">
          <form @submit.prevent="updateScooter" class="space-y-4">
            <div>
              <label for="brand" class="form-label">Marca</label>
              <input 
                id="brand" 
                v-model="scooter.brand" 
                type="text" 
                required 
                class="form-input"
                placeholder="Ej: Xiaomi, Segway, etc."
              />
            </div>
            
            <div>
              <label for="model" class="form-label">Modelo</label>
              <input 
                id="model" 
                v-model="scooter.model" 
                type="text" 
                required 
                class="form-input"
                placeholder="Ej: Mi Electric Scooter Pro 2"
              />
            </div>
            
            <div>
              <label for="year" class="form-label">Año</label>
              <input 
                id="year" 
                v-model="scooter.year" 
                type="number" 
                min="2010" 
                max="2030" 
                required 
                class="form-input"
                placeholder="2023"
              />
            </div>
            
            <div>
              <label for="motorPower" class="form-label">Potencia del Motor (W) <span class="text-gray-500">(Opcional)</span></label>
              <input 
                id="motorPower" 
                v-model="scooter.motorPower" 
                type="number" 
                min="100" 
                max="5000" 
                class="form-input"
                placeholder="Dejar vacío si no conoces"
              />
            </div>
            
            <div>
              <label for="batteryCapacity" class="form-label">Capacidad de Batería (Wh)</label>
              <input 
                id="batteryCapacity" 
                v-model="scooter.batteryCapacity" 
                type="number" 
                min="100" 
                max="10000" 
                required 
                class="form-input"
                placeholder="1000"
              />
            </div>
            
            <div>
              <label for="maxSpeed" class="form-label">Velocidad Máxima (km/h)</label>
              <input 
                id="maxSpeed" 
                v-model="scooter.maxSpeed" 
                type="number" 
                min="10" 
                max="100" 
                required 
                class="form-input"
                placeholder="25"
              />
            </div>

            <div class="flex items-center justify-end pt-4">
              <button 
                type="submit" 
                :disabled="updatingScooter"
                class="btn-primary"
              >
                <svg v-if="updatingScooter" class="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ updatingScooter ? 'Actualizando...' : 'Actualizar Scooter' }}
              </button>
            </div>
          </form>
        </div>
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
import { ref, onMounted } from 'vue'

export default {
  name: 'Profile',
  setup() {
    const profile = ref({
      name: '',
      username: '',
      email: ''
    })
    
    const scooter = ref({
      brand: '',
      model: '',
      year: new Date().getFullYear(),
      motorPower: 300,
      batteryCapacity: 1000,
      maxSpeed: 25
    })
    
    const loading = ref(true)
    const updating = ref(false)
    const updatingScooter = ref(false)
    const successMessage = ref('')
    const errorMessage = ref('')

    const fetchProfile = async () => {
      try {
        loading.value = true
        
        const token = localStorage.getItem('token')
        if (!token) {
          throw new Error('No hay token de autenticación')
        }

        const response = await fetch(`${import.meta.env.VITE_API_BASE}/auth/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        if (response.ok) {
          const data = await response.json()
          profile.value = {
            name: data.user.name || '',
            username: data.user.username || '',
            email: data.user.email || ''
          }
          
          // Cargar datos del scooter si existen
          if (data.user.scooter) {
            scooter.value = { ...data.user.scooter }
          }
        }
        
      } catch (err) {
        console.error('Error fetching profile:', err)
        // Cargar datos básicos del localStorage
        const user = JSON.parse(localStorage.getItem('user') || '{}')
        profile.value = {
          name: user.name || '',
          username: user.username || '',
          email: user.email || ''
        }
      } finally {
        loading.value = false
      }
    }

    const updateProfile = async () => {
      try {
        updating.value = true
        errorMessage.value = ''
        successMessage.value = ''
        
        const token = localStorage.getItem('token')
        const response = await fetch(`${import.meta.env.VITE_API_BASE}/auth/profile`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(profile.value)
        })

        if (response.ok) {
          successMessage.value = 'Perfil actualizado exitosamente'
          // Actualizar localStorage
          const user = JSON.parse(localStorage.getItem('user') || '{}')
          user.name = profile.value.name
          user.username = profile.value.username
          user.email = profile.value.email
          localStorage.setItem('user', JSON.stringify(user))
        } else {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Error al actualizar perfil')
        }
        
      } catch (err) {
        console.error('Error updating profile:', err)
        errorMessage.value = err.message
      } finally {
        updating.value = false
        setTimeout(() => {
          successMessage.value = ''
          errorMessage.value = ''
        }, 3000)
      }
    }

    const updateScooter = async () => {
      try {
        updatingScooter.value = true
        errorMessage.value = ''
        successMessage.value = ''
        
        const token = localStorage.getItem('token')
        const response = await fetch(`${import.meta.env.VITE_API_BASE}/auth/scooter`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(scooter.value)
        })

        if (response.ok) {
          successMessage.value = 'Datos del scooter actualizados exitosamente'
        } else {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Error al actualizar datos del scooter')
        }
        
      } catch (err) {
        console.error('Error updating scooter:', err)
        errorMessage.value = err.message
      } finally {
        updatingScooter.value = false
        setTimeout(() => {
          successMessage.value = ''
          errorMessage.value = ''
        }, 3000)
      }
    }

    onMounted(() => {
      fetchProfile()
    })

    return {
      profile,
      scooter,
      loading,
      updating,
      updatingScooter,
      successMessage,
      errorMessage,
      updateProfile,
      updateScooter
    }
  }
}
</script> 