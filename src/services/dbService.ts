import * as SQLite from 'expo-sqlite';
import { openDatabase } from '../db/initDb';
import type { Vehicle, TelemetryQueueItem } from '../types';

// Tipos para las filas de la base de datos
interface VehicleRow {
    id: string;
    plate: string;
    alias: string;
    isActive: number; // 0 o 1
    createdAtUtc: string;
}

interface TelemetryQueueRow {
    id: number;
    vehicleId: string;
    latitude: number;
    longitude: number;
    speedKph: number;
    capturedAtUtc: string;
    status: string;
    retryCount: number;
}

// -------- Vehicles --------
export const insertVehicle = async (vehicle: Vehicle): Promise<void> => {
    const db = await openDatabase();
    await db.runAsync(
        `INSERT INTO vehicles (id, plate, alias, isActive, createdAtUtc) VALUES (?, ?, ?, ?, ?)`,
        vehicle.id,
        vehicle.plate,
        vehicle.alias,
        vehicle.isActive ? 1 : 0,
        vehicle.createdAtUtc
    );
};

export const getVehicles = async (): Promise<Vehicle[]> => {
    const db = await openDatabase();
    const rows = await db.getAllAsync<VehicleRow>(
        `SELECT id, plate, alias, isActive, createdAtUtc FROM vehicles ORDER BY createdAtUtc DESC`
    );
    return rows.map(row => ({
        id: row.id,
        plate: row.plate,
        alias: row.alias,
        isActive: row.isActive === 1,
        createdAtUtc: row.createdAtUtc,
    }));
};

export const setActiveVehicle = async (vehicleId: string): Promise<void> => {
    const db = await openDatabase();
    await db.runAsync(`UPDATE vehicles SET isActive = 0`);
    await db.runAsync(`UPDATE vehicles SET isActive = 1 WHERE id = ?`, vehicleId);
};

export const getActiveVehicle = async (): Promise<Vehicle | null> => {
    const db = await openDatabase();
    const row = await db.getFirstAsync<VehicleRow>(
        `SELECT id, plate, alias, isActive, createdAtUtc FROM vehicles WHERE isActive = 1`
    );
    if (!row) return null;
    return {
        id: row.id,
        plate: row.plate,
        alias: row.alias,
        isActive: row.isActive === 1,
        createdAtUtc: row.createdAtUtc,
    };
};

// -------- Telemetry Queue --------
export const insertTelemetryQueue = async (item: Omit<TelemetryQueueItem, 'id'>): Promise<number> => {
    const db = await openDatabase();
    const result = await db.runAsync(
        `INSERT INTO telemetry_queue (vehicleId, latitude, longitude, speedKph, capturedAtUtc, status, retryCount)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
        item.vehicleId,
        item.latitude,
        item.longitude,
        item.speedKph,
        item.capturedAtUtc,
        item.status,
        item.retryCount
    );
    return result.lastInsertRowId;
};

export const getPendingTelemetry = async (): Promise<TelemetryQueueItem[]> => {
    const db = await openDatabase();
    const rows = await db.getAllAsync<TelemetryQueueRow>(
        `SELECT * FROM telemetry_queue WHERE status = 'pending' ORDER BY id ASC`
    );
    return rows.map(row => ({
        id: row.id,
        vehicleId: row.vehicleId,
        latitude: row.latitude,
        longitude: row.longitude,
        speedKph: row.speedKph,
        capturedAtUtc: row.capturedAtUtc,
        status: row.status as 'pending' | 'synced' | 'failed',
        retryCount: row.retryCount,
    }));
};

export const updateTelemetryStatus = async (
    id: number,
    status: 'pending' | 'synced' | 'failed',
    retryCount?: number
): Promise<void> => {
    const db = await openDatabase();
    if (retryCount !== undefined) {
        await db.runAsync(`UPDATE telemetry_queue SET status = ?, retryCount = ? WHERE id = ?`, status, retryCount, id);
    } else {
        await db.runAsync(`UPDATE telemetry_queue SET status = ? WHERE id = ?`, status, id);
    }
};

export const deleteSyncedTelemetry = async (): Promise<void> => {
    const db = await openDatabase();
    await db.runAsync(`DELETE FROM telemetry_queue WHERE status = 'synced'`);
};