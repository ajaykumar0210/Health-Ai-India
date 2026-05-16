import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator,
} from 'react-native';
import { COLORS } from '../../utils/constants';
import { doctorsAPI } from '../../utils/api';
import useAppStore from '../../store/useAppStore';

const MOCK_DOCTORS = [
  {
    id: 1, name: 'Dr. Priya Sharma', specialization: 'General Medicine, Hair & Skin',
    rating: 4.8, totalConsultations: 1240, experience: 8,
    available: true, price: 199, languages: ['Hindi', 'English'],
    bio: 'MBBS, MD — Expert in hair loss, skin disorders, and general medicine.',
  },
  {
    id: 2, name: 'Dr. Rahul Gupta', specialization: 'Dermatology & Sexual Health',
    rating: 4.9, totalConsultations: 2100, experience: 12,
    available: true, price: 199, languages: ['Hindi', 'English', 'Punjabi'],
    bio: 'MBBS, MD Dermatology — Specialist in skin, sexual health, and confidence issues.',
  },
  {
    id: 3, name: 'Dr. Meera Patel', specialization: 'Diabetology & Internal Medicine',
    rating: 4.7, totalConsultations: 890, experience: 6,
    available: false, price: 199, languages: ['Hindi', 'English', 'Gujarati'],
    bio: 'MBBS, MD — Diabetes management and lifestyle disease specialist.',
  },
  {
    id: 4, name: 'Dr. Arjun Singh', specialization: 'Psychiatry & Stress Management',
    rating: 4.9, totalConsultations: 1560, experience: 10,
    available: true, price: 199, languages: ['Hindi', 'English'],
    bio: 'MBBS, MD Psychiatry — Mental health, anxiety, and stress specialist.',
  },
];

export default function DoctorListScreen({ navigation }) {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const selectedConcerns = useAppStore((s) => s.selectedConcerns);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await doctorsAPI.list(selectedConcerns[0] || '');
        setDoctors(res.data);
      } catch {
        setDoctors(MOCK_DOCTORS);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const renderDoctor = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('DoctorProfile', { doctor: item })}
    >
      <View style={styles.cardHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{item.name[3]}</Text>
        </View>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.spec}>{item.specialization}</Text>
          <Text style={styles.exp}>{item.experience} years experience</Text>
        </View>
        <View style={[styles.badge, { backgroundColor: item.available ? '#E6F4EA' : '#FEE8E8' }]}>
          <Text style={[styles.badgeText, { color: item.available ? COLORS.success : COLORS.error }]}>
            {item.available ? 'Available' : 'Busy'}
          </Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>⭐ {item.rating}</Text>
          <Text style={styles.statLabel}>Rating</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{item.totalConsultations.toLocaleString()}</Text>
          <Text style={styles.statLabel}>Consultations</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>₹{item.price}</Text>
          <Text style={styles.statLabel}>Per Visit</Text>
        </View>
      </View>

      <View style={styles.langRow}>
        {item.languages.map((l) => (
          <View key={l} style={styles.langChip}>
            <Text style={styles.langText}>{l}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.bookBtn, !item.available && styles.bookBtnDisabled]}
        onPress={() =>
          item.available && navigation.navigate('BookAppointment', { doctor: item })
        }
        disabled={!item.available}
      >
        <Text style={styles.bookBtnText}>
          {item.available ? 'Book Consultation →' : 'Not Available Now'}
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>
        <View>
          <Text style={styles.heading}>Verified Doctors</Text>
          <Text style={styles.sub}>All MCI-licensed • Private consultation</Text>
        </View>
      </View>
      <FlatList
        data={doctors}
        renderItem={renderDoctor}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  header: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.primary, padding: 20, paddingTop: 48, gap: 16,
  },
  back: { color: '#111827', fontSize: 22, fontWeight: 'bold' },
  heading: { fontSize: 20, fontWeight: 'bold', color: '#111827' },
  sub: { fontSize: 12, color: '#B3D4FF' },
  list: { padding: 16 },
  card: {
    backgroundColor: COLORS.white, borderRadius: 14,
    padding: 16, marginBottom: 16, elevation: 2,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 16 },
  avatar: {
    width: 50, height: 50, borderRadius: 25,
    backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { color: '#111827', fontSize: 20, fontWeight: 'bold' },
  name: { fontSize: 16, fontWeight: 'bold', color: COLORS.text },
  spec: { fontSize: 13, color: COLORS.textSecondary, marginTop: 2 },
  exp: { fontSize: 12, color: COLORS.primary, marginTop: 2 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  badgeText: { fontSize: 11, fontWeight: 'bold' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 12 },
  stat: { alignItems: 'center' },
  statValue: { fontSize: 15, fontWeight: 'bold', color: COLORS.text },
  statLabel: { fontSize: 11, color: COLORS.textSecondary },
  langRow: { flexDirection: 'row', gap: 8, marginBottom: 14 },
  langChip: { backgroundColor: '#F3E5F5', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  langText: { fontSize: 12, color: '#6F42C1' },
  bookBtn: {
    backgroundColor: COLORS.primary, borderRadius: 10,
    paddingVertical: 12, alignItems: 'center',
  },
  bookBtnDisabled: { backgroundColor: COLORS.border },
  bookBtnText: { color: '#111827', fontWeight: 'bold', fontSize: 14 },
});
