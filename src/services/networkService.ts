import NetInfo from '@react-native-community/netinfo';
import { syncPendingTelemetry } from './syncService';

let syncing = false;

export const startNetworkListener = () => {
    NetInfo.addEventListener(async state => {
        const isConnected = state.isConnected && state.isInternetReachable;

        console.log('[Network]', isConnected ? 'ONLINE' : 'OFFLINE');

        if (isConnected && !syncing) {
            try {
                syncing = true;
                await syncPendingTelemetry();
            } finally {
                syncing = false;
            }
        }
    });
};