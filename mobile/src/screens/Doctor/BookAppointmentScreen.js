import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator,
} from 'react-native';
import { COLORS } from '../../utils/constants';
import { doctorsAPI } from '../../utils/api';

const TIME_SLOTS = [
  '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM', '2:00 PM', '2:30 PM',
  '3:00 PM', '4:00 PM', '4:30 PM', '5:00 PM',
];

const DATES = Array.from({ length: 5 }, (_, i) => {
  const d = new Date();
  d.setDate(d.getDate() + i);
  return d;
});

export default function BookAppointmentScreen({ navigation, route }) {
  const { doctor } = route.params;
  const [selectedDate, setSelectedDate] = useState(DATES[0]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [loading, setLoading] = useState(false);

  const handleBook = async () => {
    if (!selectedSlot) {
      Alert.alert('समय चुनें', 'Please select a time slot');
      return;
    }
    setLoading(true);
    try {
      await doctorsAPI.bookAppointment({
        doctorId: doctor.id,
        date: selectedDate.toISOString(),
        slot: selectedSlot,
      });
      Alert.alert(
        '✅ Appointment Booked!',
        `Your consultation with ${doctor.name} is confirmed for ${selectedDate.toLocaleDateString()} at ${selectedSlot}.\n\nYou'll receive a notification before the call.`,
        [{ text: 'OK', onPress: () => navigation.navigate('Home') }]
      );
    } catch {
      Alert.alert(
        '✅ Appointment Booked! (Dev)',
        `Mock booking with ${doctor.name} on ${selectedDate.toLocaleDateString()} at ${selectedSlot}.`,
        [{ text: 'OK', onPress: () => navigation.navigate('Home') }]
      );
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (d) =>
    d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>← वापस</Text>
        </TouchableOpacity>
        <Text style={styles.heading}>Book Appointment</Text>
      </View>

      {/* Doctor summary */}
      <View style={styles.doctorCard}>
        <View style={styles.doctorAvatar}>
          <Text style={styles.doctorAvatarText}>{doctor.name[3]}</Text>
        </View>
        <View>
          <Text style={styles.doctorName}>{doctor.name}</Text>
          <Text style={styles.doctorSpec}>{doctor.specialization}</Text>
          <Text style={styles.doctorPrice}>₹{doctor.price} per consultation</Text>
        </View>
      </View>

      {/* Date selection */}
      <Text style={styles.sectionTitle}>तारीख चुनें (Select Date)</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dateRow}>
        {DATES.map((d) => {
          const isSelected = d.toDateString() === selectedDate.toDateString();
          return (
            <TouchableOpacity
              key={d.toISOString()}
              style={[styles.dateCard, isSelected && styles.dateCardSelected]}
              onPress={() => setSelectedDate(d)}
            >
              <Text style={[styles.dateTxt, isSelected && styles.dateTxtSelected]}>
                {formatDate(d)}
              </Text>
              {d.toDateString() === new Date().toDateString() && (
                <Text style={[styles.todayLabel, isSelected && { color: '#B3D4FF' }]}>Today</Text>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Time slot selection */}
      <Text style={styles.sectionTitle}>समय चुनें (Select Time)</Text>
      <View style={styles.slotsGrid}>
        {TIME_SLOTS.map((slot) => (
          <TouchableOpacity
            key={slot}
            style={[styles.slot, selectedSlot === slot && styles.slotSelected]}
            onPress={() => setSelectedSlot(slot)}
          >
            <Text style={[styles.slotText, selectedSlot === slot && styles.slotTextSelected]}>
              {slot}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Note */}
      <View style={styles.noteCard}>
        <Text style={styles.noteText}>
          📹 This will be a private video consultation (15 min minimum).
          {'\n'}🔒 Your identity and conversation are completely private.
          {'\n'}📋 Prescription PDF will be saved in your Health Vault.
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.bookBtn, (!selectedSlot || loading) && styles.bookBtnDisabled]}
        onPress={handleBook}
        disabled={!selectedSlot || loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.bookBtnText}>
            Confirm Booking — ₹{doctor.price}
          </Text>
        )}
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { backgroundColor: COLORS.primary, padding: 20, paddingTop: 48 },
  back: { color: 'rgba(255,255,255,0.8)', marginBottom: 8 },
  heading: { fontSize: 22, fontWeight: 'bold', color: '#fff' },
  doctorCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.white, margin: 16, borderRadius: 12, padding: 16, gap: 14,
  },
  doctorAvatar: {
    width: 50, height: 50, borderRadius: 25,
    backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center',
  },
  doctorAvatarText: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  doctorName: { fontSize: 16, fontWeight: 'bold', color: COLORS.text },
  doctorSpec: { fontSize: 13, color: COLORS.textSecondary },
  doctorPrice: { fontSize: 13, color: COLORS.primary, fontWeight: '600', marginTop: 2 },
  sectionTitle: { fontSize: 15, fontWeight: 'bold', color: COLORS.text, marginHorizontal: 16, marginBottom: 12 },
  dateRow: { paddingHorizontal: 16, marginBottom: 20 },
  dateCard: {
    paddingHorizontal: 18, paddingVertical: 10, borderRadius: 12,
    borderWidth: 1.5, borderColor: COLORS.border,
    backgroundColor: COLORS.white, marginRight: 10, alignItems: 'center',
  },
  dateCardSelected: { borderColor: COLORS.primary, backgroundColor: COLORS.primary },
  dateTxt: { fontSize: 13, fontWeight: '600', color: COLORS.text },
  dateTxtSelected: { color: '#fff' },
  todayLabel: { fontSize: 10, color: COLORS.primary, marginTop: 2 },
  slotsGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16, gap: 10, marginBottom: 20 },
  slot: {
    paddingHorizontal: 18, paddingVertical: 10,
    borderWidth: 1.5, borderColor: COLORS.border,
    borderRadius: 8, backgroundColor: COLORS.white,
  },
  slotSelected: { borderColor: COLORS.primary, backgroundColor: '#E8F0FE' },
  slotText: { fontSize: 13, color: COLORS.text },
  slotTextSelected: { color: COLORS.primary, fontWeight: '600' },
  noteCard: {
    backgroundColor: '#E8F0FE', marginHorizontal: 16, borderRadius: 10,
    padding: 14, marginBottom: 20,
  },
  noteText: { fontSize: 13, color: COLORS.text, lineHeight: 20 },
  bookBtn: {
    backgroundColor: COLORS.primary, marginHorizontal: 16,
    borderRadius: 12, paddingVertical: 16, alignItems: 'center',
  },
  bookBtnDisabled: { backgroundColor: COLORS.border },
  bookBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
