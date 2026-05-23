import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import { useVehicleStore } from '../stores/vehicleStore';
import { API_BASE_URL } from '../utils/constants';

export default function VehiclesScreen() {
    const { vehicles, activeVehicle, loadVehicles, addVehicle, setActive } = useVehicleStore();
    const [plate, setPlate] = useState('');
    const [alias, setAlias] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadVehicles();
    }, []);

    const handleCreateVehicle = async () => {
        if (!plate.trim() || !alias.trim()) {
            Alert.alert('Error', 'Placa y alias son requeridos');
            return;
        }
        setLoading(true);
        try {
            console.log("---v---", `${API_BASE_URL}/vehicles`)
            const response = await fetch(`${API_BASE_URL}/vehicles`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ plate: plate.toUpperCase(), alias }),
            });
            const data = await response.json();
            if (response.ok) {
                await addVehicle({
                    id: data.id,
                    plate: data.plate,
                    alias: data.alias,
                    isActive: vehicles.length === 0, // primer vehículo activo
                    createdAtUtc: data.createdAtUtc,
                });
                setPlate('');
                setAlias('');
                Alert.alert('Éxito', 'Vehículo creado');
            } else {
                Alert.alert('Error', data.message || 'No se pudo crear el vehículo');
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Error de red');
        } finally {
            setLoading(false);
        }
    };

    const renderItem = ({ item }: { item: any }) => (
        <View style={styles.vehicleItem}>
            <View style={styles.vehicleInfo}>
                <Text style={styles.plate}>{item.plate}</Text>
                <Text style={styles.alias}>{item.alias}</Text>
                {activeVehicle?.id === item.id && <Text style={styles.activeBadge}>Activo</Text>}
            </View>
            <TouchableOpacity
                style={styles.selectButton}
                onPress={() => setActive(item.id)}
                disabled={activeVehicle?.id === item.id}
            >
                <Text style={styles.selectButtonText}>
                    {activeVehicle?.id === item.id ? 'Seleccionado' : 'Seleccionar'}
                </Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.form}>
                <Text style={styles.sectionTitle}>Registrar nuevo vehículo</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Placa (ej: ABC123)"
                    value={plate}
                    onChangeText={setPlate}
                    autoCapitalize="characters"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Alias (ej: Camión Norte)"
                    value={alias}
                    onChangeText={setAlias}
                />
                <TouchableOpacity style={styles.createButton} onPress={handleCreateVehicle} disabled={loading}>
                    {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.createButtonText}>Crear Vehículo</Text>}
                </TouchableOpacity>
            </View>
            <View style={styles.list}>
                <Text style={styles.sectionTitle}>Mis vehículos</Text>
                {vehicles.length === 0 ? (
                    <Text style={styles.emptyText}>No hay vehículos registrados</Text>
                ) : (
                    <FlatList
                        data={vehicles}
                        keyExtractor={(item) => item.id}
                        renderItem={renderItem}
                    />
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: '#f5f5f5' },
    form: { backgroundColor: '#fff', borderRadius: 8, padding: 16, marginBottom: 16 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
    input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 10, marginBottom: 12 },
    createButton: { backgroundColor: '#3b82f6', padding: 12, borderRadius: 8, alignItems: 'center' },
    createButtonText: { color: '#fff', fontWeight: 'bold' },
    list: { flex: 1, backgroundColor: '#fff', borderRadius: 8, padding: 16 },
    emptyText: { textAlign: 'center', color: '#999', marginTop: 20 },
    vehicleItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#eee' },
    vehicleInfo: { flex: 1 },
    plate: { fontSize: 16, fontWeight: 'bold' },
    alias: { fontSize: 14, color: '#666' },
    activeBadge: { backgroundColor: '#22c55e', color: '#fff', fontSize: 12, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, alignSelf: 'flex-start', marginTop: 4 },
    selectButton: { backgroundColor: '#3b82f6', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
    selectButtonText: { color: '#fff', fontSize: 12 },
});