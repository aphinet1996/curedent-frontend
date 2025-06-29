import { defineStore } from 'pinia';
import { ref } from 'vue';

export interface AlertOptions {
  message: string;
  title?: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  icon?: string;
  duration?: number;
  id?: string;
}

export const useAlertStore = defineStore('alert', () => {
  const alerts = ref<AlertOptions[]>([]);

  function show(options: AlertOptions) {
    const id = `alert-${Date.now()}`;
    const duration = options.duration || 5000;
    
    // Add the alert to the list
    alerts.value.push({
      ...options,
      id,
      duration
    });
    
    // Set timeout to auto-close
    setTimeout(() => {
      hide(id);
    }, duration);
    
    return id;
  }
  
  function hide(id: string) {
    alerts.value = alerts.value.filter(alert => alert.id !== id);
  }
  
  function clearAll() {
    alerts.value = [];
  }
  
  // Convenience methods for different alert types
  function success(message: string, title?: string, duration?: number) {
    return show({
      message,
      title: title || 'Success',
      type: 'success',
      icon: 'mdi:check-circle',
      duration
    });
  }
  
  function error(message: string, title?: string, duration?: number) {
    return show({
      message,
      title: title || 'Error',
      type: 'error',
      icon: 'mdi:alert-circle',
      duration
    });
  }
  
  function warning(message: string, title?: string, duration?: number) {
    return show({
      message,
      title: title || 'Warning',
      type: 'warning',
      icon: 'mdi:alert',
      duration
    });
  }
  
  function info(message: string, title?: string, duration?: number) {
    return show({
      message,
      title: title || 'Info',
      type: 'info',
      icon: 'mdi:information',
      duration
    });
  }
  
  return {
    alerts,
    show,
    hide,
    clearAll,
    success,
    error,
    warning,
    info
  };
});