import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import TelemetryScreen from '../screens/TelemetryScreen';
import VehiclesScreen from '../screens/VehiclesScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

export const AppNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    if (route.name === 'Telemetría') {
                        iconName = focused ? 'car' : 'car-outline';
                    } else if (route.name === 'Vehículos') {
                        iconName = focused ? 'bus' : 'bus-outline';
                    } else if (route.name === 'Perfil') {
                        iconName = focused ? 'person' : 'person-outline';
                    }
                    return <Ionicons name={iconName as any} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#3b82f6',
                tabBarInactiveTintColor: 'gray',
            })}
        >
            <Tab.Screen name="Telemetría" component={TelemetryScreen} />
            <Tab.Screen name="Vehículos" component={VehiclesScreen} />
            <Tab.Screen name="Perfil" component={ProfileScreen} />
        </Tab.Navigator>
    );
};