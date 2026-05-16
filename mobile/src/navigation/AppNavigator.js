import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS } from '../utils/constants';

// Auth
import SplashScreen from '../screens/Auth/SplashScreen';
import OnboardingScreen from '../screens/Auth/OnboardingScreen';
import LoginScreen from '../screens/Auth/LoginScreen';
import OTPVerifyScreen from '../screens/Auth/OTPVerifyScreen';
import ProfileSetupScreen from '../screens/Auth/ProfileSetupScreen';

// Home
import HomeScreen from '../screens/Home/HomeScreen';
import ProblemSelectScreen from '../screens/Home/ProblemSelectScreen';
import WellnessFeedScreen from '../screens/Home/WellnessFeedScreen';
import NotificationsScreen from '../screens/Home/NotificationsScreen';
import EmergencyScreen from '../screens/Home/EmergencyScreen';

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
import NutritionTrackerScreen from '../screens/Progress/NutritionTrackerScreen';
import SleepTrackerScreen from '../screens/Progress/SleepTrackerScreen';

// Profile
import ProfileScreen from '../screens/Profile/ProfileScreen';
import HealthVaultScreen from '../screens/Profile/HealthVaultScreen';
import PrivacySettingsScreen from '../screens/Profile/PrivacySettingsScreen';
import DeleteAccountScreen from '../screens/Profile/DeleteAccountScreen';
import SubscriptionManageScreen from '../screens/Profile/SubscriptionManageScreen';
import LabReportsScreen from '../screens/Profile/LabReportsScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const TAB_CONFIG = {
  Home:     { icon: 'home',         iconOutline: 'home-outline',         label: 'Home' },
  AI:       { icon: 'sparkles',     iconOutline: 'sparkles-outline',     label: 'AI Chat' },
  Doctor:   { icon: 'medkit',       iconOutline: 'medkit-outline',       label: 'Doctors' },
  Progress: { icon: 'bar-chart',    iconOutline: 'bar-chart-outline',    label: 'Progress' },
  Profile:  { icon: 'person-circle',iconOutline: 'person-circle-outline',label: 'Profile' },
};

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color }) => {
          const cfg = TAB_CONFIG[route.name];
          const iconName = focused ? cfg.icon : cfg.iconOutline;
          return (
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              {focused ? (
                <LinearGradient colors={['#D4A017', '#B8860B']} style={{ borderRadius: 10, padding: 6 }}>
                  <Ionicons name={iconName} size={20} color="#FFFFFF" />
                </LinearGradient>
              ) : (
                <Ionicons name={iconName} size={22} color={color} />
              )}
            </View>
          );
        },
        tabBarLabel: ({ focused, color }) => (
          <Text style={{
            fontFamily: focused ? FONTS.semiBold : FONTS.regular,
            fontSize: 10, color,
            marginBottom: 2,
          }}>
            {TAB_CONFIG[route.name].label}
          </Text>
        ),
        tabBarActiveTintColor: '#D4A017',
        tabBarInactiveTintColor: '#9CA3AF',
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1, borderTopColor: '#E5E7EB',
          height: 68, paddingBottom: 10, paddingTop: 6,
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="AI" component={SymptomChatScreen} initialParams={{ concern: null }} />
      <Tab.Screen name="Doctor" component={DoctorListScreen} />
      <Tab.Screen name="Progress" component={DashboardScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
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

        {/* Home extras */}
        <Stack.Screen name="ProblemSelect" component={ProblemSelectScreen} />
        <Stack.Screen name="WellnessFeed" component={WellnessFeedScreen} />
        <Stack.Screen name="Notifications" component={NotificationsScreen} />
        <Stack.Screen name="Emergency" component={EmergencyScreen} />

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
        <Stack.Screen name="NutritionTracker" component={NutritionTrackerScreen} />
        <Stack.Screen name="SleepTracker" component={SleepTrackerScreen} />

        {/* Profile */}
        <Stack.Screen name="HealthVault" component={HealthVaultScreen} />
        <Stack.Screen name="LabReports" component={LabReportsScreen} />
        <Stack.Screen name="PrivacySettings" component={PrivacySettingsScreen} />
        <Stack.Screen name="DeleteAccount" component={DeleteAccountScreen} />
        <Stack.Screen name="SubscriptionManage" component={SubscriptionManageScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
