import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, Alert, StatusBar,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '../../utils/constants';
import { authAPI } from '../../utils/api';
import useAppStore from '../../store/useAppStore';

export default function OTPVerifyScreen({ navigation, route }) {
  const { phone } = route.params;
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(30);
  const inputs = useRef([]);
  const setToken = useAppStore((s) => s.setToken);
  const setUser = useAppStore((s) => s.setUser);

  useEffect(() => {
    if (timer > 0) {
      const t = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [timer]);

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

  const verifyOTP = async (code) => {
    setLoading(true);
    try {
      const res = await authAPI.verifyOTP(phone, code);
      const { token, user, isNew } = res.data;
      await AsyncStorage.setItem('auth_token', token);
      await AsyncStorage.setItem('user_data', JSON.stringify(user));
      await setToken(token);
      setUser(user);
      if (isNew) {
        navigation.replace('ProfileSetup');
      } else {
        navigation.replace('ProblemSelect');
      }
    } catch {
      // Dev mode — use code 123456
      const enteredCode = otp.join('');
      if (enteredCode === '123456') {
        const mockUser = { id: 1, phone, name: '', isNew: true };
        await AsyncStorage.setItem('auth_token', 'mock_token_dev');
        await AsyncStorage.setItem('user_data', JSON.stringify(mockUser));
        await setToken('mock_token_dev');
        setUser(mockUser);
        navigation.replace('ProfileSetup');
      } else {
        Alert.alert('गलत OTP', 'Invalid OTP. In dev mode use: 123456');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setTimer(30);
    try {
      await authAPI.sendOTP(phone);
    } catch {}
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar backgroundColor={COLORS.white} barStyle="dark-content" />
      <View style={styles.inner}>
        <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← वापस</Text>
        </TouchableOpacity>

        <Text style={styles.heading}>OTP Verify करें</Text>
        <Text style={styles.sub}>
          {phone} पर OTP भेजा गया है{'\n'}
          <Text style={styles.sub2}>OTP sent to {phone}</Text>
        </Text>

        <View style={styles.otpRow}>
          {otp.map((val, i) => (
            <TextInput
              key={i}
              ref={(r) => (inputs.current[i] = r)}
              style={[styles.otpInput, val ? styles.otpFilled : null]}
              value={val}
              onChangeText={(v) => handleChange(v.replace(/[^0-9]/g, ''), i)}
              keyboardType="number-pad"
              maxLength={1}
              selectTextOnFocus
            />
          ))}
        </View>

        <TouchableOpacity
          style={[styles.btn, loading && styles.btnDisabled]}
          onPress={() => verifyOTP(otp.join(''))}
          disabled={loading || otp.join('').length < 6}
        >
          <Text style={styles.btnText}>{loading ? 'Verifying...' : 'Verify करें'}</Text>
        </TouchableOpacity>

        {timer > 0 ? (
          <Text style={styles.timerText}>Resend OTP in {timer}s</Text>
        ) : (
          <TouchableOpacity onPress={handleResend}>
            <Text style={styles.resend}>OTP फिर भेजें (Resend OTP)</Text>
          </TouchableOpacity>
        )}

        <Text style={styles.devNote}>Dev mode: use OTP 123456</Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  inner: { flex: 1, padding: 24, paddingTop: 48 },
  back: { marginBottom: 32 },
  backText: { color: COLORS.primary, fontSize: 16 },
  heading: { fontSize: 26, fontWeight: 'bold', color: COLORS.text, marginBottom: 8 },
  sub: { fontSize: 15, color: COLORS.textSecondary, marginBottom: 36, lineHeight: 22 },
  sub2: { fontSize: 13, color: COLORS.textSecondary },
  otpRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 32 },
  otpInput: {
    width: 48, height: 56,
    borderWidth: 1.5, borderColor: COLORS.border,
    borderRadius: 10, textAlign: 'center',
    fontSize: 22, fontWeight: 'bold', color: COLORS.text,
  },
  otpFilled: { borderColor: COLORS.primary, backgroundColor: '#E8F0FE' },
  btn: {
    backgroundColor: COLORS.primary, borderRadius: 12,
    paddingVertical: 16, alignItems: 'center', marginBottom: 20,
  },
  btnDisabled: { opacity: 0.5 },
  btnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  timerText: { textAlign: 'center', color: COLORS.textSecondary },
  resend: { textAlign: 'center', color: COLORS.primary, fontWeight: '600' },
  devNote: { textAlign: 'center', color: COLORS.warning, fontSize: 12, marginTop: 16 },
});
