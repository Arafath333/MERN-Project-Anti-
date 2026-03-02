import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { useSelector } from 'react-redux'
import { Text, View } from 'react-native'
import { COLORS } from '../constants/theme'

// Screens
import HomeScreen from '../screens/HomeScreen'
import ProductsScreen from '../screens/ProductsScreen'
import ProductDetailScreen from '../screens/ProductDetailScreen'
import CartScreen from '../screens/CartScreen'
import LoginScreen from '../screens/LoginScreen'
import RegisterScreen from '../screens/RegisterScreen'
import ProfileScreen from '../screens/ProfileScreen'
import OrderHistoryScreen from '../screens/OrderHistoryScreen'

const Tab = createBottomTabNavigator()
const Stack = createNativeStackNavigator()

const TabIcon = ({ name, focused }) => (
    <Text style={{ fontSize: 22, opacity: focused ? 1 : 0.5 }}>
        {name === 'Home' ? '🏠' : name === 'Products' ? '🛍️' : name === 'Cart' ? '🛒' : name === 'Profile' ? '👤' : '📦'}
    </Text>
)

function TabNavigator() {
    const { cartItems } = useSelector((s) => s.cart)
    const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0)

    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: COLORS.bgCard,
                    borderTopColor: COLORS.border,
                    borderTopWidth: 1,
                    paddingBottom: 8,
                    paddingTop: 8,
                    height: 64,
                },
                tabBarActiveTintColor: COLORS.primary,
                tabBarInactiveTintColor: COLORS.textMuted,
                tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
            }}
        >
            <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarIcon: ({ focused }) => <TabIcon name="Home" focused={focused} /> }} />
            <Tab.Screen name="Products" component={ProductsScreen} options={{ tabBarIcon: ({ focused }) => <TabIcon name="Products" focused={focused} /> }} />
            <Tab.Screen name="Cart" component={CartScreen} options={{
                tabBarIcon: ({ focused }) => <TabIcon name="Cart" focused={focused} />,
                tabBarBadge: cartCount > 0 ? cartCount : undefined,
                tabBarBadgeStyle: { backgroundColor: COLORS.primary, color: '#fff', fontSize: 10, fontWeight: '700' },
            }} />
            <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarIcon: ({ focused }) => <TabIcon name="Profile" focused={focused} /> }} />
        </Tab.Navigator>
    )
}

export default function AppNavigator() {
    return (
        <NavigationContainer theme={{ dark: true, colors: { primary: COLORS.primary, background: COLORS.bg, card: COLORS.bgCard, text: COLORS.text, border: COLORS.border, notification: COLORS.primary } }}>
            <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
                <Stack.Screen name="Main" component={TabNavigator} />
                <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Register" component={RegisterScreen} />
                <Stack.Screen name="OrderHistory" component={OrderHistoryScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}
