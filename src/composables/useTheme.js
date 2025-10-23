import { ref, onMounted } from 'vue';

const theme = ref('light');

export function useTheme() {
  const toggleTheme = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme.value);
  };

  const setTheme = (mode) => {
    theme.value = mode;
    document.documentElement.setAttribute('data-theme', theme.value);
  };

  onMounted(() => {
    const saved = localStorage.getItem('theme');
    if (saved) {
      setTheme(saved);
    } else {
      setTheme('light');
    }
  });

  return { theme, toggleTheme };
}
