import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert,
} from 'react-native';
import { COLORS } from '../../utils/constants';
import useAppStore from '../../store/useAppStore';
import useTranslation from '../../utils/useTranslation';

export default function ProfileScreen({ navigation }) {
  const user = useAppStore((s) => s.user);
  const subscription = useAppStore((s) => s.subscription);
  const logout = useAppStore((s) => s.logout);
  const language = useAppStore((s) => s.language);
  const setLanguage = useAppStore((s) => s.setLanguage);
  const isHindi = language === 'hi';
  const { t: tr } = useTranslation();

  const LANGUAGES = [
    { code: 'en', label: 'EN', full: 'English' },
    { code: 'hi', label: 'हि', full: 'हिंदी' },
  ];

  const handleLogout = () => {
    Alert.alert(
      isHindi ? 'लॉगआउट' : 'Logout',
      isHindi ? 'क्या आप logout करना चाहते हैं?' : 'Are you sure you want to logout?',
      [
        { text: isHindi ? 'रद्द करें' : 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
            navigation.replace('Login');
          },
        },
      ]
    );
  };

  const MENU = [
    { icon: '🏥', label: 'Health Vault', labelHi: 'हेल्थ वॉल्ट', screen: 'HealthVault' },
    { icon: '💳', label: 'Subscription', labelHi: 'सब्सक्रिप्शन', screen: 'SubscriptionManage' },
    { icon: '🔒', label: 'Privacy Settings', labelHi: 'प्राइवेसी सेटिंग्स', screen: 'PrivacySettings' },
    { icon: '📋', label: 'My Concerns', labelHi: 'मेरी समस्याएं', screen: 'ProblemSelect' },
    { icon: '👨‍⚕️', label: 'My Doctors', labelHi: 'मेरे डॉक्टर', screen: 'DoctorList' },
    { icon: '📊', label: 'Progress', labelHi: 'प्रगति', screen: 'Dashboard' },
  ];

  const t = (en, hi) => isHindi ? hi : en;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Profile header */}
      <View style={styles.header}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>{(user?.name || 'U')[0].toUpperCase()}</Text>
        </View>
        <Text style={styles.name}>{user?.name || 'Your Name'}</Text>
        <Text style={styles.phone}>{user?.phone || user?.email || ''}</Text>
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
          <Text style={styles.statLbl}>{tr('days')}</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statVal}>12🔥</Text>
          <Text style={styles.statLbl}>{tr('streak')}</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statVal}>3</Text>
          <Text style={styles.statLbl}>{tr('consults')}</Text>
        </View>
      </View>

      {/* Language Switcher */}
      <View style={styles.langCard}>
        <Text style={styles.langTitle}>🌐 {t('App Language', 'ऐप की भाषा')}</Text>
        <View style={styles.langRow}>
          {LANGUAGES.map((lang) => (
            <TouchableOpacity
              key={lang.code}
              style={[styles.langBtn, language === lang.code && styles.langBtnActive]}
              onPress={() => setLanguage(lang.code)}
            >
              <Text style={[styles.langBtnText, language === lang.code && styles.langBtnTextActive]}>
                {lang.label} {lang.full}
              </Text>
            </TouchableOpacity>
          ))}
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
            <Text style={styles.menuLabelMain}>{isHindi ? item.labelHi : item.label}</Text>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Danger zone */}
      <View style={styles.dangerCard}>
        <TouchableOpacity style={styles.dangerItem} onPress={() => navigation.navigate('DeleteAccount')}>
          <Text style={styles.dangerIcon}>🗑️</Text>
          <Text style={styles.dangerText}>{tr('delete_account')}</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>🚪 {t('Logout', 'लॉगआउट')}</Text>
      </TouchableOpacity>

      <Text style={styles.version}>{tr('version')}</Text>
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
  avatarText: { color: '#111827', fontSize: 30, fontWeight: 'bold' },
  name: { fontSize: 20, fontWeight: 'bold', color: '#111827', marginBottom: 4 },
  phone: { fontSize: 14, color: '#B3D4FF', marginBottom: 10 },
  planBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16, paddingVertical: 4, borderRadius: 12,
  },
  planBadgeText: { color: '#111827', fontSize: 12, fontWeight: 'bold' },
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
  menuLabelMain: { flex: 1, fontSize: 15, fontWeight: '600', color: COLORS.text },
  menuArrow: { fontSize: 22, color: COLORS.textSecondary },
  langCard: {
    backgroundColor: COLORS.white, marginHorizontal: 16, marginBottom: 12,
    borderRadius: 14, padding: 16,
  },
  langTitle: { fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: 12 },
  langRow: { flexDirection: 'row', gap: 10 },
  langBtn: {
    flex: 1, paddingVertical: 10, borderRadius: 10, borderWidth: 1.5,
    borderColor: COLORS.border, alignItems: 'center', backgroundColor: COLORS.background,
  },
  langBtnActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primary + '15' },
  langBtnText: { fontSize: 14, fontWeight: '600', color: COLORS.textSecondary },
  langBtnTextActive: { color: COLORS.primary },
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
