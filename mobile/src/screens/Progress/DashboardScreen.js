import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator,
} from 'react-native';
import { COLORS, CONCERNS } from '../../utils/constants';
import { progressAPI } from '../../utils/api';
import useAppStore from '../../store/useAppStore';

const MOCK_DASHBOARD = {
  streak: 12,
  improvementScore: 68,
  weeklyData: [40, 45, 52, 58, 62, 65, 68],
  concerns: [
    { id: 'hair', score: 65, change: '+8%' },
    { id: 'stress', score: 72, change: '+12%' },
  ],
  totalDays: 30,
  medicationAdherence: 87,
};

export default function DashboardScreen({ navigation }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const streaks = useAppStore((s) => s.streaks);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await progressAPI.getDashboard();
        setData(res.data);
      } catch {
        setData(MOCK_DASHBOARD);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  const getScoreColor = (score) => {
    if (score >= 70) return COLORS.success;
    if (score >= 50) return COLORS.warning;
    return COLORS.error;
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.heading}>Health Dashboard</Text>
        <Text style={styles.sub}>आपकी स्वास्थ्य प्रगति</Text>
      </View>

      {/* Streak */}
      <View style={styles.streakCard}>
        <Text style={styles.streakFire}>🔥</Text>
        <View>
          <Text style={styles.streakCount}>{data?.streak || 0} Day Streak!</Text>
          <Text style={styles.streakSub}>लगातार {data?.streak || 0} दिन — Keep going!</Text>
        </View>
        <View style={styles.streakBadge}>
          <Text style={styles.streakBadgeText}>🏆</Text>
        </View>
      </View>

      {/* Overall score */}
      <View style={styles.scoreCard}>
        <Text style={styles.scoreLabel}>Overall Improvement</Text>
        <View style={styles.scoreRow}>
          <Text style={[styles.scoreValue, { color: getScoreColor(data?.improvementScore) }]}>
            {data?.improvementScore}%
          </Text>
          <Text style={styles.scoreSub}>in {data?.totalDays} days</Text>
        </View>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${data?.improvementScore}%`,
                backgroundColor: getScoreColor(data?.improvementScore),
              },
            ]}
          />
        </View>
      </View>

      {/* Week graph (simple bars) */}
      <View style={styles.graphCard}>
        <Text style={styles.graphTitle}>7-Day Progress</Text>
        <View style={styles.bars}>
          {(data?.weeklyData || []).map((val, i) => (
            <View key={i} style={styles.barCol}>
              <View style={[styles.bar, { height: (val / 100) * 80 }]} />
              <Text style={styles.barLabel}>{['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Per concern scores */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Concern-wise Progress</Text>
        {(data?.concerns || []).map((c) => {
          const concern = CONCERNS.find((x) => x.id === c.id);
          return (
            <View key={c.id} style={styles.concernRow}>
              <Text style={styles.concernIcon}>{concern?.icon}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.concernName}>{concern?.labelHi || c.id}</Text>
                <View style={styles.progressBar}>
                  <View
                    style={[styles.progressFill, { width: `${c.score}%`, backgroundColor: getScoreColor(c.score) }]}
                  />
                </View>
              </View>
              <Text style={[styles.concernScore, { color: getScoreColor(c.score) }]}>
                {c.score}% {c.change}
              </Text>
            </View>
          );
        })}
      </View>

      {/* Medication */}
      <View style={styles.medCard}>
        <Text style={styles.medTitle}>💊 Medication Adherence</Text>
        <Text style={[styles.medScore, { color: getScoreColor(data?.medicationAdherence) }]}>
          {data?.medicationAdherence}%
        </Text>
        <Text style={styles.medSub}>You took your medicines on time</Text>
      </View>

      {/* Actions */}
      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('WeeklyCheckIn')}>
          <Text style={styles.actionIcon}>📝</Text>
          <Text style={styles.actionText}>Weekly Check-in</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('MedicationTracker')}>
          <Text style={styles.actionIcon}>💊</Text>
          <Text style={styles.actionText}>Medication</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('Milestone')}>
          <Text style={styles.actionIcon}>🏆</Text>
          <Text style={styles.actionText}>Milestones</Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: 80 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  header: {
    backgroundColor: COLORS.primary, padding: 20, paddingTop: 48,
  },
  heading: { fontSize: 22, fontWeight: 'bold', color: '#111827' },
  sub: { fontSize: 14, color: '#B3D4FF', marginTop: 4 },
  streakCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#FFF3E0', margin: 16, borderRadius: 12, padding: 16, gap: 14,
  },
  streakFire: { fontSize: 32 },
  streakCount: { fontSize: 18, fontWeight: 'bold', color: COLORS.text },
  streakSub: { fontSize: 13, color: COLORS.textSecondary },
  streakBadge: { marginLeft: 'auto' },
  streakBadgeText: { fontSize: 28 },
  scoreCard: { backgroundColor: COLORS.white, marginHorizontal: 16, borderRadius: 12, padding: 16, marginBottom: 16 },
  scoreLabel: { fontSize: 14, color: COLORS.textSecondary, marginBottom: 8 },
  scoreRow: { flexDirection: 'row', alignItems: 'baseline', gap: 10, marginBottom: 12 },
  scoreValue: { fontSize: 36, fontWeight: 'bold' },
  scoreSub: { fontSize: 14, color: COLORS.textSecondary },
  progressBar: { height: 8, backgroundColor: COLORS.border, borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 4 },
  graphCard: { backgroundColor: COLORS.white, marginHorizontal: 16, borderRadius: 12, padding: 16, marginBottom: 16 },
  graphTitle: { fontSize: 14, fontWeight: 'bold', color: COLORS.text, marginBottom: 16 },
  bars: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end', height: 100 },
  barCol: { alignItems: 'center', gap: 4 },
  bar: { width: 28, backgroundColor: COLORS.primary, borderRadius: 4 },
  barLabel: { fontSize: 11, color: COLORS.textSecondary },
  section: { backgroundColor: COLORS.white, marginHorizontal: 16, borderRadius: 12, padding: 16, marginBottom: 16 },
  sectionTitle: { fontSize: 15, fontWeight: 'bold', color: COLORS.text, marginBottom: 14 },
  concernRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 14, gap: 10 },
  concernIcon: { fontSize: 22 },
  concernName: { fontSize: 13, color: COLORS.text, marginBottom: 6 },
  concernScore: { fontSize: 13, fontWeight: 'bold', marginLeft: 8 },
  medCard: {
    backgroundColor: '#E8F0FE', marginHorizontal: 16, borderRadius: 12,
    padding: 16, alignItems: 'center', marginBottom: 16,
  },
  medTitle: { fontSize: 14, fontWeight: 'bold', color: COLORS.text, marginBottom: 8 },
  medScore: { fontSize: 32, fontWeight: 'bold', marginBottom: 4 },
  medSub: { fontSize: 13, color: COLORS.textSecondary },
  actionRow: { flexDirection: 'row', justifyContent: 'space-around', marginHorizontal: 16 },
  actionBtn: {
    flex: 1, backgroundColor: COLORS.white, margin: 4,
    borderRadius: 12, padding: 16, alignItems: 'center',
  },
  actionIcon: { fontSize: 24, marginBottom: 6 },
  actionText: { fontSize: 12, color: COLORS.text, fontWeight: '600', textAlign: 'center' },
});
