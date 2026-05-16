import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  StatusBar, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, GRADIENTS, FONTS } from '../../utils/constants';

const REPORTS = [
  {
    id: '1', type: 'Blood Test', date: 'May 10, 2026', doctor: 'Dr. Priya Sharma',
    status: 'normal', icon: '🩸', tests: ['Haemoglobin: 13.5 g/dL ✓', 'Ferritin: 24 ng/mL ⚠️ (Low)', 'Vitamin D: 18 ng/mL ⚠️ (Low)'],
  },
  {
    id: '2', type: 'Thyroid Panel', date: 'Apr 28, 2026', doctor: 'Dr. Rajan Mehta',
    status: 'attention', icon: '🧪', tests: ['TSH: 4.8 mIU/L ⚠️', 'T3: 1.1 ng/mL ✓', 'T4: 7.8 μg/dL ✓'],
  },
  {
    id: '3', type: 'Vitamin Panel', date: 'Apr 15, 2026', doctor: 'Self-uploaded',
    status: 'normal', icon: '💊', tests: ['Vitamin B12: 280 pg/mL ✓', 'Vitamin D: 24 ng/mL ✓', 'Zinc: 68 μg/dL ✓'],
  },
];

const UPLOAD_TYPES = [
  { label: 'Blood Test', icon: '🩸', gradient: ['#DC2626', '#F87171'] },
  { label: 'Scan/X-Ray', icon: '🔬', gradient: ['#059669', '#34D399'] },
  { label: 'Prescription', icon: '📋', gradient: ['#D4A017', '#E6B422'] },
  { label: 'Other Report', icon: '📄', gradient: ['#D97706', '#FBBF24'] },
];

