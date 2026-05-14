import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Slider,
} from 'react-native';
import { COLORS, CONCERNS } from '../../utils/constants';
import { progressAPI } from '../../utils/api';
import useAppStore from '../../store/useAppStore';

export default function WeeklyCheckInScreen({ navigation }) {
  const selectedConcerns = useAppStore((s) => s.selectedConcerns);
  const [scores, setScores] = useState({});
  const [mood, setMood] = useState('');
  const [loading, setLoading] = useState(false);

  const MOODS = ['😞 Bad', '😐 Okay', '🙂 Good', '😊 Great', '🤩 Amazing'];

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await progressAPI.addLog({ scores, mood, date: new Date().toISOString() });
    } catch {}
    Alert.alert(
      '✅ Check-in Saved!',
      'Great job checking in! Keep up the streak 🔥',
      [{ text: 'OK', onPress: () => navigation.navigate('Dashboard') }]
    );
    setLoading(false);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>
        <Text style={styles.heading}>Weekly Check-in</Text>
        <Text style={styles.sub}>इस हफ्ते आप कैसा महसूस कर रहे हैं?</Text>
      </View>

      {/* Mood */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>आज का मूड (Today's Mood)</Text>
        <View style={styles.moodRow}>
          {MOODS.map((m) => (
            <TouchableOpacity
              key={m}
              style={[styles.moodBtn, mood === m && styles.moodBtnSelected]}
              onPress={() => setMood(m)}
            >
              <Text style={styles.moodText}>{m}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Per concern score */}
      {selectedConcerns.map((id) => {
        const concern = CONCERNS.find((c) => c.id === id);
        const score = scores[id] || 5;
        return (
          <View key={id} style={styles.section}>
            <Text style={styles.sectionTitle}>
              {concern?.icon} {concern?.labelHi || id} — कितना सुधार?
            </Text>
            <Text style={styles.scoreDisplay}>{score}/10</Text>
            <View style={styles.sliderRow}>
              <Text style={styles.sliderLabel}>Bad</Text>
              <View style={styles.manualSlider}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((v) => (
                  <TouchableOpacity
                    key={v}
                    style={[styles.sliderDot, v <= score && { backgroundColor: concern?.color || COLORS.primary }]}
                    onPress={() => setScores((prev) => ({ ...prev, [id]: v }))}
                  />
                ))}
              </View>
              <Text style={styles.sliderLabel}>Great</Text>
            </View>
          </View>
        );
      })}

      <TouchableOpacity
        style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text style={styles.submitBtnText}>
          {loading ? 'Saving...' : '✅ Submit Check-in'}
        </Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { backgroundColor: COLORS.primary, padding: 20, paddingTop: 48 },
  back: { color: '#fff', fontSize: 22, marginBottom: 8 },
  heading: { fontSize: 22, fontWeight: 'bold', color: '#fff' },
  sub: { fontSize: 13, color: '#B3D4FF', marginTop: 4 },
  section: { backgroundColor: COLORS.white, margin: 16, borderRadius: 12, padding: 16, marginBottom: 0, marginTop: 16 },
  sectionTitle: { fontSize: 15, fontWeight: 'bold', color: COLORS.text, marginBottom: 14 },
  moodRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  moodBtn: {
    paddingHorizontal: 12, paddingVertical: 8,
    borderRadius: 20, borderWidth: 1.5, borderColor: COLORS.border,
  },
  moodBtnSelected: { borderColor: COLORS.primary, backgroundColor: '#E8F0FE' },
  moodText: { fontSize: 13 },
  scoreDisplay: { fontSize: 28, fontWeight: 'bold', color: COLORS.primary, textAlign: 'center', marginBottom: 12 },
  sliderRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sliderLabel: { fontSize: 11, color: COLORS.textSecondary, width: 30 },
  manualSlider: { flex: 1, flexDirection: 'row', gap: 4 },
  sliderDot: {
    flex: 1, height: 16, borderRadius: 4,
    backgroundColor: COLORS.border,
  },
  submitBtn: {
    backgroundColor: COLORS.primary, margin: 16, borderRadius: 12,
    paddingVertical: 16, alignItems: 'center',
  },
  submitBtnDisabled: { opacity: 0.6 },
  submitBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
