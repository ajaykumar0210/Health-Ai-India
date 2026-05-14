import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Share,
} from 'react-native';
import { COLORS } from '../../utils/constants';

const MILESTONES = [
  { id: 1, title: 'First Step 🌱', titleHi: 'पहला कदम', desc: 'Started your health journey', achieved: true, date: '1 May 2026' },
  { id: 2, title: '7-Day Streak 🔥', titleHi: '7 दिन लगातार', desc: 'Used the app 7 days in a row', achieved: true, date: '7 May 2026' },
  { id: 3, title: 'First Check-in ✅', titleHi: 'पहला चेक-इन', desc: 'Completed your first weekly check-in', achieved: true, date: '7 May 2026' },
  { id: 4, title: 'AI Power User 🤖', titleHi: 'AI पावर यूजर', desc: 'Had 10+ AI conversations', achieved: false, progress: 7, total: 10 },
  { id: 5, title: 'Doctor Hero 👨‍⚕️', titleHi: 'डॉक्टर हीरो', desc: 'Completed your first consultation', achieved: false, progress: 0, total: 1 },
  { id: 6, title: '30-Day Champion 🏆', titleHi: '30 दिन चैंपियन', desc: '30-day streak achieved', achieved: false, progress: 12, total: 30 },
];

export default function MilestoneScreen({ navigation }) {
  const handleShare = async (milestone) => {
    await Share.share({
      message: `🎉 I achieved "${milestone.title}" on Health AI India!\n\nJoin me on my health journey. ${milestone.desc}\n\n#HealthAIIndia #HealthJourney`,
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>
        <Text style={styles.heading}>Milestones 🏆</Text>
        <Text style={styles.sub}>आपकी उपलब्धियां</Text>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statVal}>{MILESTONES.filter((m) => m.achieved).length}</Text>
          <Text style={styles.statLbl}>Achieved</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statVal}>{MILESTONES.filter((m) => !m.achieved).length}</Text>
          <Text style={styles.statLbl}>Pending</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statVal}>{MILESTONES.length}</Text>
          <Text style={styles.statLbl}>Total</Text>
        </View>
      </View>

      <View style={styles.list}>
        {MILESTONES.map((m) => (
          <View key={m.id} style={[styles.card, !m.achieved && styles.cardLocked]}>
            <View style={styles.cardLeft}>
              <View style={[styles.iconBox, { backgroundColor: m.achieved ? '#FFF3E0' : COLORS.background }]}>
                <Text style={styles.iconText}>{m.achieved ? '🏆' : '🔒'}</Text>
              </View>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.cardTitle, !m.achieved && styles.lockedText]}>{m.titleHi}</Text>
              <Text style={styles.cardTitleEn}>{m.title}</Text>
              <Text style={styles.cardDesc}>{m.desc}</Text>
              {m.achieved ? (
                <Text style={styles.achievedDate}>✓ {m.date}</Text>
              ) : (
                <View>
                  <View style={styles.progressBar}>
                    <View
                      style={[styles.progressFill, { width: `${(m.progress / m.total) * 100}%` }]}
                    />
                  </View>
                  <Text style={styles.progressTxt}>{m.progress}/{m.total}</Text>
                </View>
              )}
            </View>
            {m.achieved && (
              <TouchableOpacity onPress={() => handleShare(m)}>
                <Text style={styles.shareBtn}>📤 Share</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
      </View>

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
  statsRow: {
    flexDirection: 'row', backgroundColor: COLORS.white,
    padding: 16, justifyContent: 'space-around',
  },
  statBox: { alignItems: 'center' },
  statVal: { fontSize: 24, fontWeight: 'bold', color: COLORS.primary },
  statLbl: { fontSize: 12, color: COLORS.textSecondary, marginTop: 4 },
  list: { padding: 16 },
  card: {
    flexDirection: 'row', alignItems: 'flex-start',
    backgroundColor: COLORS.white, borderRadius: 12, padding: 16,
    marginBottom: 12, gap: 12,
  },
  cardLocked: { opacity: 0.7 },
  cardLeft: {},
  iconBox: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  iconText: { fontSize: 24 },
  cardTitle: { fontSize: 15, fontWeight: 'bold', color: COLORS.text },
  cardTitleEn: { fontSize: 12, color: COLORS.textSecondary, marginBottom: 4 },
  lockedText: { color: COLORS.textSecondary },
  cardDesc: { fontSize: 13, color: COLORS.textSecondary, marginBottom: 8 },
  achievedDate: { fontSize: 12, color: COLORS.success, fontWeight: '600' },
  progressBar: { height: 6, backgroundColor: COLORS.border, borderRadius: 3, overflow: 'hidden', marginBottom: 4 },
  progressFill: { height: '100%', backgroundColor: COLORS.primary, borderRadius: 3 },
  progressTxt: { fontSize: 11, color: COLORS.textSecondary },
  shareBtn: { color: COLORS.primary, fontSize: 12, fontWeight: '600' },
});
