import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch,
} from 'react-native';
import { COLORS } from '../../utils/constants';

export default function PrivacySettingsScreen({ navigation }) {
  const [settings, setSettings] = useState({
    analytics: false,
    notifications: true,
    whatsapp: false,
    shareData: false,
  });

  const toggle = (key) => setSettings((prev) => ({ ...prev, [key]: !prev[key] }));

  const ITEMS = [
    {
      key: 'notifications',
      icon: '🔔',
      title: 'Push Notifications',
      titleHi: 'नोटिफिकेशन',
      desc: 'Appointment reminders, medication alerts, health tips',
    },
    {
      key: 'analytics',
      icon: '📊',
      title: 'Usage Analytics',
      titleHi: 'उपयोग डेटा',
      desc: 'Anonymous usage data to improve the app (no personal data)',
    },
    {
      key: 'whatsapp',
      icon: '📱',
      title: 'WhatsApp Follow-ups',
      titleHi: 'व्हाट्सएप फॉलो-अप',
      desc: 'AI health check-ins via WhatsApp (Phase 2 — coming soon)',
    },
    {
      key: 'shareData',
      icon: '🔗',
      title: 'Share with Doctors',
      titleHi: 'डॉक्टरों के साथ साझा करें',
      desc: 'Allow doctors to view your health history before consultation',
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>
        <Text style={styles.heading}>Privacy Settings 🔒</Text>
        <Text style={styles.sub}>आपकी privacy हमारी priority है</Text>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>🛡️ Your Data Rights (DPDP Act 2023)</Text>
        <Text style={styles.infoText}>
          • All your data is stored on Azure India servers{'\n'}
          • You can delete ALL data in one tap{'\n'}
          • We never sell your data{'\n'}
          • AI conversations are never read by humans{'\n'}
          • You can export your data anytime
        </Text>
      </View>

      <View style={styles.settingsCard}>
        {ITEMS.map((item, i) => (
          <View key={item.key} style={[styles.row, i < ITEMS.length - 1 && styles.rowBorder]}>
            <Text style={styles.rowIcon}>{item.icon}</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.rowTitleHi}>{item.titleHi}</Text>
              <Text style={styles.rowTitle}>{item.title}</Text>
              <Text style={styles.rowDesc}>{item.desc}</Text>
            </View>
            <Switch
              value={settings[item.key]}
              onValueChange={() => toggle(item.key)}
              trackColor={{ false: COLORS.border, true: COLORS.primary + '80' }}
              thumbColor={settings[item.key] ? COLORS.primary : '#f4f3f4'}
            />
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.downloadBtn}>
        <Text style={styles.downloadBtnText}>📥 Download My Data</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.deleteBtn}
        onPress={() => navigation.navigate('DeleteAccount')}
      >
        <Text style={styles.deleteBtnText}>🗑️ Delete All My Data</Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { backgroundColor: COLORS.primary, padding: 20, paddingTop: 48 },
  back: { color: '#111827', fontSize: 22, marginBottom: 8 },
  heading: { fontSize: 22, fontWeight: 'bold', color: '#111827' },
  sub: { fontSize: 13, color: '#B3D4FF', marginTop: 4 },
  infoCard: { backgroundColor: '#E8F0FE', margin: 16, borderRadius: 12, padding: 16 },
  infoTitle: { fontSize: 14, fontWeight: 'bold', color: COLORS.primary, marginBottom: 10 },
  infoText: { fontSize: 13, color: COLORS.text, lineHeight: 22 },
  settingsCard: { backgroundColor: COLORS.white, marginHorizontal: 16, borderRadius: 14 },
  row: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12 },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: COLORS.border },
  rowIcon: { fontSize: 22 },
  rowTitleHi: { fontSize: 14, fontWeight: '600', color: COLORS.text },
  rowTitle: { fontSize: 12, color: COLORS.textSecondary },
  rowDesc: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2, lineHeight: 16 },
  downloadBtn: {
    backgroundColor: COLORS.white, marginHorizontal: 16, marginTop: 16,
    borderRadius: 12, padding: 16, alignItems: 'center',
    borderWidth: 1.5, borderColor: COLORS.primary,
  },
  downloadBtnText: { color: COLORS.primary, fontWeight: '600', fontSize: 14 },
  deleteBtn: {
    backgroundColor: '#FEE8E8', marginHorizontal: 16, marginTop: 12,
    borderRadius: 12, padding: 16, alignItems: 'center',
  },
  deleteBtnText: { color: COLORS.error, fontWeight: '600', fontSize: 14 },
});
