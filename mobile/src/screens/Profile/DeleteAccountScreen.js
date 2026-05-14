import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, TextInput,
} from 'react-native';
import { COLORS } from '../../utils/constants';
import useAppStore from '../../store/useAppStore';

export default function DeleteAccountScreen({ navigation }) {
  const [confirmed, setConfirmed] = useState('');
  const logout = useAppStore((s) => s.logout);

  const handleDelete = async () => {
    if (confirmed !== 'DELETE') {
      Alert.alert('Confirm', 'Please type DELETE to confirm');
      return;
    }
    Alert.alert(
      '⚠️ Delete Account',
      'This will permanently delete ALL your data — health records, prescriptions, conversations. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Forever',
          style: 'destructive',
          onPress: async () => {
            await logout();
            navigation.replace('Login');
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>
        <Text style={styles.heading}>Delete Account</Text>
      </View>

      <View style={styles.warningCard}>
        <Text style={styles.warningIcon}>⚠️</Text>
        <Text style={styles.warningTitle}>यह action permanent है!</Text>
        <Text style={styles.warningText}>
          This will delete:{'\n'}
          • All your health records{'\n'}
          • All AI conversations{'\n'}
          • All prescriptions{'\n'}
          • Your subscription{'\n'}
          • All progress data{'\n\n'}
          This CANNOT be undone.
        </Text>
      </View>

      <View style={styles.rightsCard}>
        <Text style={styles.rightsTitle}>Your DPDP Act 2023 Rights</Text>
        <Text style={styles.rightsText}>
          Under India's Digital Personal Data Protection Act 2023, you have the right to delete all your personal data. We will process your request within 24 hours.
        </Text>
      </View>

      <View style={styles.confirmSection}>
        <Text style={styles.confirmLabel}>
          Confirm by typing <Text style={styles.deleteWord}>DELETE</Text> below:
        </Text>
        <TextInput
          style={[styles.input, confirmed === 'DELETE' && styles.inputValid]}
          placeholder="Type DELETE here"
          value={confirmed}
          onChangeText={setConfirmed}
          autoCapitalize="characters"
        />
      </View>

      <TouchableOpacity
        style={[styles.deleteBtn, confirmed !== 'DELETE' && styles.deleteBtnDisabled]}
        onPress={handleDelete}
        disabled={confirmed !== 'DELETE'}
      >
        <Text style={styles.deleteBtnText}>🗑️ Delete My Account Forever</Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { backgroundColor: COLORS.error, padding: 20, paddingTop: 48 },
  back: { color: '#fff', fontSize: 22, marginBottom: 8 },
  heading: { fontSize: 22, fontWeight: 'bold', color: '#fff' },
  warningCard: {
    backgroundColor: '#FEE8E8', margin: 16, borderRadius: 12, padding: 20, alignItems: 'center',
  },
  warningIcon: { fontSize: 40, marginBottom: 12 },
  warningTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.error, marginBottom: 12 },
  warningText: { fontSize: 14, color: COLORS.text, lineHeight: 24 },
  rightsCard: { backgroundColor: '#E8F0FE', marginHorizontal: 16, borderRadius: 12, padding: 16, marginBottom: 16 },
  rightsTitle: { fontSize: 14, fontWeight: 'bold', color: COLORS.primary, marginBottom: 8 },
  rightsText: { fontSize: 13, color: COLORS.text, lineHeight: 20 },
  confirmSection: { marginHorizontal: 16, marginBottom: 20 },
  confirmLabel: { fontSize: 14, color: COLORS.text, marginBottom: 10 },
  deleteWord: { color: COLORS.error, fontWeight: 'bold' },
  input: {
    borderWidth: 1.5, borderColor: COLORS.border, borderRadius: 10,
    paddingHorizontal: 16, paddingVertical: 12, fontSize: 16,
    backgroundColor: COLORS.white,
  },
  inputValid: { borderColor: COLORS.error, backgroundColor: '#FEE8E8' },
  deleteBtn: {
    backgroundColor: COLORS.error, marginHorizontal: 16,
    borderRadius: 12, paddingVertical: 16, alignItems: 'center',
  },
  deleteBtnDisabled: { backgroundColor: COLORS.border },
  deleteBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
