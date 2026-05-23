import { create } from 'zustand';
import { insertTelemetryQueue, getPendingTelemetry } from '../services/dbService';
import { syncPendingTelemetry } from '../services/syncService';

interface TelemetryStore {
  pendingCount: number;
  syncing: boolean;
  addTelemetry: (vehicleId: string, latitude: number, longitude: number, speedKph: number) => Promise<void>;
  syncNow: () => Promise<void>;
  loadPendingCount: () => Promise<void>;
}

export const useTelemetryStore = create<TelemetryStore>((set, get) => ({
  pendingCount: 0,
  syncing: false,

  addTelemetry: async (vehicleId, latitude, longitude, speedKph) => {
    // Guardar en cola local siempre (offline-first)
    const now = new Date().toISOString();
    await insertTelemetryQueue({
      vehicleId,
      latitude,
      longitude,
      speedKph,
      capturedAtUtc: now,
      status: 'pending',
      retryCount: 0,
    });
    // Actualizar contador
    await get().loadPendingCount();
    // Intentar sincronizar inmediatamente (si hay red)
    await get().syncNow();
  },

  syncNow: async () => {
    if (get().syncing) return;
    set({ syncing: true });
    try {
      await syncPendingTelemetry();
      await get().loadPendingCount();
    } catch (error) {
      console.error('Sync error:', error);
    } finally {
      set({ syncing: false });
    }
  },

  loadPendingCount: async () => {
    const pending = await getPendingTelemetry();
    set({ pendingCount: pending.length });
  },
}));