import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator,
} from 'react-native';
import { COLORS, CONCERNS } from '../../utils/constants';
import useAppStore from '../../store/useAppStore';

const GEMINI_API_KEY = 'AIzaSyDGW6VRp31lGuRF3JIhpIcTQpwa-b71AM8';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

const FALLBACK_ANALYSIS = {
  rootCause: 'Chronic Stress + Nutritional Deficiency',
  rootCauseHi: 'पुराना तनाव + पोषण की कमी',
  explanation:
    'Your concerns share a common root cause: chronic stress affecting hormonal balance and depleted nutrition. This creates a cascade effect across multiple body systems.',
  recommendations: [
    { icon: '😴', text: 'Fix sleep first — 7-8 hours daily (नींद 7-8 घंटे)' },
    { icon: '🥗', text: 'Add Iron, Zinc, Vitamin D to your diet (पोषण बढ़ाएं)' },
    { icon: '🧘', text: '10 min daily meditation to reduce stress (ध्यान करें)' },
    { icon: '💧', text: 'Drink 3 liters water daily (पानी 3 लीटर रोज)' },
  ],
  doctorRecommended: true,
};

async function fetchRootCauseFromGemini(concerns) {
  const concernLabels = concerns.map((id) => {
    const c = CONCERNS.find((x) => x.id === id);
    return c ? `${c.label} (${c.labelHi})` : id;
  }).join(', ');

  const prompt = `You are an expert Indian health analyst. A patient has the following health concerns: ${concernLabels}.

Analyze these concerns and identify their common root cause. Return ONLY valid JSON (no markdown, no explanation outside JSON):
{
  "rootCause": "Root cause in English (max 8 words)",
  "rootCauseHi": "Root cause in Hindi (max 8 words)",
  "explanation": "2-3 sentence explanation in English about how these concerns are connected",
  "recommendations": [
    {"icon": "emoji", "text": "actionable recommendation in English with Hindi in brackets"},
    {"icon": "emoji", "text": "recommendation 2"},
    {"icon": "emoji", "text": "recommendation 3"},
    {"icon": "emoji", "text": "recommendation 4"}
  ],
  "doctorRecommended": true
}`;

  const response = await fetch(GEMINI_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.4, maxOutputTokens: 600 },
    }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error?.message || 'Gemini error');
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('No JSON in response');
  return JSON.parse(jsonMatch[0]);
}

export default function RootCauseScreen({ navigation }) {
  const selectedConcerns = useAppStore((s) => s.selectedConcerns);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const result = await fetchRootCauseFromGemini(selectedConcerns);
        setAnalysis(result);
      } catch {
        setAnalysis(FALLBACK_ANALYSIS);
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
  back: { color: '#4B5563', marginBottom: 12 },
  heading: { fontSize: 22, fontWeight: 'bold', color: '#111827' },
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
  doctorCTATitle: { fontSize: 18, fontWeight: 'bold', color: '#111827', marginBottom: 8 },
  doctorCTASub: { fontSize: 14, color: '#B3D4FF', marginBottom: 16 },
  doctorBtn: {
    backgroundColor: COLORS.white, borderRadius: 10, paddingVertical: 14, alignItems: 'center',
  },
  doctorBtnText: { color: COLORS.primary, fontWeight: 'bold', fontSize: 15 },
});
