// mobile/src/navigation/AppNavigator.js
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { COLORS } from '../constants/theme';
import useAuth from '../hooks/useAuth';

import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import EventListScreen from '../screens/events/EventListScreen';
import EventDetailScreen from '../screens/events/EventDetailScreen';
import BookingScreen from '../screens/booking/BookingScreen';
import PaymentScreen from '../screens/booking/PaymentScreen';
import MyTicketsScreen from '../screens/tickets/MyTicketsScreen';
import TicketDetailScreen from '../screens/tickets/TicketDetailScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';

const AuthStack = createNativeStackNavigator();
const EventsStack = createNativeStackNavigator();
const TicketsStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Écrans affichés quand l'utilisateur N'est PAS connecté
function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
    </AuthStack.Navigator>
  );
}

// Onglet 1 : parcours de réservation
function EventsNavigator() {
  return (
    <EventsStack.Navigator>
      <EventsStack.Screen name="EventList" component={EventListScreen} options={{ title: 'Événements' }} />
      <EventsStack.Screen name="EventDetail" component={EventDetailScreen} options={{ title: 'Détail' }} />
      <EventsStack.Screen name="Booking" component={BookingScreen} options={{ title: 'Réservation' }} />
      <EventsStack.Screen
        name="Payment"
        component={PaymentScreen}
        options={{ title: 'Paiement', headerBackVisible: false, gestureEnabled: false }}
      />
    </EventsStack.Navigator>
  );
}

// Onglet 2 : billets
function TicketsNavigator() {
  return (
    <TicketsStack.Navigator>
      <TicketsStack.Screen name="MyTickets" component={MyTicketsScreen} options={{ title: 'Mes billets' }} />
      <TicketsStack.Screen name="TicketDetail" component={TicketDetailScreen} options={{ title: 'Billet' }} />
    </TicketsStack.Navigator>
  );
}

const TAB_ICONS = {
  EventsTab: 'calendar',
  TicketsTab: 'ticket',
  ProfileTab: 'person',
};

// Écrans affichés quand l'utilisateur EST connecté : barre d'onglets en bas
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarIcon: ({ color, size }) => <Ionicons name={TAB_ICONS[route.name]} size={size} color={color} />,
      })}
    >
      <Tab.Screen name="EventsTab" component={EventsNavigator} options={{ title: 'Événements' }} />
      <Tab.Screen name="TicketsTab" component={TicketsNavigator} options={{ title: 'Billets' }} />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{ title: 'Profil', headerShown: true }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return <NavigationContainer>{user ? <MainTabs /> : <AuthNavigator />}</NavigationContainer>;
}
