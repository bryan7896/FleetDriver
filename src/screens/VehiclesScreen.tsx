import { View, Text, StyleSheet } from 'react-native';

export default function VehiclesScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Mis Vehículos</Text>
            <Text style={styles.subtitle}>Lista de vehículos registrados</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
    subtitle: { fontSize: 16, color: 'gray' },
});