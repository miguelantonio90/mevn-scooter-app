<template>
  <div 
    class="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out" 
    :class="isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'"
  >
    <!-- Header del sidebar -->
    <div class="flex items-center justify-between h-16 px-6 border-b border-gray-200">
      <div class="flex items-center space-x-3">
        <div class="w-8 h-8 bg-gradient-to-br from-primary-500 to-indigo-600 rounded-lg flex items-center justify-center">
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
          </svg>
        </div>
        <h1 class="text-xl font-bold text-gray-900">Scooter Tracker</h1>
      </div>
      <button @click="$emit('close')" class="lg:hidden p-2 rounded-lg hover:bg-gray-100">
        <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    </div>

    <!-- Perfil del usuario -->
    <div class="px-6 py-4 border-b border-gray-200">
      <div class="flex items-center space-x-3">
        <div class="w-10 h-10 bg-gradient-to-br from-primary-500 to-indigo-600 rounded-full flex items-center justify-center">
          <span class="text-white font-semibold text-sm">{{ userInitials }}</span>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-gray-900 truncate">{{ user?.name || 'Usuario' }}</p>
          <p class="text-xs text-gray-500 truncate">{{ user?.email || 'usuario@email.com' }}</p>
        </div>
      </div>
    </div>

    <!-- Navegación -->
    <nav class="flex-1 px-4 py-6 space-y-2">
      <div class="space-y-1">
        <h3 class="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Navegación
        </h3>
        
        <button
          @click="navigateTo('dashboard')"
          class="w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors"
          :class="currentPage === 'dashboard' ? 'bg-primary-100 text-primary-700' : 'text-gray-700 hover:bg-gray-100'"
        >
          <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
          </svg>
          Dashboard
        </button>

        <button
          @click="navigateTo('form')"
          class="w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors"
          :class="currentPage === 'form' ? 'bg-primary-100 text-primary-700' : 'text-gray-700 hover:bg-gray-100'"
        >
          <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          Nuevo Registro
        </button>

        <button
          @click="navigateTo('logs')"
          class="w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors"
          :class="currentPage === 'logs' ? 'bg-primary-100 text-primary-700' : 'text-gray-700 hover:bg-gray-100'"
        >
          <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
          </svg>
          Historial
        </button>
      </div>

      <div class="space-y-1 pt-4">
        <h3 class="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Configuración
        </h3>
        
        <button
          @click="navigateTo('profile')"
          class="w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors"
          :class="currentPage === 'profile' ? 'bg-primary-100 text-primary-700' : 'text-gray-700 hover:bg-gray-100'"
        >
          <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
          </svg>
          Perfil
        </button>

        <button
          @click="navigateTo('settings')"
          class="w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors"
          :class="currentPage === 'settings' ? 'bg-primary-100 text-primary-700' : 'text-gray-700 hover:bg-gray-100'"
        >
          <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
          </svg>
          Configuración
        </button>
      </div>
    </nav>

    <!-- Footer del sidebar -->
    <div class="px-4 py-4 border-t border-gray-200">
      <button
        @click="handleLogout"
        class="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
        </svg>
        Cerrar Sesión
      </button>
    </div>
  </div>

  <!-- Overlay para móviles -->
  <div v-if="isOpen" @click="$emit('close')" class="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"></div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  currentPage: {
    type: String,
    default: 'dashboard'
  },
  isOpen: Boolean
})

const emit = defineEmits(['navigate', 'close', 'logout'])

const userInitials = computed(() => {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  if (!user.name) return 'U'
  return user.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
})

const user = computed(() => {
  try {
    return JSON.parse(localStorage.getItem('user') || '{}')
  } catch {
    return {}
  }
})

function navigateTo(view) {
  emit('navigate', view)
  emit('close')
}

function handleLogout() {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  emit('logout')
}
</script> 