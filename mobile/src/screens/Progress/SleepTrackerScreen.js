import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, GRADIENTS, FONTS } from '../../utils/constants';

const WEEK_DATA = [
  { day: 'Mon', hours: 7.2, quality: 78 },
  { day: 'Tue', hours: 6.0, quality: 62 },
  { day: 'Wed', hours: 8.1, quality: 88 },
  { day: 'Thu', hours: 5.5, quality: 55 },
  { day: 'Fri', hours: 7.8, quality: 82 },
  { day: 'Sat', hours: 9.0, quality: 92 },
  { day: 'Sun', hours: 7.5, quality: 80 },
];

const SLEEP_TIPS = [
  { icon: '📵', title: 'Phone-free 30 mins before bed', impact: 'Boosts sleep quality by 35%' },
  { icon: '🌡️', title: 'Keep room at 18-20°C', impact: 'Optimal temperature for deep sleep' },
  { icon: '☕', title: 'No caffeine after 3 PM', impact: 'Reduces sleep onset time by 40 min' },
];

export default function SleepTrackerScreen({ navigation }) {
  const [todayBedtime, setTodayBedtime] = useState('11:30 PM');
  const [todayWakeup, setTodayWakeup] = useState('7:00 AM');

  const avgHours = (WEEK_DATA.reduce((s, d) => s + d.hours, 0) / WEEK_DATA.length).toFixed(1);
  const avgQuality = Math.round(WEEK_DATA.reduce((s, d) => s + d.quality, 0) / WEEK_DATA.length);
  const maxBar = Math.max(...WEEK_DATA.map((d) => d.hours));

  return (
    <View style={styles.root}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      {/* Header */}
      <LinearGradient colors={['#1E1B4B', '#4338CA']} style={styles.header} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sleep Tracker</Text>
        <Text style={styles.headerSub}>Poor sleep = Hair fall + Skin issues</Text>

        {/* Stats */}
        <View style={styles.statsRow}>
          {[
            { label: 'Avg Sleep', val: `${avgHours}h`, icon: '🌙' },
            { label: 'Quality', val: `${avgQuality}%`, icon: '⭐' },
            { label: 'This Week', val: '5/7 🎯', icon: '📅' },
          ].map((s, i) => (
            <View key={i} style={styles.statCard}>
              <Text style={styles.statIcon}>{s.icon}</Text>
              <Text style={styles.statVal}>{s.val}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.body}>

        {/* Tonight's schedule */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tonight's Schedule</Text>
          <View style={styles.scheduleCard}>
            {[
              { label: 'Bedtime', val: todayBedtime, icon: '🌙', color: '#4338CA' },
              { label: 'Wake Up', val: todayWakeup, icon: '☀️', color: '#D97706' },
            ].map((s, i) => (
              <View key={i} style={[styles.scheduleItem, i === 0 && { borderRightWidth: 1, borderRightColor: COLORS.border }]}>
                <Text style={styles.scheduleIcon}>{s.icon}</Text>
                <Text style={[styles.scheduleVal, { color: s.color }]}>{s.val}</Text>
                <Text style={styles.scheduleLabel}>{s.label}</Text>
              </View>
            ))}
          </View>
          <View style={styles.totalSleepBadge}>
            <Ionicons name="moon" size={14} color="#4338CA" />
            <Text style={styles.totalSleepText}>Tonight's target: <Text style={{ fontFamily: FONTS.bold, color: '#4338CA' }}>7.5 hours</Text></Text>
          </View>
        </View>

        {/* Weekly bar chart */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>7-Day Sleep Pattern</Text>
          <View style={styles.chartCard}>
            <View style={styles.chartBars}>
              {WEEK_DATA.map((d, i) => (
                <View key={i} style={styles.barCol}>
                  <Text style={styles.barVal}>{d.hours}h</Text>
                  <View style={styles.barTrack}>
                    <LinearGradient
                      colors={d.hours >= 7 ? ['#4338CA', '#818CF8'] : d.hours >= 6 ? ['#D97706', '#FBBF24'] : ['#DC2626', '#F87171']}
                      style={[styles.barFill, { height: `${(d.hours / maxBar) * 100}%` }]}
                    />
                  </View>
                  <Text style={styles.barDay}>{d.day}</Text>
                </View>
              ))}
            </View>
            {/* Target line label */}
            <View style={styles.targetLine}>
              <Text style={styles.targetLineText}>Target: 7h</Text>
            </View>
          </View>
        </View>

        {/* Impact on hair & skin */}
        <View style={styles.section}>
          <View style={[styles.impactBanner, { backgroundColor: '#FFF0F0' }]}>
            <Text style={styles.impactTitle}>⚠️ Sleep & Hair Health</Text>
            <Text style={styles.impactText}>
              Only 2 out of 7 nights you got optimal sleep this week. Poor sleep raises cortisol, which directly causes hair fall and acne breakouts.
            </Text>
            <TouchableOpacity style={styles.impactBtn} onPress={() => navigation.navigate('SymptomChat')}>
              <Text style={styles.impactBtnText}>Chat with AI about this →</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Sleep tips */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sleep Hygiene Tips</Text>
          {SLEEP_TIPS.map((tip, i) => (
            <View key={i} style={styles.tipCard}>
              <View style={styles.tipIconWrap}>
                <Text style={{ fontSize: 22 }}>{tip.icon}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.tipTitle}>{tip.title}</Text>
                <Text style={styles.tipImpact}>{tip.impact}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },
  header: { paddingTop: 56, paddingBottom: 28, paddingHorizontal: 20 },
  backBtn: {
    width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center', justifyContent: 'center', marginBottom: 14,
  },
  headerTitle: { fontFamily: FONTS.bold, fontSize: 24, color: '#fff', marginBottom: 4 },
  headerSub: { fontFamily: FONTS.regular, fontSize: 13, color: 'rgba(255,255,255,0.6)', marginBottom: 20 },
  statsRow: { flexDirection: 'row', gap: 12 },
  statCard: {
    flex: 1, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 16, padding: 14,
    alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)',
  },
  statIcon: { fontSize: 20, marginBottom: 4 },
  statVal: { fontFamily: FONTS.bold, fontSize: 16, color: '#fff' },
  statLabel: { fontFamily: FONTS.regular, fontSize: 10, color: 'rgba(255,255,255,0.6)', marginTop: 2 },

  body: { padding: 16 },
  section: { marginBottom: 24 },
  sectionTitle: { fontFamily: FONTS.bold, fontSize: 17, color: COLORS.text, marginBottom: 12 },

  scheduleCard: {
    flexDirection: 'row', backgroundColor: COLORS.white, borderRadius: 20,
    overflow: 'hidden', shadowColor: COLORS.shadow, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1, shadowRadius: 12, elevation: 4,
  },
  scheduleItem: { flex: 1, padding: 20, alignItems: 'center' },
  scheduleIcon: { fontSize: 28, marginBottom: 8 },
  scheduleVal: { fontFamily: FONTS.bold, fontSize: 22, marginBottom: 4 },
  scheduleLabel: { fontFamily: FONTS.regular, fontSize: 12, color: COLORS.textSecondary },
  totalSleepBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#EDE9FE', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8,
    marginTop: 12, alignSelf: 'flex-start',
  },
  totalSleepText: { fontFamily: FONTS.regular, fontSize: 13, color: COLORS.textSecondary },

  chartCard: {
    backgroundColor: COLORS.white, borderRadius: 20, padding: 20,
    shadowColor: COLORS.shadow, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 1, shadowRadius: 12, elevation: 4,
  },
  chartBars: { flexDirection: 'row', alignItems: 'flex-end', height: 120, gap: 8, justifyContent: 'space-between' },
  barCol: { flex: 1, alignItems: 'center' },
  barVal: { fontFamily: FONTS.medium, fontSize: 9, color: COLORS.textSecondary, marginBottom: 4 },
  barTrack: { flex: 1, width: '80%', backgroundColor: '#F1F5F9', borderRadius: 6, overflow: 'hidden', justifyContent: 'flex-end' },
  barFill: { width: '100%', borderRadius: 6 },
  barDay: { fontFamily: FONTS.medium, fontSize: 10, color: COLORS.textSecondary, marginTop: 4 },
  targetLine: { marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: COLORS.border, alignItems: 'flex-end' },
  targetLineText: { fontFamily: FONTS.regular, fontSize: 11, color: COLORS.textLight },

  impactBanner: { borderRadius: 16, padding: 16, borderLeftWidth: 4, borderLeftColor: COLORS.error },
  impactTitle: { fontFamily: FONTS.bold, fontSize: 15, color: COLORS.text, marginBottom: 8 },
  impactText: { fontFamily: FONTS.regular, fontSize: 13, color: COLORS.textSecondary, lineHeight: 20, marginBottom: 12 },
  impactBtn: { backgroundColor: COLORS.errorBg, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8, alignSelf: 'flex-start' },
  impactBtnText: { fontFamily: FONTS.semiBold, fontSize: 12, color: COLORS.error },

  tipCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white,
    borderRadius: 14, padding: 14, marginBottom: 10, gap: 12,
    shadowColor: COLORS.shadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 1, shadowRadius: 6, elevation: 2,
  },
  tipIconWrap: {
    width: 44, height: 44, borderRadius: 12, backgroundColor: '#EDE9FE',
    alignItems: 'center', justifyContent: 'center',
  },
  tipTitle: { fontFamily: FONTS.semiBold, fontSize: 14, color: COLORS.text },
  tipImpact: { fontFamily: FONTS.regular, fontSize: 12, color: COLORS.success, marginTop: 2 },
});
