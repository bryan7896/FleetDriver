import { create } from 'zustand';
import { getVehicles, insertVehicle, setActiveVehicle, getActiveVehicle } from '../services/dbService';
import type { Vehicle } from '../types';

interface VehicleState {
    vehicles: Vehicle[];
    activeVehicle: Vehicle | null;
    loading: boolean;
    loadVehicles: () => Promise<void>;
    addVehicle: (vehicle: Vehicle) => Promise<void>;
    setActive: (vehicleId: string) => Promise<void>;
}

export const useVehicleStore = create<VehicleState>((set, get) => ({
    vehicles: [],
    activeVehicle: null,
    loading: false,

    loadVehicles: async () => {
        set({ loading: true });
        try {
            const vehicles = await getVehicles();
            const active = await getActiveVehicle();

            console.log("Loaded vehicles:", vehicles);
            console.log("Active vehicle:", active);
            set({ vehicles, activeVehicle: active, loading: false });
        } catch (error) {
            console.error('Error loading vehicles:', error);
            set({ loading: false });
        }
    },

    addVehicle: async (vehicle: Vehicle) => {
        try {
            await insertVehicle(vehicle);
            // Si es el primer vehículo, marcarlo como activo
            const currentVehicles = get().vehicles;
            if (currentVehicles.length === 0) {
                await setActiveVehicle(vehicle.id);
            }
            await get().loadVehicles();
        } catch (error) {
            console.error('Error adding vehicle:', error);
        }
    },

    setActive: async (vehicleId: string) => {
        try {
            await setActiveVehicle(vehicleId);
            await get().loadVehicles();
        } catch (error) {
            console.error('Error setting active vehicle:', error);
        }
    },
}));