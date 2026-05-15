import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Linking, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, GRADIENTS, FONTS } from '../../utils/constants';

const EMERGENCY_CONTACTS = [
  { name: 'Ambulance', number: '102', icon: '🚑', gradient: ['#DC2626', '#F87171'], priority: 1 },
  { name: 'Police', number: '100', icon: '👮', gradient: ['#1D4ED8', '#3B82F6'], priority: 2 },
  { name: 'Fire Service', number: '101', icon: '🚒', gradient: ['#D97706', '#F59E0B'], priority: 3 },
  { name: 'NDMA', number: '1078', icon: '🆘', gradient: ['#059669', '#34D399'], priority: 4 },
];

const FIRST_AID = [
  { title: 'Chest Pain / Heart Attack', steps: ['Call 102 immediately', 'Loosen tight clothing', 'Give aspirin if available & not allergic', 'Do NOT give food/water', 'Start CPR if unconscious'], icon: '❤️', urgent: true },
  { title: 'Severe Allergic Reaction', steps: ['Use EpiPen if available', 'Call 102', 'Lay person flat, elevate legs', 'Monitor breathing', 'Do NOT give antihistamines alone'], icon: '⚠️', urgent: true },
  { title: 'Choking Adult', steps: ['Ask "Are you choking?"', '5 back blows between shoulder blades', '5 abdominal thrusts (Heimlich)', 'Repeat until object is expelled', 'Call 102 if unconscious'], icon: '🫁', urgent: false },
  { title: 'Deep Cut / Bleeding', steps: ['Apply direct pressure', 'Elevate the wound', 'Keep pressing for 10-15 min', 'Do NOT remove embedded objects', 'Go to hospital if blood soaks through'], icon: '🩹', urgent: false },
];

