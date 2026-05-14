import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { COLORS } from '../utils/constants';

// Auth
import SplashScreen from '../screens/Auth/SplashScreen';
import OnboardingScreen from '../screens/Auth/OnboardingScreen';
import LoginScreen from '../screens/Auth/LoginScreen';
import OTPVerifyScreen from '../screens/Auth/OTPVerifyScreen';
import ProfileSetupScreen from '../screens/Auth/ProfileSetupScreen';

// Home
import HomeScreen from '../screens/Home/HomeScreen';
import ProblemSelectScreen from '../screens/Home/ProblemSelectScreen';

// AI
import SymptomChatScreen from '../screens/AI/SymptomChatScreen';
import RootCauseScreen from '../screens/AI/RootCauseScreen';

// Subscription
import PlansScreen from '../screens/Subscription/PlansScreen';
import PaymentScreen from '../screens/Subscription/PaymentScreen';

// Doctor
import DoctorListScreen from '../screens/Doctor/DoctorListScreen';
import DoctorProfileScreen from '../screens/Doctor/DoctorProfileScreen';
import BookAppointmentScreen from '../screens/Doctor/BookAppointmentScreen';
import VideoConsultScreen from '../screens/Doctor/VideoConsultScreen';
import PrescriptionViewerScreen from '../screens/Doctor/PrescriptionViewerScreen';

// Progress
import DashboardScreen from '../screens/Progress/DashboardScreen';
import MedicationTrackerScreen from '../screens/Progress/MedicationTrackerScreen';
import WeeklyCheckInScreen from '../screens/Progress/WeeklyCheckInScreen';
import MilestoneScreen from '../screens/Progress/MilestoneScreen';

// Profile
import ProfileScreen from '../screens/Profile/ProfileScreen';
import HealthVaultScreen from '../screens/Profile/HealthVaultScreen';
import PrivacySettingsScreen from '../screens/Profile/PrivacySettingsScreen';
import DeleteAccountScreen from '../screens/Profile/DeleteAccountScreen';
import SubscriptionManageScreen from '../screens/Profile/SubscriptionManageScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function TabIcon({ name, focused }) {
  const icons = { Home: '🏠', AI: '🤖', Doctor: '👨‍⚕️', Progress: '📊', Profile: '👤' };
  return <Text style={{ fontSize: focused ? 24 : 20 }}>{icons[name]}</Text>;
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => <TabIcon name={route.name} focused={focused} />,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        headerShown: false,
        tabBarStyle: { paddingBottom: 6, height: 60 },
        tabBarLabelStyle: { fontSize: 11 },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: 'Home' }} />
      <Tab.Screen name="AI" component={SymptomChatScreen}
        options={{ tabBarLabel: 'AI Chat' }}
        initialParams={{ concern: null }}
      />
      <Tab.Screen name="Doctor" component={DoctorListScreen} options={{ tabBarLabel: 'Doctors' }} />
      <Tab.Screen name="Progress" component={DashboardScreen} options={{ tabBarLabel: 'Progress' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarLabel: 'Profile' }} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* Auth Flow */}
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="OTPVerify" component={OTPVerifyScreen} />
        <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />

        {/* Main App */}
        <Stack.Screen name="MainTabs" component={MainTabs} />

        {/* Problem Select */}
        <Stack.Screen name="ProblemSelect" component={ProblemSelectScreen} />

        {/* AI */}
        <Stack.Screen name="SymptomChat" component={SymptomChatScreen} />
        <Stack.Screen name="RootCause" component={RootCauseScreen} />

        {/* Subscription */}
        <Stack.Screen name="Plans" component={PlansScreen} />
        <Stack.Screen name="Payment" component={PaymentScreen} />

        {/* Doctor */}
        <Stack.Screen name="DoctorList" component={DoctorListScreen} />
        <Stack.Screen name="DoctorProfile" component={DoctorProfileScreen} />
        <Stack.Screen name="BookAppointment" component={BookAppointmentScreen} />
        <Stack.Screen name="VideoConsult" component={VideoConsultScreen} />
        <Stack.Screen name="PrescriptionViewer" component={PrescriptionViewerScreen} />

        {/* Progress */}
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="MedicationTracker" component={MedicationTrackerScreen} />
        <Stack.Screen name="WeeklyCheckIn" component={WeeklyCheckInScreen} />
        <Stack.Screen name="Milestone" component={MilestoneScreen} />

        {/* Profile */}
        <Stack.Screen name="HealthVault" component={HealthVaultScreen} />
        <Stack.Screen name="PrivacySettings" component={PrivacySettingsScreen} />
        <Stack.Screen name="DeleteAccount" component={DeleteAccountScreen} />
        <Stack.Screen name="SubscriptionManage" component={SubscriptionManageScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
