import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, ScrollView, StatusBar,
  Dimensions, Alert, ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { COLORS, GRADIENTS, FONTS } from '../../utils/constants';
import { sendOTP, getUserProfile, signInWithCredential, createEmailUser, signInEmail, GoogleAuthProvider } from '../../utils/firebase';
import { setPhoneConfirmation } from '../../utils/authState';
import useAppStore from '../../store/useAppStore';

const WEB_CLIENT_ID = '738075468552-dj2533tteuu573e28cqbdnmmf9ca76nm.apps.googleusercontent.com';

const { height } = Dimensions.get('window');

const CATEGORIES = [
  { icon: '\uD83D\uDC87', label: 'Hair Care' },
  { icon: '\u2728', label: 'Skin & Acne' },
  { icon: '\uD83E\uDD57', label: 'Nutrition' },
  { icon: '\uD83D\uDC8A', label: 'Wellness' },
  { icon: '\uD83E\uDDEC', label: 'Hormones' },
  { icon: '\uD83E\uDDD8', label: 'Stress' },
];

export default function LoginScreen({ navigation }) {
  const [tab, setTab] = useState('phone');
  const [mode, setMode] = useState('login');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const setUser = useAppStore((s) => s.setUser);
  const setToken = useAppStore((s) => s.setToken);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: WEB_CLIENT_ID,
    });
  }, []);

  const handleSendOTP = async () => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length !== 10 || !/^[6-9]\d{9}$/.test(cleaned)) {
      Alert.alert('Invalid Number', 'Enter a valid 10-digit Indian mobile number starting with 6-9.');
      return;
    }
    setLoading(true);
    try {
      const confirmationResult = await sendOTP('+91' + cleaned);
      setPhoneConfirmation(confirmationResult);
      setLoading(false);
      navigation.navigate('OTPVerify', { phone: '+91' + cleaned });
    } catch (err) {
      setLoading(false);
      Alert.alert('Error', err.message || 'Failed to send OTP. Please try again.');
    }
  };

  const handleEmailAuth = async () => {
    if (!email.trim() || !password) { Alert.alert('Required', 'Enter your email and password.'); return; }
    if (mode === 'signup' && !name.trim()) { Alert.alert('Required', 'Enter your full name.'); return; }
    if (password.length < 8) { Alert.alert('Weak Password', 'Password must be at least 8 characters.'); return; }
    setLoading(true);
    try {
      if (mode === 'signup') {
        // Create account → send verification email → go to verify screen
        const userCredential = await createEmailUser(email.trim(), password);
        await userCredential.user.sendEmailVerification();
        navigation.navigate('EmailVerify', { email: email.trim() });
      } else {
        // Login → check email verified first
        const userCredential = await signInEmail(email.trim(), password);
        const fbUser = userCredential.user;
        if (!fbUser.emailVerified) {
          navigation.navigate('EmailVerify', { email: email.trim() });
          return;
        }
        const token = await fbUser.getIdToken();
        const profile = await getUserProfile(fbUser.uid);
        const userData = { id: fbUser.uid, email: fbUser.email, name: profile?.name || fbUser.displayName, ...profile };
        await AsyncStorage.setItem('auth_token', token);
        await AsyncStorage.setItem('user_data', JSON.stringify(userData));
        setToken(token);
        setUser(userData);
        if (profile?.name) {
          navigation.replace('MainTabs');
        } else {
          navigation.navigate('ProfileSetup', { uid: fbUser.uid, email: fbUser.email });
        }
      }
    } catch (err) {
      const msg = err.code === 'auth/user-not-found' ? 'No account found with this email.'
        : err.code === 'auth/wrong-password' ? 'Incorrect password.'
        : err.code === 'auth/invalid-credential' ? 'Incorrect email or password.'
        : err.code === 'auth/email-already-in-use' ? 'An account with this email already exists.'
        : err.message || 'Something went wrong.';
      Alert.alert('Auth Error', msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const idToken = userInfo.data?.idToken ?? userInfo.idToken;
      if (!idToken) throw new Error('No ID token received from Google.');
      setLoading(true);
      const credential = GoogleAuthProvider.credential(idToken);
      const result = await signInWithCredential(credential);
      const fbUser = result.user;
      const token = await fbUser.getIdToken();
      const profile = await getUserProfile(fbUser.uid);
      const userData = { id: fbUser.uid, email: fbUser.email, name: profile?.name || fbUser.displayName, photo: fbUser.photoURL, ...profile };
      await AsyncStorage.setItem('auth_token', token);
      await AsyncStorage.setItem('user_data', JSON.stringify(userData));
      setToken(token);
      setUser(userData);
      if (profile?.name) {
        navigation.replace('MainTabs');
      } else {
        navigation.navigate('ProfileSetup', { uid: fbUser.uid, email: fbUser.email });
      }
    } catch (err) {
      if (err.code === statusCodes.SIGN_IN_CANCELLED) return;
      if (err.code === statusCodes.IN_PROGRESS) return;
      Alert.alert('Google Sign-In Error', err.message || 'Failed to sign in with Google.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      <LinearGradient
        colors={['#FFFFFF', '#F9FAFB', '#FFFFFF']}
        style={styles.hero}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
      >
        <View style={[styles.orb, { width: 220, height: 220, backgroundColor: '#D4A017', top: -80, right: -70, opacity: 0.08 }]} />
        <View style={[styles.orb, { width: 160, height: 160, backgroundColor: '#F3F4F6', bottom: -20, left: -50, opacity: 0.15 }]} />
        <View style={[styles.orb, { width: 100, height: 100, backgroundColor: '#D4A017', top: 30, left: 20, opacity: 0.05 }]} />

        <LinearGradient colors={['#D4A017', '#B8860B']} style={styles.logoBox}>
          <Text style={styles.logoEmoji}>{'\u2695\uFE0F'}</Text>
        </LinearGradient>

        <Text style={styles.brandName}>Health AI India</Text>
        <Text style={styles.brandSub}>Your Personal Health Companion</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsScroll} contentContainerStyle={styles.chipsContent}>
          {CATEGORIES.map((c) => (
            <View key={c.label} style={styles.chip}>
              <Text style={styles.chipIcon}>{c.icon}</Text>
              <Text style={styles.chipLabel}>{c.label}</Text>
            </View>
          ))}
        </ScrollView>

        <View style={styles.statsStrip}>
          <View style={styles.statItem}><Text style={styles.statVal}>10M+</Text><Text style={styles.statLbl}>Users</Text></View>
          <View style={styles.statDiv} />
          <View style={styles.statItem}><Text style={styles.statVal}>4.9 {'\u2605'}</Text><Text style={styles.statLbl}>Rating</Text></View>
          <View style={styles.statDiv} />
          <View style={styles.statItem}><Text style={styles.statVal}>NABH</Text><Text style={styles.statLbl}>Certified</Text></View>
          <View style={styles.statDiv} />
          <View style={styles.statItem}><Text style={styles.statVal}>{'\uD83C\uDDEE\uD83C\uDDF3'}</Text><Text style={styles.statLbl}>Made in India</Text></View>
        </View>
      </LinearGradient>

      <KeyboardAvoidingView style={styles.cardWrap} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.card} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <Text style={styles.cardTitle}>Login / Create Account</Text>

          <View style={styles.tabs}>
            <TouchableOpacity style={[styles.tabBtn, tab === 'phone' && styles.tabBtnActive]} onPress={() => setTab('phone')}>
              <Ionicons name="phone-portrait-outline" size={15} color={tab === 'phone' ? '#D4A017' : '#9CA3AF'} />
              <Text style={[styles.tabTxt, tab === 'phone' && styles.tabTxtActive]}> Phone</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.tabBtn, tab === 'email' && styles.tabBtnActive]} onPress={() => setTab('email')}>
              <Ionicons name="mail-outline" size={15} color={tab === 'email' ? '#D4A017' : '#9CA3AF'} />
              <Text style={[styles.tabTxt, tab === 'email' && styles.tabTxtActive]}> Email</Text>
            </TouchableOpacity>
          </View>

          {tab === 'phone' && (
            <>
              <Text style={styles.fieldLbl}>Mobile Number</Text>
              <View style={styles.phoneRow}>
                <View style={styles.countryPill}>
                  <Text style={styles.flagTxt}>{'\uD83C\uDDEE\uD83C\uDDF3'}</Text>
                  <Text style={styles.dialCode}>+91</Text>
                </View>
                <TextInput
                  style={styles.phoneInput}
                  placeholder="98765 43210"
                  placeholderTextColor="#6B7280"
                  keyboardType="phone-pad"
                  maxLength={10}
                  value={phone}
                  onChangeText={setPhone}
                />
              </View>
              <View style={styles.hintRow}>
                <Ionicons name="information-circle-outline" size={14} color="#9CA3AF" />
                <Text style={styles.hintTxt}>  A 6-digit OTP will be sent to your mobile number</Text>
              </View>
              <TouchableOpacity style={[styles.ctaBtn, loading && styles.ctaDisabled]} onPress={handleSendOTP} disabled={loading} activeOpacity={0.88}>
                <LinearGradient colors={['#D4A017', '#B8860B']} style={styles.ctaGrad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                  {loading ? (
                    <ActivityIndicator color="#0B0B0B" size="small" />
                  ) : (
                    <Text style={styles.ctaTxt}>Send OTP  {'\u2192'}</Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </>
          )}

          {tab === 'email' && (
            <>
              <View style={styles.modeToggle}>
                {['login', 'signup'].map((m) => (
                  <TouchableOpacity key={m} style={[styles.modeBtn, mode === m && styles.modeBtnOn]} onPress={() => setMode(m)}>
                    <Text style={[styles.modeTxt, mode === m && styles.modeTxtOn]}>{m === 'login' ? 'Login' : 'Sign Up'}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {mode === 'signup' && (
                <View style={styles.inputBox}>
                  <Ionicons name="person-outline" size={18} color="#9CA3AF" style={styles.inputIco} />
                  <TextInput style={styles.inputField} placeholder="Full Name" placeholderTextColor="#6B7280" value={name} onChangeText={setName} />
                </View>
              )}

              <View style={styles.inputBox}>
                <Ionicons name="mail-outline" size={18} color="#9CA3AF" style={styles.inputIco} />
                <TextInput style={styles.inputField} placeholder="Email Address" placeholderTextColor="#6B7280" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />
              </View>

              <View style={styles.inputBox}>
                <Ionicons name="lock-closed-outline" size={18} color="#9CA3AF" style={styles.inputIco} />
                <TextInput style={[styles.inputField, { flex: 1 }]} placeholder="Password (min. 8 characters)" placeholderTextColor="#6B7280" secureTextEntry={!showPass} value={password} onChangeText={setPassword} />
                <TouchableOpacity onPress={() => setShowPass(!showPass)} style={{ padding: 4 }}>
                  <Ionicons name={showPass ? 'eye-off-outline' : 'eye-outline'} size={20} color="#9CA3AF" />
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={[styles.ctaBtn, loading && styles.ctaDisabled]} onPress={handleEmailAuth} disabled={loading} activeOpacity={0.88}>
                <LinearGradient colors={['#D4A017', '#B8860B']} style={styles.ctaGrad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                  {loading ? (
                    <ActivityIndicator color="#0B0B0B" size="small" />
                  ) : (
                    <Text style={styles.ctaTxt}>{mode === 'login' ? 'Login  \u2192' : 'Create Account  \u2192'}</Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </>
          )}

          <View style={styles.divider}>
            <View style={styles.divLine} />
            <Text style={styles.divTxt}>OR</Text>
            <View style={styles.divLine} />
          </View>

          <TouchableOpacity style={styles.googleBtn} activeOpacity={0.88} onPress={handleGoogleSignIn}>
            <View style={styles.gBadge}><Text style={styles.gLetter}>G</Text></View>
            <Text style={styles.googleTxt}>Continue with Google</Text>
          </TouchableOpacity>

          <Text style={styles.privacy}>
            By continuing, you agree to our <Text style={styles.privacyLink}>Terms</Text> and <Text style={styles.privacyLink}>Privacy Policy</Text>.{'\n'}
            {'\uD83D\uDD12'} Your data stays in India. DPDP Act 2023 compliant.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FFFFFF' },
  hero: { paddingTop: 56, paddingBottom: 24, alignItems: 'center', overflow: 'hidden', minHeight: height * 0.46 },
  orb: { position: 'absolute', borderRadius: 999 },
  logoBox: {
    width: 80, height: 80, borderRadius: 24,
    alignItems: 'center', justifyContent: 'center', marginBottom: 14,
    shadowColor: '#D4A017', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.5, shadowRadius: 24, elevation: 18,
  },
  logoEmoji: { fontSize: 38 },
  brandName: { fontFamily: FONTS.bold, fontSize: 30, color: '#111827', marginBottom: 5 },
  brandSub: { fontFamily: FONTS.regular, fontSize: 13, color: '#6B7280', marginBottom: 20 },
  chipsScroll: { flexGrow: 0, marginBottom: 18 },
  chipsContent: { paddingHorizontal: 16, gap: 8 },
  chip: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(212,160,23,0.08)', borderRadius: 24,
    paddingHorizontal: 14, paddingVertical: 8,
    borderWidth: 1, borderColor: 'rgba(212,160,23,0.2)',
  },
  chipIcon: { fontSize: 14 },
  chipLabel: { fontFamily: FONTS.medium, fontSize: 12, color: '#111827', marginLeft: 5 },
  statsStrip: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(212,160,23,0.08)', borderRadius: 18,
    paddingVertical: 10, borderWidth: 1, borderColor: 'rgba(212,160,23,0.2)', marginHorizontal: 20,
  },
  statItem: { alignItems: 'center', flex: 1 },
  statVal: { fontFamily: FONTS.bold, fontSize: 14, color: '#D4A017' },
  statLbl: { fontFamily: FONTS.regular, fontSize: 10, color: '#6B7280', marginTop: 2 },
  statDiv: { width: 1, height: 28, backgroundColor: 'rgba(0,0,0,0.04)' },
  cardWrap: { flex: 1, marginTop: -24 },
  card: { backgroundColor: '#F3F4F6', borderTopLeftRadius: 28, borderTopRightRadius: 28, paddingHorizontal: 22, paddingTop: 30, paddingBottom: 40 },
  cardTitle: { fontFamily: FONTS.bold, fontSize: 21, color: '#111827', marginBottom: 22, textAlign: 'center' },
  tabs: { flexDirection: 'row', backgroundColor: '#FFFFFF', borderRadius: 14, padding: 4, marginBottom: 22 },
  tabBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 11, borderRadius: 11 },
  tabBtnActive: { backgroundColor: '#F3F4F6', shadowColor: '#D4A017', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 6, elevation: 3 },
  tabTxt: { fontFamily: FONTS.medium, fontSize: 14, color: '#6B7280' },
  tabTxtActive: { fontFamily: FONTS.semiBold, color: '#D4A017' },
  fieldLbl: { fontFamily: FONTS.semiBold, fontSize: 13, color: '#111827', marginBottom: 9 },
  phoneRow: { flexDirection: 'row', borderWidth: 2, borderColor: '#E5E7EB', borderRadius: 14, overflow: 'hidden', marginBottom: 8 },
  countryPill: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', paddingHorizontal: 14, borderRightWidth: 2, borderRightColor: '#374151' },
  flagTxt: { fontSize: 22 },
  dialCode: { fontFamily: FONTS.bold, fontSize: 16, color: '#111827', marginLeft: 6 },
  phoneInput: { flex: 1, paddingHorizontal: 16, paddingVertical: 16, fontFamily: FONTS.semiBold, fontSize: 18, color: '#111827', letterSpacing: 2, backgroundColor: '#FFFFFF' },
  hintRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  hintTxt: { fontFamily: FONTS.regular, fontSize: 12, color: '#6B7280', flex: 1 },
  ctaBtn: { borderRadius: 16, overflow: 'hidden', marginTop: 2 },
  ctaDisabled: { opacity: 0.55 },
  ctaGrad: { paddingVertical: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  ctaTxt: { fontFamily: FONTS.bold, fontSize: 16, color: '#FFFFFF', letterSpacing: 0.4 },
  modeToggle: { flexDirection: 'row', backgroundColor: '#FFFFFF', borderRadius: 12, padding: 3, marginBottom: 18 },
  modeBtn: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10 },
  modeBtnOn: { backgroundColor: '#F3F4F6', shadowColor: '#D4A017', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.15, shadowRadius: 3, elevation: 1 },
  modeTxt: { fontFamily: FONTS.medium, fontSize: 14, color: '#6B7280' },
  modeTxtOn: { fontFamily: FONTS.semiBold, color: '#D4A017' },
  inputBox: { flexDirection: 'row', alignItems: 'center', borderWidth: 2, borderColor: '#E5E7EB', borderRadius: 14, paddingHorizontal: 14, marginBottom: 14, backgroundColor: '#FFFFFF' },
  inputIco: { marginRight: 10 },
  inputField: { flex: 1, paddingVertical: 15, fontFamily: FONTS.regular, fontSize: 15, color: '#111827' },
  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: 22 },
  divLine: { flex: 1, height: 1, backgroundColor: '#E5E7EB' },
  divTxt: { fontFamily: FONTS.medium, fontSize: 12, color: '#6B7280', marginHorizontal: 14 },
  googleBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, borderColor: '#E5E7EB', borderRadius: 16, paddingVertical: 15,
    backgroundColor: '#FFFFFF',
  },
  gBadge: { width: 30, height: 30, borderRadius: 8, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  gLetter: { fontFamily: FONTS.bold, fontSize: 16, color: '#D4A017' },
  googleTxt: { fontFamily: FONTS.semiBold, fontSize: 15, color: '#111827' },
  privacy: { fontFamily: FONTS.regular, fontSize: 11.5, color: '#6B7280', textAlign: 'center', marginTop: 18, lineHeight: 18 },
  privacyLink: { color: '#D4A017', fontFamily: FONTS.medium },
});
