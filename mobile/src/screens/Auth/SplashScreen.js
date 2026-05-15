import React, { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, Animated, Dimensions, StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import useAppStore from '../../store/useAppStore';
import { COLORS, GRADIENTS, FONTS } from '../../utils/constants';

const { width, height } = Dimensions.get('window');

export default function SplashScreen({ navigation }) {
  const loadAuth = useAppStore((s) => s.loadAuth);
  const isAuthenticated = useAppStore((s) => s.isAuthenticated);

  const logoScale = useRef(new Animated.Value(0.3)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const taglineY = useRef(new Animated.Value(20)).current;
  const badgeOpacity = useRef(new Animated.Value(0)).current;
  const ring1Scale = useRef(new Animated.Value(0.5)).current;
  const ring2Scale = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    // Logo entrance
    Animated.sequence([
      Animated.parallel([
        Animated.spring(logoScale, { toValue: 1, friction: 6, tension: 80, useNativeDriver: true }),
        Animated.timing(logoOpacity, { toValue: 1, duration: 600, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(taglineOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.timing(taglineY, { toValue: 0, duration: 500, useNativeDriver: true }),
      ]),
      Animated.timing(badgeOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();

    // Pulsing rings
    Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(ring1Scale, { toValue: 1.4, duration: 1500, useNativeDriver: true }),
          Animated.timing(ring2Scale, { toValue: 1.2, duration: 1800, useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(ring1Scale, { toValue: 0.5, duration: 0, useNativeDriver: true }),
          Animated.timing(ring2Scale, { toValue: 0.5, duration: 0, useNativeDriver: true }),
        ]),
      ])
    ).start();

    const init = async () => {
      await loadAuth();
      setTimeout(() => {
        navigation.replace(isAuthenticated ? 'MainTabs' : 'Onboarding');
      }, 2800);
    };
    init();
  }, []);

  return (
    <LinearGradient colors={GRADIENTS.hero} style={styles.container} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      {/* Decorative rings */}
      <Animated.View style={[styles.ring, styles.ring1, { transform: [{ scale: ring1Scale }] }]} />
      <Animated.View style={[styles.ring, styles.ring2, { transform: [{ scale: ring2Scale }] }]} />

      {/* Logo container */}
      <Animated.View style={[styles.logoWrap, { opacity: logoOpacity, transform: [{ scale: logoScale }] }]}>
        <LinearGradient colors={['#1E3A5F', '#3B82C4']} style={styles.logoCircle}>
          <Text style={styles.logoEmoji}>âš•ï¸</Text>
        </LinearGradient>
      </Animated.View>

      {/* App name */}
      <Animated.View style={{ opacity: logoOpacity, alignItems: 'center' }}>
        <Text style={styles.appName}>Health AI India</Text>
        <View style={styles.tagRow}>
          <View style={styles.dot} />
          <Text style={styles.tagSub}>POWERED BY AI</Text>
          <View style={styles.dot} />
        </View>
      </Animated.View>

      {/* Tagline */}
      <Animated.View style={[styles.taglineWrap, { opacity: taglineOpacity, transform: [{ translateY: taglineY }] }]}>
        <Text style={styles.tagline}>à¤†à¤ªà¤•à¥€ à¤¸à¥‡à¤¹à¤¤, à¤¹à¤®à¤¾à¤°à¥€ à¤œà¤¿à¤®à¥à¤®à¥‡à¤¦à¤¾à¤°à¥€</Text>
        <Text style={styles.taglineEn}>Your Health. Our Responsibility.</Text>
      </Animated.View>

      {/* Trust badges */}
      <Animated.View style={[styles.badgeRow, { opacity: badgeOpacity }]}>
        {['10M+ Users', 'NABH Certified', 'Made in India ðŸ‡®ðŸ‡³'].map((b, i) => (
          <View key={i} style={styles.badge}>
            <Text style={styles.badgeText}>{b}</Text>
          </View>
        ))}
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  ring: {
    position: 'absolute',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,92,0,0.15)',
  },
  ring1: { width: 320, height: 320 },
  ring2: { width: 500, height: 500, borderColor: 'rgba(255,255,255,0.05)' },
  logoWrap: { marginBottom: 24 },
  logoCircle: {
    width: 100, height: 100, borderRadius: 30,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#1E3A5F', shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.5, shadowRadius: 24, elevation: 16,
  },
  logoEmoji: { fontSize: 48 },
  appName: {
    fontFamily: FONTS.bold, fontSize: 34, color: '#FFFFFF',
    letterSpacing: 0.5, textAlign: 'center',
  },
  tagRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6, gap: 8 },
  dot: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#1E3A5F' },
  tagSub: {
    fontFamily: FONTS.semiBold, fontSize: 11, color: '#3B82C4',
    letterSpacing: 3,
  },
  taglineWrap: { alignItems: 'center', marginTop: 40, paddingHorizontal: 40 },
  tagline: {
    fontFamily: FONTS.medium, fontSize: 17, color: 'rgba(255,255,255,0.9)',
    textAlign: 'center', marginBottom: 6,
  },
  taglineEn: {
    fontFamily: FONTS.regular, fontSize: 13, color: 'rgba(255,255,255,0.5)',
    textAlign: 'center',
  },
  badgeRow: {
    flexDirection: 'row', gap: 8, marginTop: 48,
    position: 'absolute', bottom: 60,
  },
  badge: {
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5,
    backgroundColor: 'rgba(255,255,255,0.07)',
  },
  badgeText: { fontFamily: FONTS.medium, fontSize: 11, color: 'rgba(255,255,255,0.7)' },
});

