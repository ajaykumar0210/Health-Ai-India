import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Share,
} from 'react-native';
import { COLORS } from '../../utils/constants';

const MOCK_PRESCRIPTION = {
  id: 'RX-20260514-001',
  patientName: 'Ajay Kumar',
  doctorName: 'Dr. Priya Sharma',
  date: '14 May 2026',
  diagnosis: 'Stress-induced hair loss (Telogen Effluvium)',
  medicines: [
    { name: 'Biotin 10mg', dose: '1 tablet daily after breakfast', duration: '3 months' },
    { name: 'Minoxidil 5% solution', dose: 'Apply 1ml on scalp twice daily', duration: '6 months' },
    { name: 'Vitamin D3 60000 IU', dose: '1 sachet weekly with milk', duration: '12 weeks' },
  ],
  advice: 'Reduce stress. Sleep 7-8 hours. Avoid hot showers. Use mild shampoo.',
  followUp: '1 month',
};

export default function PrescriptionViewerScreen({ navigation, route }) {
  const prescription = route.params?.prescription || MOCK_PRESCRIPTION;

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Health AI India Prescription\nPatient: ${prescription.patientName}\nDoctor: ${prescription.doctorName}\nDate: ${prescription.date}\nDiagnosis: ${prescription.diagnosis}`,
        title: 'My Prescription',
      });
    } catch {}
  };

  const handleDownload = () => {
    Alert.alert('PDF Download', 'Prescription PDF has been saved to your device.\n\nIn production, this downloads an encrypted PDF from Azure Blob Storage.');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>← वापस</Text>
        </TouchableOpacity>
        <Text style={styles.heading}>Prescription</Text>
      </View>

      {/* Prescription card */}
      <View style={styles.rxCard}>
        {/* Header */}
        <View style={styles.rxHeader}>
          <Text style={styles.rxLogo}>🏥 Health AI India</Text>
          <Text style={styles.rxId}>Rx: {prescription.id}</Text>
        </View>

        <View style={styles.divider} />

        {/* Patient & Doctor */}
        <View style={styles.infoGrid}>
          <View style={styles.infoCol}>
            <Text style={styles.infoLabel}>Patient</Text>
            <Text style={styles.infoVal}>{prescription.patientName}</Text>
          </View>
          <View style={styles.infoCol}>
            <Text style={styles.infoLabel}>Doctor</Text>
            <Text style={styles.infoVal}>{prescription.doctorName}</Text>
          </View>
          <View style={styles.infoCol}>
            <Text style={styles.infoLabel}>Date</Text>
            <Text style={styles.infoVal}>{prescription.date}</Text>
          </View>
          <View style={styles.infoCol}>
            <Text style={styles.infoLabel}>Follow-up</Text>
            <Text style={styles.infoVal}>{prescription.followUp}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Diagnosis */}
        <Text style={styles.sectionLabel}>Diagnosis / निदान</Text>
        <Text style={styles.diagnosisText}>{prescription.diagnosis}</Text>

        <View style={styles.divider} />

        {/* Medicines */}
        <Text style={styles.sectionLabel}>Medicines / दवाइयां</Text>
        {prescription.medicines.map((m, i) => (
          <View key={i} style={styles.medicineCard}>
            <Text style={styles.medNum}>{i + 1}</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.medName}>{m.name}</Text>
              <Text style={styles.medDose}>📋 {m.dose}</Text>
              <Text style={styles.medDuration}>⏱️ Duration: {m.duration}</Text>
            </View>
          </View>
        ))}

        <View style={styles.divider} />

        {/* Advice */}
        <Text style={styles.sectionLabel}>Doctor's Advice</Text>
        <Text style={styles.adviceText}>{prescription.advice}</Text>

        <View style={styles.divider} />

        {/* Note */}
        <View style={styles.noteBox}>
          <Text style={styles.noteText}>
            ⚠️ This prescription is for informational use only. Please show this to your local pharmacist or 1mg to purchase medicines.
            {'\n\n'}Health AI India does not sell medicine or involve in any physical delivery.
          </Text>
        </View>
      </View>

      {/* Actions */}
      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.downloadBtn} onPress={handleDownload}>
          <Text style={styles.downloadBtnText}>⬇️ Download PDF</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.shareBtn} onPress={handleShare}>
          <Text style={styles.shareBtnText}>📤 Share</Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { backgroundColor: COLORS.primary, padding: 20, paddingTop: 48 },
  back: { color: '#4B5563', marginBottom: 8 },
  heading: { fontSize: 22, fontWeight: 'bold', color: '#111827' },
  rxCard: {
    backgroundColor: COLORS.white, margin: 16, borderRadius: 14,
    padding: 20, elevation: 2,
  },
  rxHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  rxLogo: { fontSize: 16, fontWeight: 'bold', color: COLORS.primary },
  rxId: { fontSize: 12, color: COLORS.textSecondary },
  divider: { height: 1, backgroundColor: COLORS.border, marginVertical: 16 },
  infoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
  infoCol: { width: '45%' },
  infoLabel: { fontSize: 11, color: COLORS.textSecondary, marginBottom: 2 },
  infoVal: { fontSize: 14, fontWeight: '600', color: COLORS.text },
  sectionLabel: { fontSize: 12, color: COLORS.textSecondary, fontWeight: '600', marginBottom: 8, textTransform: 'uppercase' },
  diagnosisText: { fontSize: 15, fontWeight: 'bold', color: COLORS.text },
  medicineCard: {
    flexDirection: 'row', backgroundColor: '#F8F9FA',
    borderRadius: 10, padding: 12, marginBottom: 10, alignItems: 'flex-start',
  },
  medNum: {
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: COLORS.primary, color: '#111827',
    textAlign: 'center', lineHeight: 24, fontWeight: 'bold',
    marginRight: 12, fontSize: 12,
  },
  medName: { fontSize: 15, fontWeight: 'bold', color: COLORS.text, marginBottom: 4 },
  medDose: { fontSize: 13, color: COLORS.textSecondary, marginBottom: 2 },
  medDuration: { fontSize: 12, color: COLORS.primary },
  adviceText: { fontSize: 14, color: COLORS.text, lineHeight: 22 },
  noteBox: { backgroundColor: '#FFF3E0', borderRadius: 10, padding: 12 },
  noteText: { fontSize: 12, color: '#795548', lineHeight: 18 },
  actionsRow: { flexDirection: 'row', marginHorizontal: 16, gap: 12 },
  downloadBtn: {
    flex: 1, backgroundColor: COLORS.primary,
    borderRadius: 12, paddingVertical: 14, alignItems: 'center',
  },
  downloadBtnText: { color: '#111827', fontWeight: 'bold', fontSize: 14 },
  shareBtn: {
    flex: 1, backgroundColor: COLORS.white,
    borderRadius: 12, paddingVertical: 14, alignItems: 'center',
    borderWidth: 1.5, borderColor: COLORS.primary,
  },
  shareBtnText: { color: COLORS.primary, fontWeight: 'bold', fontSize: 14 },
});
