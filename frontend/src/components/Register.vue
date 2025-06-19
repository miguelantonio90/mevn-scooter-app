<template>
  <div class="space-y-6">
    <form @submit.prevent="handleRegister" class="space-y-4">
      <!-- Nombre -->
      <div>
        <label for="name" class="block text-sm font-medium text-gray-700">
          Nombre completo
        </label>
        <input
          id="name"
          v-model="form.name"
          type="text"
          required
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          placeholder="Tu nombre completo"
        />
      </div>

      <!-- Username -->
      <div>
        <label for="username" class="block text-sm font-medium text-gray-700">
          Nombre de usuario
        </label>
        <input
          id="username"
          v-model="form.username"
          type="text"
          required
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          placeholder="Nombre de usuario único"
        />
      </div>

      <!-- Email -->
      <div>
        <label for="email" class="block text-sm font-medium text-gray-700">
          Correo electrónico
        </label>
        <input
          id="email"
          v-model="form.email"
          type="email"
          required
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          placeholder="tu@email.com"
        />
      </div>

      <!-- Password -->
      <div>
        <label for="password" class="block text-sm font-medium text-gray-700">
          Contraseña
        </label>
        <input
          id="password"
          v-model="form.password"
          type="password"
          required
          minlength="6"
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          placeholder="Mínimo 6 caracteres"
        />
      </div>

      <!-- Confirm Password -->
      <div>
        <label for="confirmPassword" class="block text-sm font-medium text-gray-700">
          Confirmar contraseña
        </label>
        <input
          id="confirmPassword"
          v-model="form.confirmPassword"
          type="password"
          required
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          placeholder="Repite tu contraseña"
        />
      </div>

      <!-- Error message -->
      <div v-if="error" class="bg-danger-50 border border-danger-200 rounded-md p-4">
        <div class="flex">
          <svg class="w-5 h-5 text-danger-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <p class="ml-3 text-sm text-danger-700">{{ error }}</p>
        </div>
      </div>

      <!-- Submit button -->
      <button
        type="submit"
        :disabled="loading"
        class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg v-if="loading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        {{ loading ? 'Registrando...' : 'Crear cuenta' }}
      </button>
    </form>

    <!-- Terms and conditions -->
    <div class="text-center">
      <p class="text-xs text-gray-500">
        Al registrarte, aceptas nuestros 
        <a href="#" class="text-primary-600 hover:text-primary-500">Términos de servicio</a> 
        y 
        <a href="#" class="text-primary-600 hover:text-primary-500">Política de privacidad</a>
      </p>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'Register',
  emits: ['register-success', 'register-error'],
  setup(props, { emit }) {
    const form = ref({
      name: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    })
    
    const loading = ref(false)
    const error = ref('')

    const validateForm = () => {
      if (form.value.password !== form.value.confirmPassword) {
        error.value = 'Las contraseñas no coinciden'
        return false
      }
      
      if (form.value.password.length < 6) {
        error.value = 'La contraseña debe tener al menos 6 caracteres'
        return false
      }
      
      if (!form.value.email.includes('@')) {
        error.value = 'Por favor ingresa un email válido'
        return false
      }
      
      return true
    }

    const handleRegister = async () => {
      error.value = ''
      
      if (!validateForm()) {
        return
      }
      
      loading.value = true
      
      try {
        const response = await fetch('http://localhost:3000/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: form.value.name,
            username: form.value.username,
            email: form.value.email,
            password: form.value.password
          })
        })
        
        const data = await response.json()
        
        if (response.ok) {
          emit('register-success', data)
        } else {
          error.value = data.error || 'Error al registrar usuario'
          emit('register-error', error.value)
        }
      } catch (err) {
        console.error('Register error:', err)
        error.value = 'Error de conexión. Intenta de nuevo.'
        emit('register-error', error.value)
      } finally {
        loading.value = false
      }
    }

    return {
      form,
      loading,
      error,
      handleRegister
    }
  }
}
</script> 