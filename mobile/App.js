import 'react-native-gesture-handler';
import React from 'react';
import { View, ActivityIndicator, Text, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) {
    return { error: error.toString() };
  }
  componentDidCatch(error, info) {
    console.error('APP CRASH:', error, info.componentStack);
  }
  render() {
    if (this.state.error) {
      return (
        <ScrollView style={{ flex: 1, backgroundColor: '#fff', padding: 20, marginTop: 50 }}>
          <Text style={{ color: 'red', fontSize: 16, fontWeight: 'bold', marginBottom: 10 }}>App Error — Show this to developer:</Text>
          <Text style={{ color: '#333', fontSize: 12, fontFamily: 'monospace' }}>{this.state.error}</Text>
        </ScrollView>
      );
    }
    return this.props.children;
  }
}
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF' }}>
        <ActivityIndicator size="large" color="#D4A017" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="dark" />
      <AppNavigator />
    </GestureHandlerRootView>
  );
}
