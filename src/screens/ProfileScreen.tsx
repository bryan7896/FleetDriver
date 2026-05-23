import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function ProfileScreen() {

    return (
        <ScrollView style={styles.container}>
            {/* Header con foto de perfil */}
            <View style={styles.header}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>OP</Text>
                </View>
                <Text style={styles.name}>Operador de Flota</Text>
                <Text style={styles.role}>Administrador</Text>
            </View>

            {/* Información de contacto */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Información de Contacto</Text>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Nombre</Text>
                    <Text style={styles.infoValue}>Bryan Sandoval</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Teléfono</Text>
                    <Text style={styles.infoValue}>310 801 2566</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Email</Text>
                    <Text style={styles.infoValue}>bryansandoval16@hotmail.com</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Rol</Text>
                    <Text style={styles.infoValue}>Supervisor de Flota</Text>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f3f4f6',
    },
    header: {
        backgroundColor: '#1e1e2f',
        alignItems: 'center',
        paddingVertical: 30,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#3b82f6',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    avatarText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    name: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 4,
    },
    role: {
        fontSize: 14,
        color: '#9ca3af',
    },
    section: {
        backgroundColor: '#ffffff',
        marginHorizontal: 16,
        marginTop: 16,
        padding: 16,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1f2937',
        marginBottom: 16,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },
    infoLabel: {
        fontSize: 14,
        color: '#6b7280',
    },
    infoValue: {
        fontSize: 14,
        fontWeight: '500',
        color: '#1f2937',
    },
    switchRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },
    switchLabel: {
        fontSize: 16,
        color: '#1f2937',
    },
    button: {
        backgroundColor: '#3b82f6',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 12,
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
    },
    buttonSecondary: {
        backgroundColor: '#e5e7eb',
    },
    buttonSecondaryText: {
        color: '#4b5563',
        fontSize: 16,
        fontWeight: '600',
    },
    storageInfo: {
        fontSize: 12,
        color: '#9ca3af',
        textAlign: 'center',
        marginTop: 12,
    },
    versionContainer: {
        alignItems: 'center',
        paddingVertical: 24,
    },
    versionText: {
        fontSize: 12,
        color: '#9ca3af',
    },
});