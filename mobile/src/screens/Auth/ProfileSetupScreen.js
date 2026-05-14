import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  ScrollView, Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '../../utils/constants';
import { authAPI } from '../../utils/api';
import useAppStore from '../../store/useAppStore';

const GENDERS = ['Male / पुरुष', 'Female / महिला', 'Other / अन्य'];

export default function ProfileSetupScreen({ navigation }) {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [language, setLanguage] = useState('hi');
  const [loading, setLoading] = useState(false);
  const setUser = useAppStore((s) => s.setUser);
  const setLanguagePref = useAppStore((s) => s.setLanguage);

  const handleSave = async () => {
    if (!name.trim() || !age || !gender) {
      Alert.alert('जरूरी है', 'Please fill all fields');
      return;
    }
    setLoading(true);
    try {
      const res = await authAPI.setupProfile({ name: name.trim(), age: parseInt(age), gender, language });
      const user = res.data.user;
      await AsyncStorage.setItem('user_data', JSON.stringify(user));
      setUser(user);
      setLanguagePref(language);
      navigation.replace('ProblemSelect');
    } catch {
      // Dev mode
      const user = { id: 1, name: name.trim(), age: parseInt(age), gender, language };
      await AsyncStorage.setItem('user_data', JSON.stringify(user));
      setUser(user);
      setLanguagePref(language);
      navigation.replace('ProblemSelect');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.heading}>अपना प्रोफाइल बनाएं</Text>
        <Text style={styles.sub}>Set up your profile to get personalized health support</Text>

        <Text style={styles.label}>पूरा नाम (Full Name)</Text>
        <TextInput
          style={styles.input}
          placeholder="आपका नाम"
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>उम्र (Age)</Text>
        <TextInput
          style={styles.input}
          placeholder="Age"
          keyboardType="number-pad"
          maxLength={3}
          value={age}
          onChangeText={setAge}
        />

        <Text style={styles.label}>लिंग (Gender)</Text>
        <View style={styles.optionRow}>
          {GENDERS.map((g) => (
            <TouchableOpacity
              key={g}
              style={[styles.option, gender === g && styles.optionSelected]}
              onPress={() => setGender(g)}
            >
              <Text style={[styles.optionText, gender === g && styles.optionTextSelected]}>
                {g}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>भाषा (Language Preference)</Text>
        <View style={styles.optionRow}>
          {[
            { val: 'hi', label: 'हिंदी' },
            { val: 'en', label: 'English' },
          ].map((l) => (
            <TouchableOpacity
              key={l.val}
              style={[styles.option, language === l.val && styles.optionSelected]}
              onPress={() => setLanguage(l.val)}
            >
              <Text style={[styles.optionText, language === l.val && styles.optionTextSelected]}>
                {l.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.btn, loading && styles.btnDisabled]}
          onPress={handleSave}
          disabled={loading}
        >
          <Text style={styles.btnText}>{loading ? 'Saving...' : 'जारी रखें (Continue)'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  scroll: { padding: 24, paddingTop: 48 },
  heading: { fontSize: 24, fontWeight: 'bold', color: COLORS.text, marginBottom: 8 },
  sub: { fontSize: 14, color: COLORS.textSecondary, marginBottom: 28 },
  label: { fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: 8 },
  input: {
    borderWidth: 1.5, borderColor: COLORS.border,
    borderRadius: 10, paddingHorizontal: 16, paddingVertical: 12,
    fontSize: 16, marginBottom: 20,
  },
  optionRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  option: {
    paddingHorizontal: 16, paddingVertical: 10,
    borderWidth: 1.5, borderColor: COLORS.border,
    borderRadius: 8,
  },
  optionSelected: { borderColor: COLORS.primary, backgroundColor: '#E8F0FE' },
  optionText: { fontSize: 14, color: COLORS.text },
  optionTextSelected: { color: COLORS.primary, fontWeight: '600' },
  btn: {
    backgroundColor: COLORS.primary, borderRadius: 12,
    paddingVertical: 16, alignItems: 'center', marginTop: 8,
  },
  btnDisabled: { opacity: 0.6 },
  btnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
