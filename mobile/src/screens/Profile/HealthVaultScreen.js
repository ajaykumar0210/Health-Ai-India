import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator,
} from 'react-native';
import { COLORS } from '../../utils/constants';
import { doctorsAPI } from '../../utils/api';

const MOCK_VAULT = [
  {
    id: '1', doctorName: 'Dr. Priya Sharma', date: '14 May 2026',
    concern: 'Hair Fall', diagnosis: 'Telogen Effluvium',
  },
  {
    id: '2', doctorName: 'Dr. Rahul Gupta', date: '1 May 2026',
    concern: 'Skin', diagnosis: 'Mild Acne Vulgaris',
  },
];

export default function HealthVaultScreen({ navigation }) {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await doctorsAPI.getConsultations();
        setPrescriptions(res.data);
      } catch {
        setPrescriptions(MOCK_VAULT);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('PrescriptionViewer', { prescriptionId: item.id })}
    >
      <View style={styles.cardIcon}>
        <Text style={styles.cardIconText}>📋</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.cardTitle}>{item.doctorName}</Text>
        <Text style={styles.cardSub}>{item.diagnosis}</Text>
        <Text style={styles.cardDate}>{item.date} • {item.concern}</Text>
      </View>
      <Text style={styles.downloadIcon}>⬇️</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loading}>
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
        <Text style={styles.heading}>Health Vault 🔒</Text>
        <Text style={styles.sub}>आपकी सारी prescriptions यहां सुरक्षित हैं</Text>
      </View>
      <FlatList
        data={prescriptions}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>📭</Text>
            <Text style={styles.emptyText}>No prescriptions yet</Text>
            <Text style={styles.emptySub}>Book a consultation to get your first prescription</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  header: { backgroundColor: COLORS.primary, padding: 20, paddingTop: 48 },
  back: { color: '#fff', fontSize: 22, marginBottom: 8 },
  heading: { fontSize: 22, fontWeight: 'bold', color: '#fff' },
  sub: { fontSize: 13, color: '#B3D4FF', marginTop: 4 },
  list: { padding: 16 },
  card: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.white, borderRadius: 12, padding: 16,
    marginBottom: 12, gap: 14,
  },
  cardIcon: {
    width: 48, height: 48, borderRadius: 12,
    backgroundColor: '#E8F0FE', alignItems: 'center', justifyContent: 'center',
  },
  cardIconText: { fontSize: 24 },
  cardTitle: { fontSize: 15, fontWeight: 'bold', color: COLORS.text },
  cardSub: { fontSize: 13, color: COLORS.textSecondary, marginTop: 2 },
  cardDate: { fontSize: 12, color: COLORS.primary, marginTop: 4 },
  downloadIcon: { fontSize: 20 },
  empty: { alignItems: 'center', paddingTop: 60 },
  emptyIcon: { fontSize: 60, marginBottom: 16 },
  emptyText: { fontSize: 18, fontWeight: 'bold', color: COLORS.text },
  emptySub: { fontSize: 14, color: COLORS.textSecondary, marginTop: 8, textAlign: 'center' },
});
