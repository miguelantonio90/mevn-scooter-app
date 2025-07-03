import { ref, onMounted, watch } from 'vue';

export function useTheme() {
  const THEME_KEY = 'scooter-app-theme';
  const isDarkMode = ref(false);

  const applyTheme = (isDark) => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    isDarkMode.value = isDark;
  };

  const loadTheme = () => {
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme) {
      applyTheme(savedTheme === 'dark');
    } else {
      // Preferencia del sistema si no hay nada guardado
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      applyTheme(prefersDark);
    }
  };

  const toggleTheme = () => {
    const newThemeIsDark = !isDarkMode.value;
    applyTheme(newThemeIsDark);
    localStorage.setItem(THEME_KEY, newThemeIsDark ? 'dark' : 'light');
  };

  onMounted(() => {
    loadTheme();

    // Escuchar cambios en la preferencia del sistema
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      // Solo aplicar si no hay preferencia guardada explícitamente
      if (!localStorage.getItem(THEME_KEY)) {
        applyTheme(e.matches);
      }
    });
  });

  // También podemos observar cambios en isDarkMode por si se modifica externamente
  // aunque toggleTheme es la forma principal de cambiarlo.
  watch(isDarkMode, (newValue) => {
    applyTheme(newValue);
    localStorage.setItem(THEME_KEY, newValue ? 'dark' : 'light');
  });

  return {
    isDarkMode,
    toggleTheme,
    loadTheme, // Exponer por si se necesita llamar manualmente en algún punto (ej. App.vue onMount)
  };
}
