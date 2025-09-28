import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useGlobalStore } from '../global-store';

describe('Global Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllTimers();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should initialize with default state', () => {
    const store = useGlobalStore();

    expect(store.isLoading).toBe(false);
    expect(store.error).toBe(null);
    expect(store.notifications).toEqual([]);
    expect(store.hasError).toBe(false);
  });

  describe('Loading State', () => {
    it('should set loading state', () => {
      const store = useGlobalStore();

      store.setLoading(true);
      expect(store.isLoading).toBe(true);

      store.setLoading(false);
      expect(store.isLoading).toBe(false);
    });
  });

  describe('Error Handling', () => {
    it('should set error state', () => {
      const store = useGlobalStore();
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      store.setError('Test error message');

      expect(store.error).toBe('Test error message');
      expect(store.hasError).toBe(true);
      expect(consoleErrorSpy).toHaveBeenCalledWith('Global error:', 'Test error message');

      consoleErrorSpy.mockRestore();
    });

    it('should clear error state', () => {
      const store = useGlobalStore();

      store.setError('Test error');
      expect(store.hasError).toBe(true);

      store.clearError();
      expect(store.error).toBe(null);
      expect(store.hasError).toBe(false);
    });

    it('should not log to console when error is cleared', () => {
      const store = useGlobalStore();
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      store.setError('');

      expect(consoleErrorSpy).not.toHaveBeenCalled();
      consoleErrorSpy.mockRestore();
    });
  });

  describe('Notifications', () => {
    it('should add notification with default values', () => {
      const store = useGlobalStore();

      const notificationId = store.addNotification({
        title: 'Test Notification',
        message: 'Test message',
      });

      expect(store.notifications).toHaveLength(1);
      expect(store.notifications[0]).toEqual({
        id: notificationId,
        title: 'Test Notification',
        message: 'Test message',
        type: 'info',
        duration: 5000,
      });
    });

    it('should add notification with custom values', () => {
      const store = useGlobalStore();

      const notificationId = store.addNotification({
        title: 'Success',
        message: 'Operation completed',
        type: 'success',
        duration: 3000,
      });

      expect(store.notifications[0]).toEqual({
        id: notificationId,
        title: 'Success',
        message: 'Operation completed',
        type: 'success',
        duration: 3000,
      });
    });

    it('should remove notification manually', () => {
      const store = useGlobalStore();

      const notificationId = store.addNotification({
        title: 'Test',
        message: 'Test',
        duration: 0, // Prevent auto-removal
      });

      expect(store.notifications).toHaveLength(1);

      store.removeNotification(notificationId);

      expect(store.notifications).toHaveLength(0);
    });

    it('should auto-remove notification after duration', () => {
      const store = useGlobalStore();

      store.addNotification({
        title: 'Auto Remove',
        message: 'This will be removed',
        duration: 1000,
      });

      expect(store.notifications).toHaveLength(1);

      vi.advanceTimersByTime(1000);

      expect(store.notifications).toHaveLength(0);
    });

    it('should not auto-remove notification with duration 0', () => {
      const store = useGlobalStore();

      store.addNotification({
        title: 'Persistent',
        message: 'This will not be removed',
        duration: 0,
      });

      expect(store.notifications).toHaveLength(1);

      vi.advanceTimersByTime(10000);

      expect(store.notifications).toHaveLength(1);
    });

    it('should clear all notifications', () => {
      const store = useGlobalStore();

      store.addNotification({ title: 'Test 1', duration: 0 });
      store.addNotification({ title: 'Test 2', duration: 0 });
      store.addNotification({ title: 'Test 3', duration: 0 });

      expect(store.notifications).toHaveLength(3);

      store.clearNotifications();

      expect(store.notifications).toHaveLength(0);
    });

    it('should handle removing non-existent notification', () => {
      const store = useGlobalStore();

      store.addNotification({ title: 'Test', duration: 0 });
      expect(store.notifications).toHaveLength(1);

      // Try to remove non-existent notification
      store.removeNotification(999999);

      expect(store.notifications).toHaveLength(1);
    });

    it('should generate unique IDs for notifications', () => {
      const store = useGlobalStore();

      const id1 = store.addNotification({ title: 'Test 1', duration: 0 });
      // Add larger delay to ensure different timestamps
      vi.advanceTimersByTime(10);
      const id2 = store.addNotification({ title: 'Test 2', duration: 0 });

      expect(id1).not.toBe(id2);
      // Verify that notifications exist and have unique IDs
      expect(store.notifications).toHaveLength(2);
      // Don't rely on exact order as timing may vary - just check both IDs are present
      const notificationIds = store.notifications.map(n => n.id);
      expect(notificationIds).toContain(id1);
      expect(notificationIds).toContain(id2);
    });
  });

  describe('Computed Properties', () => {
    it('should update hasError computed when error changes', () => {
      const store = useGlobalStore();

      expect(store.hasError).toBe(false);

      store.setError('Test error');
      expect(store.hasError).toBe(true);

      store.clearError();
      expect(store.hasError).toBe(false);
    });
  });
});