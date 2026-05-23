import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    ScrollView,
} from 'react-native';
import * as Location from 'expo-location';
import { useVehicleStore } from '../stores/vehicleStore';
import { useTelemetryStore } from '../stores/telemetryStore';

export default function TelemetryScreen() {
    const { activeVehicle } = useVehicleStore();
    const { pendingCount, addTelemetry, syncNow } = useTelemetryStore();

    // Estados del formulario
    const [speed, setSpeed] = useState('60');
    const [latitude, setLatitude] = useState('4.711');
    const [longitude, setLongitude] = useState('-74.0721');
    const [sending, setSending] = useState(false);
    const [gettingLocation, setGettingLocation] = useState(false);

    // Actualizar contador pendiente al montar y al sincronizar
    useEffect(() => {
        syncNow();
    }, []);

    // Obtener ubicación actual del dispositivo
    const getCurrentLocation = async () => {
        setGettingLocation(true);
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permiso denegado', 'No podemos acceder a tu ubicación.');
                return;
            }
            const location = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.High,
            });
            const { latitude: lat, longitude: lng } = location.coords;
            setLatitude(lat.toFixed(6));
            setLongitude(lng.toFixed(6));
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'No se pudo obtener la ubicación actual.');
        } finally {
            setGettingLocation(false);
        }
    };

    // Validar y enviar telemetría
    const handleSendTelemetry = async () => {
        if (!activeVehicle) {
            Alert.alert('Sin vehículo activo', 'Registra y selecciona un vehículo primero');
            return;
        }

        const speedNum = parseInt(speed, 10);
        if (isNaN(speedNum) || speedNum < 0) {
            Alert.alert('Error', 'Velocidad inválida');
            return;
        }

        const latNum = parseFloat(latitude);
        const lngNum = parseFloat(longitude);
        if (isNaN(latNum) || isNaN(lngNum)) {
            Alert.alert('Error', 'Coordenadas inválidas');
            return;
        }

        setSending(true);
        try {
            await addTelemetry(activeVehicle.id, latNum, lngNum, speedNum);
            await syncNow();
        } catch (error: any) {
            Alert.alert('Error', `No se pudo guardar: ${error?.message || 'Error desconocido'}`);
        } finally {
            setSending(false);
        }
    };

    if (!activeVehicle) {
        return (
            <View style={styles.container}>
                <Text style={styles.warning}>No hay vehículo activo. Ve a la pestaña "Vehículos" y selecciona uno.</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.label}>Vehículo activo</Text>
                <Text style={styles.vehicle}>{activeVehicle.plate} - {activeVehicle.alias}</Text>
            </View>

            <View style={styles.card}>
                <Text style={styles.label}>Ubicación</Text>
                <View style={styles.coordRow}>
                    <View style={styles.coordField}>
                        <Text style={styles.coordLabel}>Latitud</Text>
                        <TextInput
                            style={styles.input}
                            value={latitude}
                            onChangeText={setLatitude}
                            keyboardType="numeric"
                            placeholder="Ej: 4.711"
                        />
                    </View>
                    <View style={styles.coordField}>
                        <Text style={styles.coordLabel}>Longitud</Text>
                        <TextInput
                            style={styles.input}
                            value={longitude}
                            onChangeText={setLongitude}
                            keyboardType="numeric"
                            placeholder="Ej: -74.0721"
                        />
                    </View>
                </View>
                <TouchableOpacity
                    style={styles.gpsButton}
                    onPress={getCurrentLocation}
                    disabled={gettingLocation}
                >
                    {gettingLocation ? (
                        <ActivityIndicator size="small" color="#3b82f6" />
                    ) : (
                        <Text style={styles.gpsButtonText}>📍 Usar mi ubicación actual</Text>
                    )}
                </TouchableOpacity>
            </View>

            <View style={styles.card}>
                <Text style={styles.label}>Velocidad (km/h)</Text>
                <TextInput
                    style={styles.input}
                    value={speed}
                    onChangeText={setSpeed}
                    keyboardType="numeric"
                    placeholder="Ej: 60"
                />
            </View>

            <TouchableOpacity style={styles.sendButton} onPress={handleSendTelemetry} disabled={sending}>
                {sending ? <ActivityIndicator color="#fff" /> : <Text style={styles.sendButtonText}>Enviar telemetría</Text>}
            </TouchableOpacity>

            <View style={styles.pendingCard}>
                <Text style={styles.pendingText}>Pendientes de envío: {pendingCount}</Text>
                <TouchableOpacity onPress={syncNow} style={styles.syncButton}>
                    <Text style={styles.syncButtonText}>Sincronizar ahora</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: '#f5f5f5' },
    card: { backgroundColor: '#fff', borderRadius: 8, padding: 16, marginBottom: 16 },
    label: { fontSize: 14, fontWeight: 'bold', marginBottom: 8, color: '#333' },
    vehicle: { fontSize: 18, fontWeight: 'bold', color: '#3b82f6' },
    coordRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
    coordField: { flex: 1, marginHorizontal: 4 },
    coordLabel: { fontSize: 12, color: '#666', marginBottom: 4 },
    input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 10, marginBottom: 12 },
    gpsButton: {
        backgroundColor: '#e6f0ff',
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 4,
    },
    gpsButtonText: { color: '#3b82f6', fontWeight: 'bold' },
    sendButton: { backgroundColor: '#22c55e', padding: 16, borderRadius: 8, alignItems: 'center', marginBottom: 16 },
    sendButtonText: { color: '#fff', fontWeight: 'bold' },
    pendingCard: { backgroundColor: '#fff', borderRadius: 8, padding: 16, alignItems: 'center', marginBottom: 20 },
    pendingText: { fontSize: 16, marginBottom: 8 },
    syncButton: { backgroundColor: '#3b82f6', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
    syncButtonText: { color: '#fff' },
    warning: { textAlign: 'center', marginTop: 20, color: '#ef4444' },
});