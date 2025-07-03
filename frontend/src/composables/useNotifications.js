import { ref, readonly } from 'vue';

const notifications = ref([]); // Array de objetos de notificación

let nextId = 0;

export function useNotifications() {
  const addNotification = (message, type = 'info', duration = 5000) => {
    const id = nextId++;
    notifications.value.push({ id, message, type, duration });

    if (duration) {
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    }
  };

  const removeNotification = (id) => {
    notifications.value = notifications.value.filter(n => n.id !== id);
  };

  return {
    notifications: readonly(notifications), // Exponer como readonly para evitar mutaciones externas directas
    addNotification,
    removeNotification,
  };
}
