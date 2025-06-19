<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <!-- Logo y título -->
      <div class="text-center">
        <div class="mx-auto h-16 w-16 bg-gradient-to-br from-primary-500 to-indigo-600 rounded-full flex items-center justify-center mb-4">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
          </svg>
        </div>
        <h2 class="text-3xl font-bold text-gray-900">Scooter Tracker</h2>
        <p class="mt-2 text-sm text-gray-600">
          {{ isLogin ? 'Inicia sesión en tu cuenta' : 'Crea una nueva cuenta' }}
        </p>
      </div>

      <!-- Formulario -->
      <div class="card">
        <div class="card-body">
          <form @submit.prevent="handleSubmit" class="space-y-6">
            <!-- Nombre (solo en registro) -->
            <div v-if="!isLogin">
              <label for="name" class="form-label">Nombre Completo</label>
              <input
                id="name"
                v-model="form.name"
                type="text"
                required
                class="form-input"
                placeholder="Tu nombre completo"
              />
            </div>

            <!-- Usuario/Email -->
            <div>
              <label for="username" class="form-label">
                {{ isLogin ? 'Usuario o Email' : 'Usuario' }}
              </label>
              <input
                id="username"
                v-model="form.username"
                type="text"
                required
                class="form-input"
                :placeholder="isLogin ? 'usuario@email.com' : 'mi_usuario'"
              />
            </div>

            <!-- Email (solo en registro) -->
            <div v-if="!isLogin">
              <label for="email" class="form-label">Email</label>
              <input
                id="email"
                v-model="form.email"
                type="email"
                required
                class="form-input"
                placeholder="tu@email.com"
              />
            </div>

            <!-- Contraseña -->
            <div>
              <label for="password" class="form-label">Contraseña</label>
              <div class="relative">
                <input
                  id="password"
                  v-model="form.password"
                  :type="showPassword ? 'text' : 'password'"
                  required
                  class="form-input pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <svg v-if="showPassword" class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path>
                  </svg>
                  <svg v-else class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                  </svg>
                </button>
              </div>
            </div>

            <!-- Confirmar contraseña (solo en registro) -->
            <div v-if="!isLogin">
              <label for="confirmPassword" class="form-label">Confirmar Contraseña</label>
              <input
                id="confirmPassword"
                v-model="form.confirmPassword"
                type="password"
                required
                class="form-input"
                placeholder="••••••••"
              />
              <p v-if="passwordError" class="mt-1 text-sm text-danger-600">
                Las contraseñas no coinciden
              </p>
            </div>

            <!-- Error general -->
            <div v-if="error" class="bg-danger-50 border border-danger-200 rounded-lg p-4">
              <div class="flex">
                <svg class="w-5 h-5 text-danger-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <p class="ml-3 text-sm text-danger-800">{{ error }}</p>
              </div>
            </div>

            <!-- Botón de envío -->
            <button
              type="submit"
              :disabled="loading"
              class="w-full btn-primary flex items-center justify-center"
            >
              <svg v-if="loading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ loading ? 'Procesando...' : (isLogin ? 'Iniciar Sesión' : 'Crear Cuenta') }}
            </button>
          </form>

          <!-- Cambiar entre login y registro -->
          <div class="mt-6 text-center">
            <p class="text-sm text-gray-600">
              {{ isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?' }}
              <button
                @click="toggleMode"
                class="font-medium text-primary-600 hover:text-primary-500 transition-colors"
              >
                {{ isLogin ? 'Regístrate aquí' : 'Inicia sesión aquí' }}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const emit = defineEmits(['login-success'])

const isLogin = ref(true)
const loading = ref(false)
const error = ref('')
const showPassword = ref(false)

const form = ref({
  name: '',
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const passwordError = computed(() => {
  if (!isLogin.value && form.value.password && form.value.confirmPassword) {
    return form.value.password !== form.value.confirmPassword
  }
  return false
})

const apiBase = import.meta.env.VITE_API_BASE || 'http://localhost:3000/api'

async function handleSubmit() {
  if (passwordError.value) return

  loading.value = true
  error.value = ''

  try {
    const endpoint = isLogin.value ? '/auth/login' : '/auth/register'
    const payload = isLogin.value 
      ? { username: form.value.username, password: form.value.password }
      : { 
          name: form.value.name,
          username: form.value.username, 
          email: form.value.email, 
          password: form.value.password 
        }

    const response = await fetch(`${apiBase}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Error en la autenticación')
    }

    // Guardar token y datos del usuario
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
    
    emit('login-success', data)
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

function toggleMode() {
  isLogin.value = !isLogin.value
  error.value = ''
  form.value = {
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  }
}
</script> 