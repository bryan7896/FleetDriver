export interface Vehicle {
    id: string;
    plate: string;
    alias: string;
    isActive: boolean;
    createdAtUtc: string;
}

export interface TelemetryQueueItem {
    id?: number;
    vehicleId: string;
    latitude: number;
    longitude: number;
    speedKph: number;
    capturedAtUtc: string;
    status: 'pending' | 'synced' | 'failed';
    retryCount: number;
}