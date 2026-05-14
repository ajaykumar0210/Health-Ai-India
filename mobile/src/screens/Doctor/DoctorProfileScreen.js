import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
} from 'react-native';
import { COLORS } from '../../utils/constants';

export default function DoctorProfileScreen({ navigation, route }) {
  const { doctor } = route.params;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>
        <View style={styles.profileSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{doctor.name[3]}</Text>
          </View>
          <Text style={styles.name}>{doctor.name}</Text>
          <Text style={styles.spec}>{doctor.specialization}</Text>
          <View style={styles.ratingRow}>
            <Text style={styles.rating}>⭐ {doctor.rating}</Text>
            <Text style={styles.ratingDivider}>•</Text>
            <Text style={styles.consultCount}>{doctor.totalConsultations.toLocaleString()} consultations</Text>
          </View>
        </View>
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statBox}>
          <Text style={styles.statVal}>{doctor.experience} yrs</Text>
          <Text style={styles.statLbl}>Experience</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statVal}>⭐ {doctor.rating}</Text>
          <Text style={styles.statLbl}>Rating</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statVal}>₹{doctor.price}</Text>
          <Text style={styles.statLbl}>Per Visit</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <Text style={styles.bio}>{doctor.bio}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Languages</Text>
        <View style={styles.langRow}>
          {doctor.languages.map((l) => (
            <View key={l} style={styles.langChip}>
              <Text style={styles.langText}>{l}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>How it works</Text>
        {[
          '1. Book & pay for consultation',
          '2. Doctor confirms within 30 minutes',
          '3. Private video call — 15 minutes minimum',
          '4. Prescription PDF in your health vault',
          '5. Follow-up message via WhatsApp (Phase 2)',
        ].map((step) => (
          <Text key={step} style={styles.step}>{step}</Text>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Availability</Text>
        <View style={[styles.availBadge, { backgroundColor: doctor.available ? '#E6F4EA' : '#FEE8E8' }]}>
          <Text style={[styles.availText, { color: doctor.available ? COLORS.success : COLORS.error }]}>
            {doctor.available ? '🟢 Available for consultation now' : '🔴 Currently busy — check back soon'}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.bookBtn, !doctor.available && styles.bookBtnDisabled]}
        onPress={() => doctor.available && navigation.navigate('BookAppointment', { doctor })}
        disabled={!doctor.available}
      >
        <Text style={styles.bookBtnText}>
          {doctor.available ? `Book Consultation — ₹${doctor.price}` : 'Not Available Now'}
        </Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { backgroundColor: COLORS.primary, padding: 20, paddingTop: 48 },
  back: { color: 'rgba(255,255,255,0.8)', fontSize: 22, marginBottom: 16 },
  profileSection: { alignItems: 'center', paddingBottom: 20 },
  avatar: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.3)', alignItems: 'center',
    justifyContent: 'center', marginBottom: 12,
  },
  avatarText: { color: '#fff', fontSize: 32, fontWeight: 'bold' },
  name: { fontSize: 22, fontWeight: 'bold', color: '#fff', marginBottom: 4 },
  spec: { fontSize: 14, color: '#B3D4FF', marginBottom: 8 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  rating: { color: '#fff', fontWeight: '600' },
  ratingDivider: { color: '#B3D4FF' },
  consultCount: { color: '#B3D4FF', fontSize: 13 },
  statsGrid: {
    flexDirection: 'row', backgroundColor: COLORS.white,
    borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  statBox: { flex: 1, alignItems: 'center', padding: 16 },
  statVal: { fontSize: 18, fontWeight: 'bold', color: COLORS.primary },
  statLbl: { fontSize: 12, color: COLORS.textSecondary, marginTop: 4 },
  section: { backgroundColor: COLORS.white, margin: 16, borderRadius: 12, padding: 16, marginBottom: 0 },
  sectionTitle: { fontSize: 15, fontWeight: 'bold', color: COLORS.text, marginBottom: 10 },
  bio: { fontSize: 14, color: COLORS.text, lineHeight: 22 },
  langRow: { flexDirection: 'row', gap: 8 },
  langChip: { backgroundColor: '#F3E5F5', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  langText: { fontSize: 13, color: '#6F42C1', fontWeight: '600' },
  step: { fontSize: 14, color: COLORS.text, marginBottom: 8, lineHeight: 20 },
  availBadge: { borderRadius: 10, padding: 12 },
  availText: { fontSize: 14, fontWeight: '600' },
  bookBtn: {
    backgroundColor: COLORS.primary, margin: 16, borderRadius: 12,
    paddingVertical: 16, alignItems: 'center',
  },
  bookBtnDisabled: { backgroundColor: COLORS.border },
  bookBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
