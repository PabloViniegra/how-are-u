import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useGlobalStore = defineStore("global", () => {
  // State
  const isLoading = ref<boolean>(false);
  const error = ref<any>(null);
  const notifications = ref<any[]>([]);

  // Getters
  const hasError = computed(() => error.value !== null);

  // Actions
  const setLoading = (value: boolean) => {
    isLoading.value = value;
  };

  const setError = (errorMessage: string) => {
    error.value = errorMessage;
    if (errorMessage) {
      console.error("Global error:", errorMessage);
    }
  };

  const clearError = () => {
    error.value = null;
  };

  const addNotification = (notification: any) => {
    const id = Date.now();
    notifications.value.push({
      id,
      type: "info",
      duration: 5000,
      ...notification,
    });

    if (notification.duration !== 0) {
      setTimeout(() => {
        removeNotification(id);
      }, notification.duration || 5000);
    }

    return id;
  };

  const removeNotification = (id: number) => {
    const index = notifications.value.findIndex((n) => n.id === id);
    if (index > -1) {
      notifications.value.splice(index, 1);
    }
  };

  const clearNotifications = () => {
    notifications.value = [];
  };

  return {
    isLoading,
    error,
    notifications,
    hasError,
    setLoading,
    setError,
    clearError,
    addNotification,
    removeNotification,
    clearNotifications,
  };
});
