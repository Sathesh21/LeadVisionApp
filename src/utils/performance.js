import { InteractionManager } from 'react-native';

// Debounce function for performance optimization
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Throttle function for limiting function calls
export const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Run after interactions for better performance
export const runAfterInteractions = (callback) => {
  return InteractionManager.runAfterInteractions(callback);
};

// Memory optimization for large lists
export const getItemLayout = (data, index, itemHeight = 80) => ({
  length: itemHeight,
  offset: itemHeight * index,
  index,
});

// Image optimization
export const optimizeImageOptions = {
  quality: 0.8,
  maxWidth: 1024,
  maxHeight: 1024,
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
};

// Cleanup function for intervals and timeouts
export const createCleanupManager = () => {
  const intervals = new Set();
  const timeouts = new Set();
  
  const addInterval = (id) => intervals.add(id);
  const addTimeout = (id) => timeouts.add(id);
  
  const cleanup = () => {
    intervals.forEach(clearInterval);
    timeouts.forEach(clearTimeout);
    intervals.clear();
    timeouts.clear();
  };
  
  return { addInterval, addTimeout, cleanup };
};

// Batch updates for better performance
export const batchUpdates = (updates) => {
  return new Promise((resolve) => {
    InteractionManager.runAfterInteractions(() => {
      updates.forEach(update => update());
      resolve();
    });
  });
};

export default {
  debounce,
  throttle,
  runAfterInteractions,
  getItemLayout,
  optimizeImageOptions,
  createCleanupManager,
  batchUpdates,
};