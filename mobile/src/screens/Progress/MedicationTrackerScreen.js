import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert,
} from 'react-native';
import { COLORS } from '../../utils/constants';
import { progressAPI } from '../../utils/api';

const MEDICINES = [
  { id: '1', name: 'Biotin 10mg', time: 'After Breakfast', icon: '💊' },
  { id: '2', name: 'Minoxidil 5%', time: 'Apply evening', icon: '🧴' },
  { id: '3', name: 'Vitamin D3', time: 'Weekly — Sunday', icon: '☀️' },
];

export default function MedicationTrackerScreen({ navigation }) {
  const [taken, setTaken] = useState({});

  const toggleMed = (id) => {
    setTaken((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSave = async () => {
    try {
      await progressAPI.addLog({
        date: new Date().toISOString(),
        medicationTaken: Object.values(taken).filter(Boolean).length,
        totalMeds: MEDICINES.length,
      });
    } catch {}
    Alert.alert('✅ Saved!', 'Your medication log has been saved.', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  const takenCount = Object.values(taken).filter(Boolean).length;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>
        <Text style={styles.heading}>Medication Tracker</Text>
        <Text style={styles.sub}>आज की दवाइयां • Today's medicines</Text>
      </View>

      <View style={styles.summary}>
        <Text style={styles.summaryText}>
          {takenCount}/{MEDICINES.length} medicines taken today
        </Text>
        <View style={styles.summaryBar}>
          <View
            style={[styles.summaryFill, { width: `${(takenCount / MEDICINES.length) * 100}%` }]}
          />
        </View>
      </View>

      <View style={styles.list}>
        {MEDICINES.map((med) => (
          <TouchableOpacity
            key={med.id}
            style={[styles.medCard, taken[med.id] && styles.medCardTaken]}
            onPress={() => toggleMed(med.id)}
          >
            <Text style={styles.medIcon}>{med.icon}</Text>
            <View style={{ flex: 1 }}>
              <Text style={[styles.medName, taken[med.id] && styles.medNameTaken]}>
                {med.name}
              </Text>
              <Text style={styles.medTime}>{med.time}</Text>
            </View>
            <View style={[styles.checkbox, taken[med.id] && styles.checkboxChecked]}>
              {taken[med.id] && <Text style={styles.checkmark}>✓</Text>}
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
        <Text style={styles.saveBtnText}>Save Today's Log</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { backgroundColor: COLORS.primary, padding: 20, paddingTop: 48 },
  back: { color: '#fff', fontSize: 22, marginBottom: 8 },
  heading: { fontSize: 22, fontWeight: 'bold', color: '#fff' },
  sub: { fontSize: 13, color: '#B3D4FF', marginTop: 4 },
  summary: { backgroundColor: COLORS.white, margin: 16, borderRadius: 12, padding: 16 },
  summaryText: { fontSize: 15, fontWeight: 'bold', color: COLORS.text, marginBottom: 10 },
  summaryBar: { height: 10, backgroundColor: COLORS.border, borderRadius: 5, overflow: 'hidden' },
  summaryFill: { height: '100%', backgroundColor: COLORS.success, borderRadius: 5 },
  list: { paddingHorizontal: 16 },
  medCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.white, borderRadius: 12, padding: 16,
    marginBottom: 12, gap: 14,
    borderWidth: 2, borderColor: COLORS.border,
  },
  medCardTaken: { borderColor: COLORS.success, backgroundColor: '#E6F4EA' },
  medIcon: { fontSize: 28 },
  medName: { fontSize: 15, fontWeight: 'bold', color: COLORS.text },
  medNameTaken: { textDecorationLine: 'line-through', color: COLORS.textSecondary },
  medTime: { fontSize: 13, color: COLORS.textSecondary, marginTop: 2 },
  checkbox: {
    width: 28, height: 28, borderRadius: 14,
    borderWidth: 2, borderColor: COLORS.border,
    alignItems: 'center', justifyContent: 'center',
  },
  checkboxChecked: { backgroundColor: COLORS.success, borderColor: COLORS.success },
  checkmark: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  saveBtn: {
    backgroundColor: COLORS.primary, margin: 16, borderRadius: 12,
    paddingVertical: 16, alignItems: 'center',
  },
  saveBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
