import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  ScrollView, Alert, KeyboardAvoidingView, Platform, StatusBar, Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, GRADIENTS, FONTS } from '../../utils/constants';
import { saveUserProfile } from '../../utils/firebase';
import { auth } from '../../utils/firebase';
import useAppStore from '../../store/useAppStore';

const STEPS = ['Personal', 'Health', 'Language'];
const GENDERS = [
  { val: 'male', label: 'Male', icon: '\u{1F468}' },
  { val: 'female', label: 'Female', icon: '\u{1F469}' },
  { val: 'other', label: 'Other', icon: '\u{1F9D1}' },
];
const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const LANGUAGES = [
  { val: 'en', label: 'English', sub: 'English' },
  { val: 'hi', label: 'हिंदी', sub: 'Hindi' },
  { val: 'hinglish', label: 'Hinglish', sub: 'Hindi + English' },
];

export default function ProfileSetupScreen({ navigation, route }) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [language, setLanguage] = useState('en');
  const [loading, setLoading] = useState(false);
  const progress = useRef(new Animated.Value(0)).current;
  const setUser = useAppStore((s) => s.setUser);
  const setLanguagePref = useAppStore((s) => s.setLanguage);

  const animateProgress = (toStep) => {
    Animated.timing(progress, {
      toValue: (toStep / (STEPS.length - 1)) * 100,
      duration: 350, useNativeDriver: false,
    }).start();
  };

  const goNext = () => {
    if (step === 0) {
      if (!name.trim()) { Alert.alert('Required', 'Enter your full name'); return; }
      if (!age || parseInt(age) < 5 || parseInt(age) > 100) { Alert.alert('Required', 'Enter a valid age'); return; }
      if (!gender) { Alert.alert('Required', 'Select your gender'); return; }
    }
    const next = step + 1;
    setStep(next);
    animateProgress(next);
  };

  const goBack = () => {
    if (step === 0) { navigation.goBack(); return; }
    const prev = step - 1;
    setStep(prev);
    animateProgress(prev);
  };

  const handleSave = async () => {
    setLoading(true);
    const userData = { name: name.trim(), age: parseInt(age), gender, bloodGroup, height, weight, language };
    try {
      const uid = auth().currentUser?.uid || route.params?.uid;
      if (uid) {
        await saveUserProfile(uid, userData);
      }
      const user = { id: uid, ...userData };
      await AsyncStorage.setItem('user_data', JSON.stringify(user));
      setUser(user);
      setLanguagePref(language);
      navigation.replace('MainTabs');
    } catch (err) {
      const user = { id: route.params?.uid, ...userData };
      await AsyncStorage.setItem('user_data', JSON.stringify(user));
      setUser(user);
      setLanguagePref(language);
      navigation.replace('MainTabs');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      {/* Header */}
      <LinearGradient colors={GRADIENTS.hero} style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={goBack}>
          <Ionicons name="arrow-back" size={22} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Your Profile</Text>
        <Text style={styles.headerSub}>Step {step + 1} of {STEPS.length} {'\u{2014}'} {STEPS[step]}</Text>

        {/* Progress bar */}
        <View style={styles.progressTrack}>
          <Animated.View
            style={[styles.progressFill, {
              width: progress.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] }),
            }]}
          />
        </View>

        {/* Step pills */}
        <View style={styles.stepPills}>
          {STEPS.map((s, i) => (
            <View key={i} style={[styles.stepPill, i <= step && styles.stepPillActive]}>
              <Text style={[styles.stepPillText, i <= step && styles.stepPillTextActive]}>
                {i < step ? '\u{2714}' : i + 1}
              </Text>
              <Text style={[styles.stepPillLabel, i <= step && styles.stepPillLabelActive]}>{s}</Text>
            </View>
          ))}
        </View>
      </LinearGradient>

      {/* Card body */}
      <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

        {/* â”€ Step 0: Personal â”€ */}
        {step === 0 && (
          <View>
            <Text style={styles.sectionTitle}>Personal Details</Text>

            <Text style={styles.fieldLabel}>Full Name</Text>
            <View style={styles.inputWrap}>
              <Ionicons name="person-outline" size={18} color={COLORS.textLight} style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="Rahul Sharma"
                placeholderTextColor={COLORS.textLight}
                value={name} onChangeText={setName}
              />
            </View>

            <Text style={styles.fieldLabel}>Age</Text>
            <View style={[styles.inputWrap, { width: '40%' }]}>
              <Ionicons name="calendar-outline" size={18} color={COLORS.textLight} style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="28"
                placeholderTextColor={COLORS.textLight}
                keyboardType="number-pad" maxLength={3}
                value={age} onChangeText={setAge}
              />
            </View>

            <Text style={styles.fieldLabel}>Gender</Text>
            <View style={styles.genderRow}>
              {GENDERS.map((g) => (
                <TouchableOpacity
                  key={g.val}
                  style={[styles.genderCard, gender === g.val && styles.genderCardActive]}
                  onPress={() => setGender(g.val)}
                >
                  <Text style={styles.genderIcon}>{g.icon}</Text>
                  <Text style={[styles.genderLabel, gender === g.val && styles.genderLabelActive]}>{g.label}</Text>
                  {gender === g.val && (
                    <View style={styles.genderCheck}>
                      <Ionicons name="checkmark" size={12} color="#111827" />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* â”€ Step 1: Health â”€ */}
        {step === 1 && (
          <View>
            <Text style={styles.sectionTitle}>Health Info <Text style={styles.optional}>(Optional)</Text></Text>

            <Text style={styles.fieldLabel}>Blood Group</Text>
            <View style={styles.chipGrid}>
              {BLOOD_GROUPS.map((bg) => (
                <TouchableOpacity
                  key={bg}
                  style={[styles.chip, bloodGroup === bg && styles.chipActive]}
                  onPress={() => setBloodGroup(bg)}
                >
                  <Text style={[styles.chipText, bloodGroup === bg && styles.chipTextActive]}>{bg}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.rowFields}>
              <View style={{ flex: 1 }}>
                <Text style={styles.fieldLabel}>Height (cm)</Text>
                <View style={styles.inputWrap}>
                  <TextInput
                    style={styles.textInput}
                    placeholder="175"
                    placeholderTextColor={COLORS.textLight}
                    keyboardType="number-pad" maxLength={3}
                    value={height} onChangeText={setHeight}
                  />
                  <Text style={styles.unit}>cm</Text>
                </View>
              </View>
              <View style={{ width: 16 }} />
              <View style={{ flex: 1 }}>
                <Text style={styles.fieldLabel}>Weight (kg)</Text>
                <View style={styles.inputWrap}>
                  <TextInput
                    style={styles.textInput}
                    placeholder="70"
                    placeholderTextColor={COLORS.textLight}
                    keyboardType="number-pad" maxLength={3}
                    value={weight} onChangeText={setWeight}
                  />
                  <Text style={styles.unit}>kg</Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* â”€ Step 2: Language â”€ */}
        {step === 2 && (
          <View>
            <Text style={styles.sectionTitle}>Communication Preference</Text>
            <Text style={styles.sectionSub}>Choose how the AI talks to you</Text>
            {LANGUAGES.map((l) => (
              <TouchableOpacity
                key={l.val}
                style={[styles.langCard, language === l.val && styles.langCardActive]}
                onPress={() => setLanguage(l.val)}
              >
                <View style={{ flex: 1 }}>
                  <Text style={[styles.langLabel, language === l.val && styles.langLabelActive]}>{l.label}</Text>
                  <Text style={styles.langSub}>{l.sub}</Text>
                </View>
                {language === l.val && (
                  <View style={styles.langCheck}>
                    <Ionicons name="checkmark" size={16} color="#111827" />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* CTA */}
        <TouchableOpacity
          style={[styles.ctaBtn, loading && styles.ctaBtnDisabled]}
          onPress={step < STEPS.length - 1 ? goNext : handleSave}
          disabled={loading}
          activeOpacity={0.85}
        >
          <LinearGradient colors={['#D4A017', '#B8860B']} style={styles.ctaGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
            <Text style={styles.ctaText}>
              {loading ? 'Setting up...' : step < STEPS.length - 1 ? 'Continue \u{2192}' : 'Get Started \u{2192}'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { paddingTop: 56, paddingBottom: 28, paddingHorizontal: 24 },
  backBtn: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.05)',
    alignItems: 'center', justifyContent: 'center', marginBottom: 16,
  },
  headerTitle: { fontFamily: FONTS.bold, fontSize: 22, color: '#111827', marginBottom: 4 },
  headerSub: { fontFamily: FONTS.regular, fontSize: 13, color: '#6B7280', marginBottom: 16 },
  progressTrack: { height: 4, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 2, marginBottom: 16 },
  progressFill: { height: 4, backgroundColor: '#D4A017', borderRadius: 2 },
  stepPills: { flexDirection: 'row', gap: 8 },
  stepPill: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.04)',
  },
  stepPillActive: { backgroundColor: 'rgba(212,160,23,0.3)' },
  stepPillText: { fontFamily: FONTS.bold, fontSize: 11, color: '#6B7280' },
  stepPillTextActive: { color: '#D4A017' },
  stepPillLabel: { fontFamily: FONTS.medium, fontSize: 11, color: '#6B7280' },
  stepPillLabelActive: { color: '#E6B422' },

  body: { flex: 1, backgroundColor: '#F3F4F6' },
  bodyContent: { padding: 24, paddingBottom: 40 },

  sectionTitle: { fontFamily: FONTS.bold, fontSize: 20, color: COLORS.text, marginBottom: 6 },
  sectionSub: { fontFamily: FONTS.regular, fontSize: 13, color: COLORS.textSecondary, marginBottom: 20 },
  optional: { fontFamily: FONTS.regular, fontSize: 14, color: COLORS.textLight },
  fieldLabel: { fontFamily: FONTS.semiBold, fontSize: 13, color: COLORS.text, marginBottom: 8, marginTop: 16 },

  inputWrap: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1.5, borderColor: '#E5E7EB', borderRadius: 14,
    paddingHorizontal: 14, backgroundColor: '#FFFFFF',
  },
  inputIcon: { marginRight: 10 },
  textInput: { flex: 1, paddingVertical: 14, fontFamily: FONTS.medium, fontSize: 15, color: COLORS.text },
  unit: { fontFamily: FONTS.medium, fontSize: 13, color: COLORS.textSecondary },

  genderRow: { flexDirection: 'row', gap: 12, marginTop: 4 },
  genderCard: {
    flex: 1, paddingVertical: 16, borderRadius: 16, alignItems: 'center',
    borderWidth: 1.5, borderColor: '#E5E7EB', backgroundColor: '#FFFFFF',
    position: 'relative',
  },
  genderCardActive: { borderColor: '#D4A017', backgroundColor: '#1A1A0A' },
  genderIcon: { fontSize: 28, marginBottom: 6 },
  genderLabel: { fontFamily: FONTS.semiBold, fontSize: 13, color: COLORS.textSecondary },
  genderLabelActive: { color: '#D4A017' },
  genderCheck: {
    position: 'absolute', top: 8, right: 8,
    width: 20, height: 20, borderRadius: 10,
    backgroundColor: '#D4A017', alignItems: 'center', justifyContent: 'center',
  },

  chipGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 4 },
  chip: {
    paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20,
    borderWidth: 1.5, borderColor: '#E5E7EB', backgroundColor: '#FFFFFF',
  },
  chipActive: { borderColor: '#D4A017', backgroundColor: '#1A1A0A' },
  chipText: { fontFamily: FONTS.medium, fontSize: 14, color: COLORS.textSecondary },
  chipTextActive: { color: '#D4A017', fontFamily: FONTS.semiBold },

  rowFields: { flexDirection: 'row' },

  langCard: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1.5, borderColor: '#E5E7EB', borderRadius: 16,
    padding: 18, marginBottom: 12, backgroundColor: '#FFFFFF',
  },
  langCardActive: { borderColor: '#D4A017', backgroundColor: '#1A1A0A' },
  langLabel: { fontFamily: FONTS.semiBold, fontSize: 16, color: COLORS.text },
  langLabelActive: { color: '#D4A017' },
  langSub: { fontFamily: FONTS.regular, fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  langCheck: {
    width: 28, height: 28, borderRadius: 14, backgroundColor: '#D4A017',
    alignItems: 'center', justifyContent: 'center',
  },

  ctaBtn: { borderRadius: 14, overflow: 'hidden', marginTop: 32 },
  ctaBtnDisabled: { opacity: 0.6 },
  ctaGradient: { paddingVertical: 16, alignItems: 'center' },
  ctaText: { fontFamily: FONTS.bold, fontSize: 16, color: '#0B0B0B' },
});
