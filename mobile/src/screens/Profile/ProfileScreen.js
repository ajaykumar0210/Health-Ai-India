import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert,
} from 'react-native';
import { COLORS } from '../../utils/constants';
import useAppStore from '../../store/useAppStore';

export default function ProfileScreen({ navigation }) {
  const user = useAppStore((s) => s.user);
  const subscription = useAppStore((s) => s.subscription);
  const logout = useAppStore((s) => s.logout);

  const handleLogout = () => {
    Alert.alert('Logout', 'क्या आप logout करना चाहते हैं?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await logout();
          navigation.replace('Login');
        },
      },
    ]);
  };

  const MENU = [
    { icon: '🏥', label: 'Health Vault', labelHi: 'हेल्थ वॉल्ट', screen: 'HealthVault' },
    { icon: '💳', label: 'Subscription', labelHi: 'सब्सक्रिप्शन', screen: 'SubscriptionManage' },
    { icon: '🔒', label: 'Privacy Settings', labelHi: 'प्राइवेसी', screen: 'PrivacySettings' },
    { icon: '📋', label: 'My Concerns', labelHi: 'मेरी समस्याएं', screen: 'ProblemSelect' },
    { icon: '👨‍⚕️', label: 'My Doctors', labelHi: 'मेरे डॉक्टर', screen: 'DoctorList' },
    { icon: '📊', label: 'Progress', labelHi: 'प्रगति', screen: 'Dashboard' },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Profile header */}
      <View style={styles.header}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>{(user?.name || 'U')[0].toUpperCase()}</Text>
        </View>
        <Text style={styles.name}>{user?.name || 'Your Name'}</Text>
        <Text style={styles.phone}>{user?.phone || ''}</Text>
        <View style={styles.planBadge}>
          <Text style={styles.planBadgeText}>
            {subscription?.plan_type
              ? `${subscription.plan_type.toUpperCase()} Plan`
              : 'Freemium'}
          </Text>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text style={styles.statVal}>30</Text>
          <Text style={styles.statLbl}>Days</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statVal}>12🔥</Text>
          <Text style={styles.statLbl}>Streak</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statVal}>3</Text>
          <Text style={styles.statLbl}>Consults</Text>
        </View>
      </View>

      {/* Menu */}
      <View style={styles.menuCard}>
        {MENU.map((item, i) => (
          <TouchableOpacity
            key={item.label}
            style={[styles.menuItem, i < MENU.length - 1 && styles.menuItemBorder]}
            onPress={() => navigation.navigate(item.screen)}
          >
            <Text style={styles.menuIcon}>{item.icon}</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.menuLabelHi}>{item.labelHi}</Text>
              <Text style={styles.menuLabel}>{item.label}</Text>
            </View>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Danger zone */}
      <View style={styles.dangerCard}>
        <TouchableOpacity style={styles.dangerItem} onPress={() => navigation.navigate('DeleteAccount')}>
          <Text style={styles.dangerIcon}>🗑️</Text>
          <Text style={styles.dangerText}>Delete Account & All Data</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>🚪 Logout</Text>
      </TouchableOpacity>

      <Text style={styles.version}>Health AI India v1.0.0 — Made with ❤️ for India</Text>
      <View style={{ height: 80 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    backgroundColor: COLORS.primary, padding: 24, paddingTop: 48, alignItems: 'center',
  },
  avatarCircle: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.3)', alignItems: 'center',
    justifyContent: 'center', marginBottom: 12,
  },
  avatarText: { color: '#fff', fontSize: 30, fontWeight: 'bold' },
  name: { fontSize: 20, fontWeight: 'bold', color: '#fff', marginBottom: 4 },
  phone: { fontSize: 14, color: '#B3D4FF', marginBottom: 10 },
  planBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16, paddingVertical: 4, borderRadius: 12,
  },
  planBadgeText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  statsRow: {
    flexDirection: 'row', backgroundColor: COLORS.white,
    padding: 16, justifyContent: 'space-around', borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  stat: { alignItems: 'center' },
  statVal: { fontSize: 20, fontWeight: 'bold', color: COLORS.primary },
  statLbl: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  menuCard: { backgroundColor: COLORS.white, margin: 16, borderRadius: 14 },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 14 },
  menuItemBorder: { borderBottomWidth: 1, borderBottomColor: COLORS.border },
  menuIcon: { fontSize: 22 },
  menuLabelHi: { fontSize: 14, fontWeight: '600', color: COLORS.text },
  menuLabel: { fontSize: 12, color: COLORS.textSecondary },
  menuArrow: { fontSize: 22, color: COLORS.textSecondary },
  dangerCard: {
    backgroundColor: COLORS.white, marginHorizontal: 16, borderRadius: 14, marginBottom: 12,
    borderWidth: 1, borderColor: '#FFCCCC',
  },
  dangerItem: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 14 },
  dangerIcon: { fontSize: 22 },
  dangerText: { color: COLORS.error, fontSize: 14, fontWeight: '600' },
  logoutBtn: {
    backgroundColor: COLORS.white, marginHorizontal: 16, borderRadius: 14,
    padding: 16, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border, marginBottom: 16,
  },
  logoutText: { color: COLORS.text, fontSize: 15, fontWeight: '600' },
  version: { textAlign: 'center', fontSize: 12, color: COLORS.textSecondary },
});
