import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated, StatusBar } from 'react-native';
import useAppStore from '../../store/useAppStore';
import { COLORS } from '../../utils/constants';

export default function SplashScreen({ navigation }) {
  const loadAuth = useAppStore((s) => s.loadAuth);
  const isAuthenticated = useAppStore((s) => s.isAuthenticated);
  const pulse = new Animated.Value(0.8);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0.8, duration: 800, useNativeDriver: true }),
      ])
    ).start();

    const init = async () => {
      await loadAuth();
      setTimeout(() => {
        if (isAuthenticated) {
          navigation.replace('MainTabs');
        } else {
          navigation.replace('Onboarding');
        }
      }, 2000);
    };
    init();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
      <Animated.View style={[styles.logoContainer, { transform: [{ scale: pulse }] }]}>
        <Text style={styles.logo}>🏥</Text>
        <Text style={styles.appName}>Health AI India</Text>
        <Text style={styles.tagline}>आपकी सेहत, हमारी जिम्मेदारी</Text>
      </Animated.View>
      <Text style={styles.footer}>Private • Secure • Hindi-first</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: { alignItems: 'center' },
  logo: { fontSize: 72, marginBottom: 16 },
  appName: { fontSize: 28, fontWeight: 'bold', color: COLORS.white, letterSpacing: 1 },
  tagline: { fontSize: 16, color: '#B3D4FF', marginTop: 8 },
  footer: { position: 'absolute', bottom: 40, color: '#B3D4FF', fontSize: 13 },
});