export default function LabReportsScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('reports');

  return (
    <View style={styles.root}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      <LinearGradient colors={['#1E1B4B', '#4338CA']} style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color="#111827" />
        </TouchableOpacity>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.headerTitle}>Lab Reports</Text>
            <Text style={styles.headerSub}>Your health vault & reports</Text>
          </View>
          <TouchableOpacity
            style={styles.uploadBtn}
            onPress={() => Alert.alert('Upload Report', 'Select report type to upload')}
          >
            <Ionicons name="cloud-upload-outline" size={18} color="#111827" />
            <Text style={styles.uploadBtnText}>Upload</Text>
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View style={styles.tabRow}>
          {[['reports', 'My Reports'], ['upload', 'Upload New']].map(([key, label]) => (
            <TouchableOpacity
              key={key}
              style={[styles.tab, activeTab === key && styles.tabActive]}
              onPress={() => setActiveTab(key)}
            >
              <Text style={[styles.tabText, activeTab === key && styles.tabTextActive]}>{label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </LinearGradient>

      {activeTab === 'reports' ? (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.body}>
          {/* AI Insights banner */}
          <View style={styles.insightBanner}>
            <LinearGradient colors={['#D4A017', '#B8860B']} style={styles.insightGrad}>
              <Text style={styles.insightIcon}>🤖</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.insightTitle}>AI found 2 deficiencies</Text>
                <Text style={styles.insightSub}>Low Ferritin & Vitamin D may be causing your hair fall. Tap to see treatment plan.</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.8)" />
            </LinearGradient>
          </View>

          {/* Reports list */}
          {REPORTS.map((r) => (
            <View key={r.id} style={styles.reportCard}>
              <View style={styles.reportHeader}>
                <View style={styles.reportIconWrap}>
                  <Text style={{ fontSize: 24 }}>{r.icon}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.reportType}>{r.type}</Text>
                  <Text style={styles.reportMeta}>{r.doctor} • {r.date}</Text>
                </View>
                <View style={[
                  styles.statusBadge,
                  { backgroundColor: r.status === 'normal' ? COLORS.successBg : COLORS.warningBg }
                ]}>
                  <Text style={[
                    styles.statusText,
                    { color: r.status === 'normal' ? COLORS.success : COLORS.warning }
                  ]}>
                    {r.status === 'normal' ? '✓ Normal' : '⚠️ Attention'}
                  </Text>
                </View>
              </View>

              <View style={styles.testsWrap}>
                {r.tests.map((t, i) => (
                  <Text key={i} style={[
                    styles.testItem,
                    t.includes('⚠️') && { color: COLORS.warning, fontFamily: FONTS.semiBold }
                  ]}>{t}</Text>
                ))}
              </View>

              <View style={styles.reportActions}>
                <TouchableOpacity style={styles.actionBtn}>
                  <Ionicons name="download-outline" size={14} color={COLORS.primary} />
                  <Text style={styles.actionText}>Download PDF</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('SymptomChat')}>
                  <Ionicons name="chatbubble-outline" size={14} color={COLORS.primary} />
                  <Text style={styles.actionText}>Ask AI</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}

          <View style={{ height: 100 }} />
        </ScrollView>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.body}>
          <Text style={styles.uploadTitle}>What would you like to upload?</Text>
          <View style={styles.uploadGrid}>
            {UPLOAD_TYPES.map((u, i) => (
              <TouchableOpacity
                key={i}
                style={styles.uploadCard}
                onPress={() => Alert.alert('Upload', `Upload ${u.label}`)}
                activeOpacity={0.85}
              >
                <LinearGradient colors={u.gradient} style={styles.uploadCardGrad}>
                  <Text style={styles.uploadCardIcon}>{u.icon}</Text>
                  <Text style={styles.uploadCardLabel}>{u.label}</Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.uploadInfoBox}>
            <Ionicons name="shield-checkmark" size={20} color={COLORS.success} />
            <View style={{ flex: 1 }}>
              <Text style={styles.uploadInfoTitle}>100% Private & Encrypted</Text>
              <Text style={styles.uploadInfoSub}>Your reports are encrypted and only accessible by you and your treating doctor.</Text>
            </View>
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },
  header: { paddingTop: 56, paddingBottom: 20, paddingHorizontal: 20 },
  backBtn: {
    width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(0,0,0,0.05)',
    alignItems: 'center', justifyContent: 'center', marginBottom: 14,
  },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  headerTitle: { fontFamily: FONTS.bold, fontSize: 22, color: '#111827', marginBottom: 4 },
  headerSub: { fontFamily: FONTS.regular, fontSize: 12, color: '#6B7280' },
  uploadBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 9,
  },
  uploadBtnText: { fontFamily: FONTS.semiBold, fontSize: 13, color: '#111827' },
  tabRow: {
    flexDirection: 'row', backgroundColor: 'rgba(0,0,0,0.04)',
    borderRadius: 12, padding: 3,
  },
  tab: { flex: 1, paddingVertical: 9, borderRadius: 10, alignItems: 'center' },
  tabActive: { backgroundColor: 'rgba(255,255,255,0.2)' },
  tabText: { fontFamily: FONTS.medium, fontSize: 13, color: '#6B7280' },
  tabTextActive: { fontFamily: FONTS.semiBold, color: '#111827' },

  body: { padding: 16 },
  insightBanner: { borderRadius: 18, overflow: 'hidden', marginBottom: 16 },
  insightGrad: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12 },
  insightIcon: { fontSize: 28 },
  insightTitle: { fontFamily: FONTS.bold, fontSize: 14, color: '#111827', marginBottom: 4 },
  insightSub: { fontFamily: FONTS.regular, fontSize: 12, color: '#4B5563', lineHeight: 17 },

  reportCard: {
    backgroundColor: COLORS.white, borderRadius: 18, padding: 16,
    marginBottom: 14, shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 1, shadowRadius: 12, elevation: 4,
  },
  reportHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 14, gap: 12 },
  reportIconWrap: {
    width: 48, height: 48, borderRadius: 14, backgroundColor: COLORS.cream,
    alignItems: 'center', justifyContent: 'center',
  },
  reportType: { fontFamily: FONTS.bold, fontSize: 15, color: COLORS.text },
  reportMeta: { fontFamily: FONTS.regular, fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  statusBadge: { borderRadius: 10, paddingHorizontal: 10, paddingVertical: 5 },
  statusText: { fontFamily: FONTS.bold, fontSize: 11 },
  testsWrap: { backgroundColor: COLORS.background, borderRadius: 12, padding: 12, marginBottom: 12 },
  testItem: { fontFamily: FONTS.regular, fontSize: 13, color: COLORS.text, paddingVertical: 3 },
  reportActions: { flexDirection: 'row', gap: 8 },
  actionBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, backgroundColor: COLORS.primaryBg, borderRadius: 10, paddingVertical: 10,
  },
  actionText: { fontFamily: FONTS.semiBold, fontSize: 12, color: COLORS.primary },

  uploadTitle: { fontFamily: FONTS.bold, fontSize: 18, color: COLORS.text, marginBottom: 16 },
  uploadGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 20 },
  uploadCard: { width: '47%', borderRadius: 18, overflow: 'hidden' },
  uploadCardGrad: { padding: 24, alignItems: 'center', gap: 10 },
  uploadCardIcon: { fontSize: 36 },
  uploadCardLabel: { fontFamily: FONTS.bold, fontSize: 14, color: '#111827' },
  uploadInfoBox: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 12,
    backgroundColor: COLORS.successBg, borderRadius: 16, padding: 16,
  },
  uploadInfoTitle: { fontFamily: FONTS.bold, fontSize: 14, color: COLORS.text, marginBottom: 4 },
  uploadInfoSub: { fontFamily: FONTS.regular, fontSize: 12, color: COLORS.textSecondary, lineHeight: 18 },
});
