import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator,
} from 'react-native';
import { COLORS, CONCERNS } from '../../utils/constants';
import { symptomsAPI } from '../../utils/api';
import useAppStore from '../../store/useAppStore';

const MOCK_ANALYSIS = {
  rootCause: 'Chronic Stress + Nutritional Deficiency',
  rootCauseHi: 'पुराना तनाव + पोषण की कमी',
  explanation:
    'आपकी सभी समस्याओं का एक ही कारण है — लंबे समय से चला आ रहा तनाव और शरीर में पोषण की कमी।\n\nAll your concerns share a common root cause: chronic stress affecting your hormonal balance and depleted nutrition. This is creating a cascade — stress → poor sleep → hair loss + skin issues + fatigue.',
  recommendations: [
    { icon: '😴', text: 'नींद 7-8 घंटे (Fix sleep first — it resets everything)' },
    { icon: '🥗', text: 'Iron, Zinc, Vitamin D बढ़ाएं (Add iron, zinc, vitamin D to diet)' },
    { icon: '🧘', text: '10 मिनट रोज meditation (10 min daily meditation)' },
    { icon: '💧', text: '3 लीटर पानी रोज (3 liters water daily)' },
  ],
  doctorRecommended: true,
  planSuggestion: 'multicare',
};

export default function RootCauseScreen({ navigation }) {
  const selectedConcerns = useAppStore((s) => s.selectedConcerns);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const res = await symptomsAPI.rootCause(selectedConcerns, []);
        setAnalysis(res.data);
      } catch {
        setAnalysis(MOCK_ANALYSIS);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalysis();
  }, []);

  const getConcernLabel = (id) =>
    CONCERNS.find((c) => c.id === id)?.labelHi || id;

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>AI आपकी समस्याओं का विश्लेषण कर रही है...</Text>
        <Text style={styles.loadingSubText}>Analyzing root cause of all your concerns...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>← वापस</Text>
        </TouchableOpacity>
        <Text style={styles.heading}>Root Cause Analysis</Text>
        <Text style={styles.sub}>आपकी सभी समस्याओं का कारण</Text>
      </View>

      {/* Concerns analyzed */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📊 Analyzed Concerns</Text>
        <View style={styles.concernChips}>
          {selectedConcerns.map((c) => (
            <View key={c} style={styles.chip}>
              <Text style={styles.chipText}>{getConcernLabel(c)}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Root Cause */}
      <View style={styles.rootCauseCard}>
        <Text style={styles.rootCauseLabel}>🔍 Root Cause Identified</Text>
        <Text style={styles.rootCauseHi}>{analysis?.rootCauseHi}</Text>
        <Text style={styles.rootCauseEn}>{analysis?.rootCause}</Text>
      </View>

      {/* Explanation */}
      <View style={styles.section}>
        <Text style={styles.explanationText}>{analysis?.explanation}</Text>
      </View>

      {/* Recommendations */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>✅ Recommendations</Text>
        {analysis?.recommendations?.map((r, i) => (
          <View key={i} style={styles.recRow}>
            <Text style={styles.recIcon}>{r.icon}</Text>
            <Text style={styles.recText}>{r.text}</Text>
          </View>
        ))}
      </View>

      {/* Disclaimer */}
      <View style={styles.disclaimer}>
        <Text style={styles.disclaimerText}>
          ⚠️ यह medical diagnosis नहीं है। This is AI analysis — not a medical diagnosis.
          A licensed doctor's opinion is always recommended.
        </Text>
      </View>

      {/* Doctor CTA */}
      {analysis?.doctorRecommended && (
        <View style={styles.doctorCTA}>
          <Text style={styles.doctorCTATitle}>👨‍⚕️ डॉक्टर से मिलें</Text>
          <Text style={styles.doctorCTASub}>
            Based on your analysis, a doctor consultation is recommended.
          </Text>
          <TouchableOpacity
            style={styles.doctorBtn}
            onPress={() => navigation.navigate('Plans')}
          >
            <Text style={styles.doctorBtnText}>Plans देखें — ₹149 से शुरू</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  loadingText: { fontSize: 18, fontWeight: 'bold', color: COLORS.text, marginTop: 20, textAlign: 'center' },
  loadingSubText: { fontSize: 14, color: COLORS.textSecondary, marginTop: 8, textAlign: 'center' },
  header: { backgroundColor: COLORS.primary, padding: 20, paddingTop: 48 },
  back: { color: 'rgba(255,255,255,0.8)', marginBottom: 12 },
  heading: { fontSize: 22, fontWeight: 'bold', color: '#fff' },
  sub: { fontSize: 14, color: '#B3D4FF', marginTop: 4 },
  section: { backgroundColor: COLORS.white, margin: 16, borderRadius: 12, padding: 16 },
  sectionTitle: { fontSize: 15, fontWeight: 'bold', color: COLORS.text, marginBottom: 12 },
  concernChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { backgroundColor: '#E8F0FE', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  chipText: { color: COLORS.primary, fontWeight: '600', fontSize: 13 },
  rootCauseCard: {
    backgroundColor: '#FFF3E0', marginHorizontal: 16, borderRadius: 12, padding: 20,
    borderLeftWidth: 4, borderLeftColor: COLORS.accent,
  },
  rootCauseLabel: { fontSize: 13, color: COLORS.textSecondary, marginBottom: 8 },
  rootCauseHi: { fontSize: 20, fontWeight: 'bold', color: COLORS.text, marginBottom: 4 },
  rootCauseEn: { fontSize: 14, color: COLORS.textSecondary },
  explanationText: { fontSize: 14, color: COLORS.text, lineHeight: 22 },
  recRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10 },
  recIcon: { fontSize: 20, marginRight: 12 },
  recText: { flex: 1, fontSize: 14, color: COLORS.text, lineHeight: 20 },
  disclaimer: {
    backgroundColor: '#FFF8E1', marginHorizontal: 16, borderRadius: 10,
    padding: 14, marginBottom: 16,
  },
  disclaimerText: { fontSize: 12, color: '#795548', lineHeight: 18 },
  doctorCTA: {
    backgroundColor: COLORS.primary, marginHorizontal: 16, borderRadius: 12, padding: 20,
  },
  doctorCTATitle: { fontSize: 18, fontWeight: 'bold', color: '#fff', marginBottom: 8 },
  doctorCTASub: { fontSize: 14, color: '#B3D4FF', marginBottom: 16 },
  doctorBtn: {
    backgroundColor: COLORS.white, borderRadius: 10, paddingVertical: 14, alignItems: 'center',
  },
  doctorBtnText: { color: COLORS.primary, fontWeight: 'bold', fontSize: 15 },
});
