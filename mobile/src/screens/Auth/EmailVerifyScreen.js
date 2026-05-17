import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Alert, ActivityIndicator, StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserProfile } from '../../utils/firebase';
import useAppStore from '../../store/useAppStore';
import { FONTS } from '../../utils/constants';

export default function EmailVerifyScreen({ navigation, route }) {
  const { email } = route.params;
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const setUser = useAppStore((s) => s.setUser);
  const setToken = useAppStore((s) => s.setToken);

  const handleCheckVerified = async () => {
    setLoading(true);
    try {
      await auth().currentUser.reload();
      const user = auth().currentUser;
      if (user.emailVerified) {
        const token = await user.getIdToken();
        const profile = await getUserProfile(user.uid);
        const userData = {
          id: user.uid,
          email: user.email,
          name: profile?.name || user.displayName,
          ...profile,
        };
        await AsyncStorage.setItem('auth_token', token);
        await AsyncStorage.setItem('user_data', JSON.stringify(userData));
        setToken(token);
        setUser(userData);
        if (profile?.name) {
          navigation.replace('MainTabs');
        } else {
          navigation.replace('ProfileSetup', { uid: user.uid, email: user.email });
        }
      } else {
        Alert.alert(
          'Not Verified Yet',
          'Please click the verification link in your email, then try again.',
        );
      }
    } catch (err) {
      Alert.alert('Error', err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    try {
      await auth().currentUser.sendEmailVerification();
      Alert.alert('Email Sent', 'A new verification email has been sent to ' + email);
    } catch (err) {
      Alert.alert('Error', err.message || 'Failed to resend. Please try again later.');
    } finally {
      setResendLoading(false);
    }
  };

  const handleBackToLogin = async () => {
    try {
      await auth().signOut();
    } catch (_) {}
    navigation.replace('Login');
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      <LinearGradient colors={['#D4A017', '#B8860B']} style={styles.iconBox}>
        <Ionicons name="mail" size={52} color="#FFFFFF" />
      </LinearGradient>

      <Text style={styles.title}>Verify Your Email</Text>

      <Text style={styles.sub}>We've sent a verification link to:</Text>
      <Text style={styles.emailTxt}>{email}</Text>

      <View style={styles.stepsBox}>
        <View style={styles.step}>
          <View style={styles.stepNum}><Text style={styles.stepNumTxt}>1</Text></View>
          <Text style={styles.stepTxt}>Open the email from Health AI India</Text>
        </View>
        <View style={styles.step}>
          <View style={styles.stepNum}><Text style={styles.stepNumTxt}>2</Text></View>
          <Text style={styles.stepTxt}>Click the "Verify Email" link</Text>
        </View>
        <View style={styles.step}>
          <View style={styles.stepNum}><Text style={styles.stepNumTxt}>3</Text></View>
          <Text style={styles.stepTxt}>Come back here and tap Continue</Text>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.btn, loading && styles.btnDisabled]}
        onPress={handleCheckVerified}
        disabled={loading}
        activeOpacity={0.88}
      >
        <LinearGradient colors={['#D4A017', '#B8860B']} style={styles.btnGrad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
          {loading
            ? <ActivityIndicator color="#0B0B0B" size="small" />
            : <Text style={styles.btnTxt}>I've Verified — Continue {'→'}</Text>
          }
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity style={styles.resendBtn} onPress={handleResend} disabled={resendLoading} activeOpacity={0.7}>
        {resendLoading
          ? <ActivityIndicator color="#D4A017" size="small" />
          : (
            <View style={styles.resendRow}>
              <Ionicons name="refresh-outline" size={16} color="#D4A017" />
              <Text style={styles.resendTxt}>  Resend Verification Email</Text>
            </View>
          )
        }
      </TouchableOpacity>

      <TouchableOpacity onPress={handleBackToLogin} activeOpacity={0.7}>
        <Text style={styles.backTxt}>{'←'} Back to Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: '#FFFFFF',
    alignItems: 'center', justifyContent: 'center', padding: 32,
  },
  iconBox: {
    width: 104, height: 104, borderRadius: 30,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 28, elevation: 14,
    shadowColor: '#D4A017', shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4, shadowRadius: 20,
  },
  title: {
    fontFamily: FONTS.bold, fontSize: 26, color: '#111827',
    marginBottom: 10, textAlign: 'center',
  },
  sub: {
    fontFamily: FONTS.regular, fontSize: 15, color: '#6B7280',
    textAlign: 'center',
  },
  emailTxt: {
    fontFamily: FONTS.semiBold, fontSize: 16, color: '#D4A017',
    marginTop: 4, marginBottom: 28, textAlign: 'center',
  },
  stepsBox: {
    width: '100%', backgroundColor: '#F9FAFB', borderRadius: 16,
    padding: 18, marginBottom: 28, gap: 14,
  },
  step: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  stepNum: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: '#D4A017', alignItems: 'center', justifyContent: 'center',
  },
  stepNumTxt: { fontFamily: FONTS.bold, fontSize: 13, color: '#FFFFFF' },
  stepTxt: { fontFamily: FONTS.regular, fontSize: 14, color: '#374151', flex: 1 },
  btn: { width: '100%', borderRadius: 14, overflow: 'hidden', marginBottom: 14 },
  btnDisabled: { opacity: 0.7 },
  btnGrad: { paddingVertical: 16, alignItems: 'center' },
  btnTxt: { fontFamily: FONTS.semiBold, fontSize: 16, color: '#0B0B0B' },
  resendBtn: { paddingVertical: 12, marginBottom: 20 },
  resendRow: { flexDirection: 'row', alignItems: 'center' },
  resendTxt: { fontFamily: FONTS.semiBold, fontSize: 15, color: '#D4A017' },
  backTxt: { fontFamily: FONTS.regular, fontSize: 14, color: '#9CA3AF' },
});
