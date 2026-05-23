import { API_BASE_URL } from '../utils/constants';
import { getPendingTelemetry, updateTelemetryStatus, deleteSyncedTelemetry } from './dbService';

export const syncPendingTelemetry = async (): Promise<void> => {
    const pendingItems = await getPendingTelemetry();
    if (pendingItems.length === 0) return;

    console.log(`[Sync] Enviando ${pendingItems.length} telemetrías pendientes`);

    for (const item of pendingItems) {
        try {
            const response = await fetch(`${API_BASE_URL}/api/v1/telemetry`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    vehicleId: item.vehicleId,
                    externalEventId: `mobile_${item.id}_${Date.now()}`,
                    capturedAtUtc: item.capturedAtUtc,
                    latitude: item.latitude,
                    longitude: item.longitude,
                    speedKph: item.speedKph,
                    ignitionOn: item.speedKph > 0,
                }),
            });
            if (response.ok) {
                await updateTelemetryStatus(item.id!, 'synced');
                console.log(`[Sync] Telemetría ${item.id} enviada con éxito`);
            } else {
                const errorText = await response.text();
                console.error(`[Sync] Error ${response.status}: ${errorText}`);
                const newRetryCount = (item.retryCount || 0) + 1;
                if (newRetryCount >= 5) {
                    await updateTelemetryStatus(item.id!, 'failed', newRetryCount);
                } else {
                    // Mantener como pending pero incrementar reintentos
                    await updateTelemetryStatus(item.id!, 'pending', newRetryCount);
                }
            }
        } catch (error) {
            console.error(`[Sync] Error de red al enviar telemetría ${item.id}:`, error);
            const newRetryCount = (item.retryCount || 0) + 1;
            if (newRetryCount >= 5) {
                await updateTelemetryStatus(item.id!, 'failed', newRetryCount);
            } else {
                await updateTelemetryStatus(item.id!, 'pending', newRetryCount);
            }
        }
    }

    // Limpiar registros synced
    await deleteSyncedTelemetry();
};