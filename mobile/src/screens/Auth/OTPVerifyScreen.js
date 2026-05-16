import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, Alert, StatusBar, Animated,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, FONTS } from '../../utils/constants';
import { sendOTP, getUserProfile } from '../../utils/firebase';
import useAppStore from '../../store/useAppStore';

export default function OTPVerifyScreen({ navigation, route }) {
  const { phone, confirmationResult } = route.params;
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(30);
  const [confirmation, setConfirmation] = useState(confirmationResult);
  const inputs = useRef([]);
  const setToken = useAppStore((s) => s.setToken);
  const setUser = useAppStore((s) => s.setUser);

  // Shake animation for wrong OTP
  const shakeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (timer > 0) {
      const t = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [timer]);

  // Auto-focus first input
  useEffect(() => {
    setTimeout(() => inputs.current[0]?.focus(), 300);
  }, []);

  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start();
  };

  const handleChange = (val, index) => {
    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);
    if (val && index < 5) inputs.current[index + 1]?.focus();
    if (!val && index > 0) inputs.current[index - 1]?.focus();
    if (index === 5 && val) {
      const code = [...newOtp.slice(0, 5), val].join('');
      if (code.length === 6) verifyOTP(code);
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const verifyOTP = async (code) => {
    setLoading(true);
    try {
      const result = await confirmation.confirm(code);
      const fbUser = result.user;
      const token = await fbUser.getIdToken();
      const profile = await getUserProfile(fbUser.uid);
      const userData = { id: fbUser.uid, phone: fbUser.phoneNumber, name: profile?.name, ...profile };
      await AsyncStorage.setItem('auth_token', token);
      await AsyncStorage.setItem('user_data', JSON.stringify(userData));
      setToken(token);
      setUser(userData);
      if (userData.name && userData.name.trim()) {
        navigation.replace('MainTabs');
      } else {
        navigation.replace('ProfileSetup', { uid: fbUser.uid, phone: fbUser.phoneNumber });
      }
    } catch (err) {
      shake();
      setOtp(['', '', '', '', '', '']);
      setTimeout(() => inputs.current[0]?.focus(), 100);
      Alert.alert(
        'Invalid OTP',
        err.code === 'auth/invalid-verification-code'
          ? 'The code you entered is incorrect. Please try again.'
          : err.message || 'Verification failed. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setTimer(30);
    setOtp(['', '', '', '', '', '']);
    inputs.current[0]?.focus();
    try {
      const newConfirmation = await sendOTP(phone);
      setConfirmation(newConfirmation);
      Alert.alert('OTP Sent', 'A new OTP has been sent to your phone.');
    } catch (err) {
      Alert.alert('Error', err.message || 'Failed to resend OTP. Please try again.');
    }
  };

  const masked = phone.replace(/(\+91)(\d{2})\d{6}(\d{2})/, '$1-$2XXXXXX$3');

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      {/* Top hero */}
      <LinearGradient colors={['#FFFFFF', '#F9FAFB', '#FFFFFF']} style={styles.hero} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color="#111827" />
        </TouchableOpacity>
        <View style={styles.otpIconWrap}>
          <Text style={styles.otpIconEmoji}>{'\uD83D\uDCF1'}</Text>
        </View>
        <Text style={styles.heroTitle}>Verify Your Number</Text>
        <Text style={styles.heroSub}>OTP sent to {masked}</Text>
      </LinearGradient>

      {/* Dark card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Enter 6-Digit OTP</Text>
        <Text style={styles.cardSub}>
          Check your SMS inbox for the verification code.
        </Text>

        {/* OTP Boxes */}
        <Animated.View style={[styles.otpRow, { transform: [{ translateX: shakeAnim }] }]}>
          {otp.map((val, i) => (
            <TextInput
              key={i}
              ref={(r) => (inputs.current[i] = r)}
              style={[
                styles.otpBox,
                val ? styles.otpBoxFilled : null,
                i === otp.findIndex((v) => !v) && styles.otpBoxActive,
              ]}
              value={val}
              onChangeText={(v) => handleChange(v.replace(/[^0-9]/g, ''), i)}
              onKeyPress={(e) => handleKeyPress(e, i)}
              keyboardType="number-pad"
              maxLength={1}
              selectTextOnFocus
            />
          ))}
        </Animated.View>

        {/* Verify button */}
        <TouchableOpacity
          style={[styles.verifyBtn, (loading || otp.join('').length < 6) && styles.verifyBtnDisabled]}
          onPress={() => verifyOTP(otp.join(''))}
          disabled={loading || otp.join('').length < 6}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={loading || otp.join('').length < 6 ? ['#374151', '#374151'] : ['#D4A017', '#B8860B']}
            style={styles.verifyGradient}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
          >
            {loading ? (
              <ActivityIndicator color="#0B0B0B" size="small" />
            ) : (
              <>
                <Ionicons name="checkmark-circle" size={20} color="#0B0B0B" style={{ marginRight: 8 }} />
                <Text style={styles.verifyText}>Verify OTP</Text>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>

        {/* Resend */}
        <View style={styles.resendRow}>
          {timer > 0 ? (
            <Text style={styles.timerText}>
              Resend OTP in <Text style={{ color: '#D4A017', fontFamily: FONTS.bold }}>{timer}s</Text>
            </Text>
          ) : (
            <TouchableOpacity onPress={handleResend}>
              <Text style={styles.resendText}>Didn't get it? <Text style={styles.resendLink}>Resend OTP</Text></Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FFFFFF' },
  hero: {
    paddingTop: 60, paddingBottom: 40, alignItems: 'center',
    paddingHorizontal: 24,
  },
  backBtn: {
    position: 'absolute', top: 52, left: 20,
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: 'rgba(212,160,23,0.15)',
    alignItems: 'center', justifyContent: 'center',
  },
  otpIconWrap: {
    width: 80, height: 80, borderRadius: 24,
    backgroundColor: 'rgba(212,160,23,0.15)',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 1, borderColor: 'rgba(212,160,23,0.3)',
  },
  otpIconEmoji: { fontSize: 36 },
  heroTitle: { fontFamily: FONTS.bold, fontSize: 24, color: '#111827', marginBottom: 6 },
  heroSub: { fontFamily: FONTS.regular, fontSize: 14, color: '#6B7280' },

  card: {
    flex: 1, backgroundColor: '#F3F4F6',
    borderTopLeftRadius: 28, borderTopRightRadius: 28,
    paddingHorizontal: 28, paddingTop: 32,
  },
  cardTitle: { fontFamily: FONTS.bold, fontSize: 22, color: '#111827', marginBottom: 8 },
  cardSub: { fontFamily: FONTS.regular, fontSize: 13, color: '#6B7280', marginBottom: 32, lineHeight: 20 },

  otpRow: { flexDirection: 'row', gap: 10, marginBottom: 32, justifyContent: 'center' },
  otpBox: {
    width: 48, height: 56, borderRadius: 14,
    borderWidth: 2, borderColor: '#E5E7EB',
    textAlign: 'center', fontFamily: FONTS.bold, fontSize: 22, color: '#111827',
    backgroundColor: '#FFFFFF',
  },
  otpBoxFilled: {
    borderColor: '#D4A017', backgroundColor: '#1A1A0A',
    shadowColor: '#D4A017', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
  },
  otpBoxActive: { borderColor: '#9CA3AF' },

  verifyBtn: { borderRadius: 14, overflow: 'hidden' },
  verifyBtnDisabled: { opacity: 0.7 },
  verifyGradient: {
    paddingVertical: 16, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'center',
  },
  verifyText: { fontFamily: FONTS.bold, fontSize: 16, color: '#0B0B0B' },

  resendRow: { alignItems: 'center', marginTop: 20 },
  timerText: { fontFamily: FONTS.regular, fontSize: 14, color: '#6B7280' },
  resendText: { fontFamily: FONTS.regular, fontSize: 14, color: '#6B7280' },
  resendLink: { fontFamily: FONTS.semiBold, color: '#D4A017' },
});