export default function EmergencyScreen({ navigation }) {
  const [expandedCard, setExpandedCard] = useState(null);

  const callNumber = (number, name) => {
    Alert.alert(
      `Call ${name}`,
      `Are you sure you want to call ${name} at ${number}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: `Call ${number}`, style: 'destructive', onPress: () => Linking.openURL(`tel:${number}`) },
      ]
    );
  };

  return (
    <View style={styles.root}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      {/* Red Alert Header */}
      <LinearGradient colors={['#7F1D1D', '#DC2626']} style={styles.header} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerEmoji}>🆘</Text>
        <Text style={styles.headerTitle}>Emergency</Text>
        <Text style={styles.headerSub}>Quick access to emergency services & first aid</Text>

        {/* Big SOS button */}
        <TouchableOpacity
          style={styles.sosBtn}
          onPress={() => callNumber('102', 'Ambulance')}
          activeOpacity={0.9}
        >
          <View style={styles.sosBtnInner}>
            <Text style={styles.sosBtnText}>SOS</Text>
            <Text style={styles.sosBtnSub}>Call Ambulance 102</Text>
          </View>
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.body}>

        {/* Emergency numbers grid */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Emergency Numbers</Text>
          <View style={styles.emergencyGrid}>
            {EMERGENCY_CONTACTS.map((c, i) => (
              <TouchableOpacity
                key={i}
                style={styles.emergencyCard}
                onPress={() => callNumber(c.number, c.name)}
                activeOpacity={0.85}
              >
                <LinearGradient colors={c.gradient} style={styles.emergencyGrad}>
                  <Text style={styles.emergencyIcon}>{c.icon}</Text>
                  <Text style={styles.emergencyName}>{c.name}</Text>
                  <View style={styles.emergencyNumber}>
                    <Ionicons name="call" size={12} color="rgba(255,255,255,0.8)" />
                    <Text style={styles.emergencyNum}>{c.number}</Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Personal emergency contacts */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Personal Contacts</Text>
            <TouchableOpacity>
              <Text style={styles.addContact}>+ Add</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.personalContactsEmpty}>
            <Text style={styles.emptyIcon}>👥</Text>
            <Text style={styles.emptyTitle}>No emergency contacts added</Text>
            <Text style={styles.emptySub}>Add family members or close friends for quick access in emergencies.</Text>
            <TouchableOpacity style={styles.addContactBtn}>
              <Text style={styles.addContactBtnText}>Add Emergency Contact</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* First Aid Guide */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>First Aid Guide</Text>
          <Text style={styles.sectionSub}>Tap any situation for step-by-step guidance</Text>
          {FIRST_AID.map((item, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.firstAidCard, item.urgent && styles.firstAidUrgent]}
              onPress={() => setExpandedCard(expandedCard === i ? null : i)}
              activeOpacity={0.85}
            >
              <View style={styles.firstAidHeader}>
                <Text style={styles.firstAidIcon}>{item.icon}</Text>
                <Text style={[styles.firstAidTitle, item.urgent && { color: COLORS.error }]}>{item.title}</Text>
                {item.urgent && (
                  <View style={styles.urgentPill}>
                    <Text style={styles.urgentText}>URGENT</Text>
                  </View>
                )}
                <Ionicons
                  name={expandedCard === i ? 'chevron-up' : 'chevron-down'}
                  size={18} color={COLORS.textLight}
                />
              </View>
              {expandedCard === i && (
                <View style={styles.stepsWrap}>
                  {item.steps.map((step, j) => (
                    <View key={j} style={styles.stepRow}>
                      <View style={styles.stepNum}>
                        <Text style={styles.stepNumText}>{j + 1}</Text>
                      </View>
                      <Text style={styles.stepText}>{step}</Text>
                    </View>
                  ))}
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },
  header: { paddingTop: 56, paddingBottom: 28, paddingHorizontal: 20, alignItems: 'center' },
  backBtn: {
    position: 'absolute', top: 56, left: 20,
    width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center', justifyContent: 'center',
  },
  headerEmoji: { fontSize: 36, marginBottom: 8 },
  headerTitle: { fontFamily: FONTS.bold, fontSize: 26, color: '#fff', marginBottom: 4 },
  headerSub: { fontFamily: FONTS.regular, fontSize: 13, color: 'rgba(255,255,255,0.7)', marginBottom: 24 },
  sosBtn: {
    width: 140, height: 140, borderRadius: 70,
    borderWidth: 4, borderColor: 'rgba(255,255,255,0.4)',
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#fff', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.3, shadowRadius: 20, elevation: 10,
  },
  sosBtnInner: { alignItems: 'center' },
  sosBtnText: { fontFamily: FONTS.bold, fontSize: 36, color: '#fff', letterSpacing: 2 },
  sosBtnSub: { fontFamily: FONTS.medium, fontSize: 11, color: 'rgba(255,255,255,0.85)', marginTop: 4 },

  body: { padding: 16 },
  section: { marginBottom: 24 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontFamily: FONTS.bold, fontSize: 17, color: COLORS.text, marginBottom: 4 },
  sectionSub: { fontFamily: FONTS.regular, fontSize: 12, color: COLORS.textSecondary, marginBottom: 12 },
  addContact: { fontFamily: FONTS.semiBold, fontSize: 13, color: COLORS.primary },

  emergencyGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  emergencyCard: { width: '47%', borderRadius: 18, overflow: 'hidden' },
  emergencyGrad: { padding: 18, alignItems: 'center' },
  emergencyIcon: { fontSize: 32, marginBottom: 8 },
  emergencyName: { fontFamily: FONTS.bold, fontSize: 14, color: '#fff', marginBottom: 4 },
  emergencyNumber: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  emergencyNum: { fontFamily: FONTS.semiBold, fontSize: 16, color: 'rgba(255,255,255,0.9)' },

  personalContactsEmpty: {
    backgroundColor: COLORS.white, borderRadius: 18, padding: 24, alignItems: 'center',
    shadowColor: COLORS.shadow, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 1, shadowRadius: 8, elevation: 3,
  },
  emptyIcon: { fontSize: 40, marginBottom: 10 },
  emptyTitle: { fontFamily: FONTS.bold, fontSize: 15, color: COLORS.text, marginBottom: 6 },
  emptySub: { fontFamily: FONTS.regular, fontSize: 13, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 18, marginBottom: 16 },
  addContactBtn: { backgroundColor: COLORS.primary, borderRadius: 12, paddingHorizontal: 20, paddingVertical: 10 },
  addContactBtnText: { fontFamily: FONTS.semiBold, fontSize: 13, color: '#fff' },

  firstAidCard: {
    backgroundColor: COLORS.white, borderRadius: 16, padding: 16,
    marginBottom: 10, shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 3 }, shadowOpacity: 1, shadowRadius: 8, elevation: 3,
  },
  firstAidUrgent: { borderLeftWidth: 3, borderLeftColor: COLORS.error },
  firstAidHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  firstAidIcon: { fontSize: 22 },
  firstAidTitle: { fontFamily: FONTS.semiBold, fontSize: 14, color: COLORS.text, flex: 1 },
  urgentPill: { backgroundColor: COLORS.errorBg, borderRadius: 6, paddingHorizontal: 6, paddingVertical: 3 },
  urgentText: { fontFamily: FONTS.bold, fontSize: 9, color: COLORS.error, letterSpacing: 0.5 },
  stepsWrap: { marginTop: 16, paddingTop: 12, borderTopWidth: 1, borderTopColor: COLORS.border },
  stepRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 10 },
  stepNum: {
    width: 24, height: 24, borderRadius: 12, backgroundColor: COLORS.dark,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  stepNumText: { fontFamily: FONTS.bold, fontSize: 11, color: '#fff' },
  stepText: { fontFamily: FONTS.regular, fontSize: 13, color: COLORS.text, flex: 1, lineHeight: 19 },
});
