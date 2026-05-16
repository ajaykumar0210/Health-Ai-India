import React, { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, Animated, Dimensions, StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import useAppStore from '../../store/useAppStore';
import { COLORS, FONTS } from '../../utils/constants';

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
        const { isAuthenticated: authed } = useAppStore.getState();
        navigation.replace(authed ? 'MainTabs' : 'Onboarding');
      }, 2800);
    };
    init();
  }, []);

  return (
    <LinearGradient colors={['#FFFFFF', '#F9FAFB', '#FFFFFF']} style={styles.container} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      {/* Decorative rings */}
      <Animated.View style={[styles.ring, styles.ring1, { transform: [{ scale: ring1Scale }] }]} />
      <Animated.View style={[styles.ring, styles.ring2, { transform: [{ scale: ring2Scale }] }]} />

      {/* Logo container */}
      <Animated.View style={[styles.logoWrap, { opacity: logoOpacity, transform: [{ scale: logoScale }] }]}>
        <LinearGradient colors={['#D4A017', '#B8860B']} style={styles.logoCircle}>
          <Text style={styles.logoEmoji}>{'\u2695\uFE0F'}</Text>
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
        <Text style={styles.tagline}>{'\u0906\u092A\u0915\u0940 \u0938\u0947\u0939\u0924, \u0939\u092E\u093E\u0930\u0940 \u091C\u093F\u092E\u094D\u092E\u0947\u0926\u093E\u0930\u0940'}</Text>
        <Text style={styles.taglineEn}>Your Health. Our Responsibility.</Text>
      </Animated.View>

      {/* Trust badges */}
      <Animated.View style={[styles.badgeRow, { opacity: badgeOpacity }]}>
        {['10M+ Users', 'NABH Certified', 'Made in India \uD83C\uDDEE\uD83C\uDDF3'].map((b, i) => (
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
  ring: { position: 'absolute', borderRadius: 999, borderWidth: 1 },
  ring1: { width: 200, height: 200, borderColor: 'rgba(212,160,23,0.15)' },
  ring2: { width: 280, height: 280, borderColor: 'rgba(212,160,23,0.08)' },
  logoWrap: { marginBottom: 24 },
  logoCircle: {
    width: 100, height: 100, borderRadius: 30,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#D4A017', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.5, shadowRadius: 24, elevation: 20,
  },
  logoEmoji: { fontSize: 44 },
  appName: { fontFamily: FONTS.bold, fontSize: 32, color: '#111827', marginBottom: 6 },
  tagRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  dot: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#D4A017' },
  tagSub: { fontFamily: FONTS.semiBold, fontSize: 11, color: '#D4A017', letterSpacing: 3 },
  taglineWrap: { marginTop: 32, alignItems: 'center' },
  tagline: { fontFamily: FONTS.medium, fontSize: 16, color: '#6B7280', textAlign: 'center' },
  taglineEn: { fontFamily: FONTS.regular, fontSize: 13, color: '#6B7280', marginTop: 4, opacity: 0.7 },
  badgeRow: { flexDirection: 'row', gap: 10, marginTop: 40, position: 'absolute', bottom: 60 },
  badge: { backgroundColor: 'rgba(212,160,23,0.08)', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1, borderColor: 'rgba(212,160,23,0.2)' },
  badgeText: { fontFamily: FONTS.medium, fontSize: 11, color: '#D4A017' },
});
