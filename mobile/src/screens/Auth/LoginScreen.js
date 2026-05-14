import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, ScrollView, Alert, StatusBar,
} from 'react-native';
import { COLORS } from '../../utils/constants';
import { authAPI } from '../../utils/api';

export default function LoginScreen({ navigation }) {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async () => {
    const cleaned = phone.replace(/\s/g, '');
    if (cleaned.length !== 10 || !/^[6-9]\d{9}$/.test(cleaned)) {
      Alert.alert('गलत नंबर', 'Please enter a valid 10-digit Indian mobile number');
      return;
    }
    setLoading(true);
    try {
      await authAPI.sendOTP(`+91${cleaned}`);
      navigation.navigate('OTPVerify', { phone: `+91${cleaned}` });
    } catch (err) {
      // For development — skip API and go straight to OTP screen
      navigation.navigate('OTPVerify', { phone: `+91${cleaned}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar backgroundColor={COLORS.white} barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.logo}>🏥</Text>
        <Text style={styles.heading}>Login / Sign Up</Text>
        <Text style={styles.subheading}>अपना मोबाइल नंबर दर्ज करें</Text>
        <Text style={styles.sub2}>Enter your mobile number to continue</Text>

        <View style={styles.inputRow}>
          <View style={styles.countryCode}>
            <Text style={styles.countryCodeText}>🇮🇳 +91</Text>
          </View>
          <TextInput
            style={styles.input}
            placeholder="Mobile Number"
            keyboardType="phone-pad"
            maxLength={10}
            value={phone}
            onChangeText={setPhone}
            returnKeyType="done"
          />
        </View>

        <TouchableOpacity
          style={[styles.btn, loading && styles.btnDisabled]}
          onPress={handleSendOTP}
          disabled={loading}
        >
          <Text style={styles.btnText}>{loading ? 'भेज रहे हैं...' : 'OTP भेजें (Send OTP)'}</Text>
        </TouchableOpacity>

        <View style={styles.divider}>
          <View style={styles.line} />
          <Text style={styles.orText}>OR</Text>
          <View style={styles.line} />
        </View>

        <Text style={styles.privacy}>
          By continuing, you agree to our{' '}
          <Text style={styles.link}>Terms of Service</Text> and{' '}
          <Text style={styles.link}>Privacy Policy</Text>.{'\n'}
          Your data stays in India. 🔒
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  scroll: { flexGrow: 1, padding: 24, paddingTop: 60, alignItems: 'center' },
  logo: { fontSize: 60, marginBottom: 16 },
  heading: { fontSize: 26, fontWeight: 'bold', color: COLORS.text, marginBottom: 4 },
  subheading: { fontSize: 16, color: COLORS.primary, marginBottom: 4 },
  sub2: { fontSize: 14, color: COLORS.textSecondary, marginBottom: 32 },
  inputRow: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: 20,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 12,
    overflow: 'hidden',
  },
  countryCode: {
    backgroundColor: COLORS.background,
    paddingHorizontal: 14,
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: COLORS.border,
  },
  countryCodeText: { fontSize: 16, fontWeight: '600' },
  input: { flex: 1, paddingHorizontal: 16, paddingVertical: 14, fontSize: 18, letterSpacing: 2 },
  btn: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 16,
    width: '100%',
    alignItems: 'center',
    marginBottom: 24,
  },
  btnDisabled: { opacity: 0.6 },
  btnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  divider: { flexDirection: 'row', alignItems: 'center', width: '100%', marginBottom: 24 },
  line: { flex: 1, height: 1, backgroundColor: COLORS.border },
  orText: { marginHorizontal: 12, color: COLORS.textSecondary },
  privacy: { fontSize: 12, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 18 },
  link: { color: COLORS.primary, fontWeight: '600' },
});
