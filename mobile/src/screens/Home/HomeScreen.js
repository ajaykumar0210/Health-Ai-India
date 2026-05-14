import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar,
} from 'react-native';
import useAppStore from '../../store/useAppStore';
import { COLORS } from '../../utils/constants';

export default function HomeScreen({ navigation }) {
  const user = useAppStore((s) => s.user);
  const selectedConcerns = useAppStore((s) => s.selectedConcerns);
  const subscription = useAppStore((s) => s.subscription);
  const streaks = useAppStore((s) => s.streaks);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>नमस्ते, {user?.name || 'Friend'} 👋</Text>
          <Text style={styles.date}>{new Date().toLocaleDateString('hi-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{(user?.name || 'U')[0].toUpperCase()}</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Streak card */}
      <View style={styles.streakCard}>
        <Text style={styles.streakEmoji}>🔥</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.streakTitle}>{streaks} Day Streak!</Text>
          <Text style={styles.streakSub}>Keep up your health journey</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Dashboard')}>
          <Text style={styles.streakBtn}>Dashboard →</Text>
        </TouchableOpacity>
      </View>

      {/* Quick Actions */}
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.quickGrid}>
        <TouchableOpacity
          style={[styles.quickCard, { backgroundColor: '#E8F0FE' }]}
          onPress={() => navigation.navigate('SymptomChat')}
        >
          <Text style={styles.quickIcon}>🤖</Text>
          <Text style={styles.quickLabel}>AI Chat</Text>
          <Text style={styles.quickSub}>Ask health questions</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.quickCard, { backgroundColor: '#E6F4EA' }]}
          onPress={() => navigation.navigate('DoctorList')}
        >
          <Text style={styles.quickIcon}>👨‍⚕️</Text>
          <Text style={styles.quickLabel}>Book Doctor</Text>
          <Text style={styles.quickSub}>Video consultation</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.quickCard, { backgroundColor: '#FFF3E0' }]}
          onPress={() => navigation.navigate('HealthVault')}
        >
          <Text style={styles.quickIcon}>📋</Text>
          <Text style={styles.quickLabel}>Prescriptions</Text>
          <Text style={styles.quickSub}>Download PDFs</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.quickCard, { backgroundColor: '#F3E5F5' }]}
          onPress={() => navigation.navigate('WeeklyCheckIn')}
        >
          <Text style={styles.quickIcon}>📊</Text>
          <Text style={styles.quickLabel}>Check-in</Text>
          <Text style={styles.quickSub}>Weekly progress</Text>
        </TouchableOpacity>
      </View>

      {/* Current Plan */}
      <View style={styles.planCard}>
        <Text style={styles.planTitle}>
          Current Plan: {subscription?.plan_type || 'Freemium'}
        </Text>
        {!subscription?.plan_type || subscription.plan_type === 'freemium' ? (
          <TouchableOpacity onPress={() => navigation.navigate('Plans')}>
            <Text style={styles.upgradeTxt}>⬆️ Upgrade for unlimited AI access</Text>
          </TouchableOpacity>
        ) : (
          <Text style={styles.planActive}>✅ Active until {subscription?.end_date}</Text>
        )}
      </View>

      {/* My Concerns */}
      {selectedConcerns.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>My Health Concerns</Text>
          <View style={styles.concernsRow}>
            {selectedConcerns.map((c) => (
              <TouchableOpacity
                key={c}
                style={styles.concernChip}
                onPress={() => navigation.navigate('SymptomChat', { concern: c })}
              >
                <Text style={styles.concernText}>{c}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: COLORS.primary, padding: 20, paddingTop: 48,
  },
  greeting: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  date: { fontSize: 13, color: '#B3D4FF', marginTop: 2 },
  avatar: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.3)', alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  streakCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#FFF3E0', margin: 16, borderRadius: 12,
    padding: 16, gap: 12,
  },
  streakEmoji: { fontSize: 28 },
  streakTitle: { fontWeight: 'bold', fontSize: 16, color: COLORS.text },
  streakSub: { fontSize: 13, color: COLORS.textSecondary },
  streakBtn: { color: COLORS.primary, fontWeight: '600', fontSize: 13 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.text, marginHorizontal: 16, marginBottom: 12 },
  quickGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16, gap: 12, marginBottom: 20 },
  quickCard: {
    width: '46%', borderRadius: 12, padding: 16,
  },
  quickIcon: { fontSize: 28, marginBottom: 8 },
  quickLabel: { fontWeight: 'bold', fontSize: 14, color: COLORS.text },
  quickSub: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  planCard: {
    margin: 16, padding: 16, backgroundColor: COLORS.white,
    borderRadius: 12, borderWidth: 1, borderColor: COLORS.border,
  },
  planTitle: { fontWeight: 'bold', fontSize: 15, color: COLORS.text, marginBottom: 6 },
  upgradeTxt: { color: COLORS.primary, fontSize: 14 },
  planActive: { color: COLORS.success, fontSize: 14 },
  concernsRow: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16, gap: 8, marginBottom: 20 },
  concernChip: {
    paddingHorizontal: 14, paddingVertical: 8,
    backgroundColor: '#E8F0FE', borderRadius: 20,
  },
  concernText: { color: COLORS.primary, fontWeight: '600', fontSize: 13 },
});
