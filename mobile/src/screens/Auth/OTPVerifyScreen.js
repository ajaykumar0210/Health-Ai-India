import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, Alert, StatusBar, Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { signInWithPhoneNumber } from 'firebase/auth';
import { COLORS, GRADIENTS, FONTS } from '../../utils/constants';
import { auth } from '../../utils/firebase';
import { getPhoneConfirmation, clearPhoneConfirmation, setPhoneConfirmation } from '../../utils/authState';
import useAppStore from '../../store/useAppStore';

export default function OTPVerifyScreen({ navigation, route }) {
  const { phone } = route.params;
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(30);
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
    const confirmation = getPhoneConfirmation();
    try {
      if (confirmation) {
        // â”€â”€ Real Firebase Phone Auth â”€â”€
        const result = await confirmation.confirm(code);
        clearPhoneConfirmation();
        const token = await result.user.getIdToken();
        await AsyncStorage.setItem('auth_token', token);
        const user = { id: result.user.uid, phone: result.user.phoneNumber, name: '' };
        await AsyncStorage.setItem('user_data', JSON.stringify(user));
        setToken(token);
        setUser(user);
        navigation.replace('ProfileSetup');
      } else {
        // â”€â”€ Dev fallback (Firebase not configured / web) â”€â”€
        if (code === '123456') {
          const mockUser = { id: 1, phone, name: '', isNew: true };
          await AsyncStorage.setItem('auth_token', 'mock_token_dev');
          await AsyncStorage.setItem('user_data', JSON.stringify(mockUser));
          setToken('mock_token_dev');
          setUser(mockUser);
          navigation.replace('ProfileSetup');
        } else {
          throw new Error('wrong_otp');
        }
      }
    } catch (err) {
      const isWrong = err.code === 'auth/invalid-verification-code' || err.message === 'wrong_otp';
      shake();
      setOtp(['', '', '', '', '', '']);
      setTimeout(() => inputs.current[0]?.focus(), 100);
      Alert.alert(
        'Invalid OTP',
        isWrong
          ? 'The code you entered is incorrect. Please try again.'
          : 'Verification failed. Please check your OTP and try again.\n\nðŸ’¡ Dev mode: use 123456',
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
      const confirmation = await signInWithPhoneNumber(auth, phone);
      setPhoneConfirmation(confirmation);
    } catch (_) {
      // Firebase not configured â€” dev mode
    }
  };

  const masked = phone.includes('@')
    ? phone.replace(/(.{2}).+(@.+)/, '$1****$2')
    : phone.replace(/(\+91)(\d{2})\d{6}(\d{2})/, '$1-$2XXXXXX$3');

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      {/* Top hero */}
      <LinearGradient colors={GRADIENTS.hero} style={styles.hero} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <View style={styles.otpIconWrap}>
          <Text style={styles.otpIconEmoji}>ðŸ“±</Text>
        </View>
        <Text style={styles.heroTitle}>Verify Your Number</Text>
        <Text style={styles.heroSub}>OTP sent to {masked}</Text>
      </LinearGradient>

      {/* White card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Enter 6-Digit OTP</Text>
        <Text style={styles.cardSub}>
          Check your SMS inbox. Dev mode: use <Text style={{ color: COLORS.primary, fontFamily: FONTS.bold }}>123456</Text>
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
            colors={loading || otp.join('').length < 6 ? ['#D1D5DB', '#D1D5DB'] : ['#1E3A5F', '#3B82C4']}
            style={styles.verifyGradient}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
          >
            {loading
              ? <Text style={styles.verifyText}>Verifying...</Text>
              : (
                <>
                  <Ionicons name="checkmark-circle" size={20} color="#fff" style={{ marginRight: 8 }} />
                  <Text style={styles.verifyText}>Verify OTP</Text>
                </>
              )}
          </LinearGradient>
        </TouchableOpacity>

        {/* Resend */}
        <View style={styles.resendRow}>
          {timer > 0 ? (
            <Text style={styles.timerText}>
              Resend OTP in <Text style={{ color: COLORS.primary, fontFamily: FONTS.bold }}>{timer}s</Text>
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
  root: { flex: 1, backgroundColor: '#0B1929' },
  hero: {
    paddingTop: 60, paddingBottom: 40, alignItems: 'center',
    paddingHorizontal: 24,
  },
  backBtn: {
    position: 'absolute', top: 52, left: 20,
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center', justifyContent: 'center',
  },
  otpIconWrap: {
    width: 80, height: 80, borderRadius: 24,
    backgroundColor: 'rgba(255,92,0,0.2)',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 1, borderColor: 'rgba(255,92,0,0.3)',
  },
  otpIconEmoji: { fontSize: 36 },
  heroTitle: { fontFamily: FONTS.bold, fontSize: 24, color: '#fff', marginBottom: 6 },
  heroSub: { fontFamily: FONTS.regular, fontSize: 14, color: 'rgba(255,255,255,0.6)' },

  card: {
    flex: 1, backgroundColor: COLORS.white,
    borderTopLeftRadius: 28, borderTopRightRadius: 28,
    paddingHorizontal: 28, paddingTop: 32,
  },
  cardTitle: { fontFamily: FONTS.bold, fontSize: 22, color: COLORS.text, marginBottom: 8 },
  cardSub: { fontFamily: FONTS.regular, fontSize: 13, color: COLORS.textSecondary, marginBottom: 32, lineHeight: 20 },

  otpRow: { flexDirection: 'row', gap: 10, marginBottom: 32, justifyContent: 'center' },
  otpBox: {
    width: 48, height: 56, borderRadius: 14,
    borderWidth: 2, borderColor: COLORS.border,
    textAlign: 'center', fontFamily: FONTS.bold, fontSize: 22, color: COLORS.text,
    backgroundColor: '#F8FAFC',
  },
  otpBoxFilled: {
    borderColor: '#1E3A5F', backgroundColor: '#EBF2FA',
    shadowColor: '#1E3A5F', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4,
  },
  otpBoxActive: { borderColor: '#CBD5E1' },

  verifyBtn: { borderRadius: 14, overflow: 'hidden' },
  verifyBtnDisabled: { opacity: 0.7 },
  verifyGradient: {
    paddingVertical: 16, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'center',
  },
  verifyText: { fontFamily: FONTS.bold, fontSize: 16, color: '#fff' },

  resendRow: { alignItems: 'center', marginTop: 20 },
  timerText: { fontFamily: FONTS.regular, fontSize: 14, color: COLORS.textSecondary },
  resendText: { fontFamily: FONTS.regular, fontSize: 14, color: COLORS.textSecondary },
  resendLink: { fontFamily: FONTS.semiBold, color: COLORS.primary },
});
