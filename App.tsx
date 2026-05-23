import { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { initDatabase } from './src/db/initDb';
import { AppNavigator } from './src/navigation/AppNavigator';
import { useVehicleStore } from './src/stores/vehicleStore';
import { useTelemetryStore } from './src/stores/telemetryStore';

export default function App() {
  const loadVehicles = useVehicleStore(state => state.loadVehicles);
  const loadPendingCount = useTelemetryStore(state => state.loadPendingCount);
  const syncNow = useTelemetryStore(state => state.syncNow);

  useEffect(() => {
    initDatabase().catch(console.error);
    loadVehicles();
    loadPendingCount();
    const interval = setInterval(() => {
      syncNow();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}