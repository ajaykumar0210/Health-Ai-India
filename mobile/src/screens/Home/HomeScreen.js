import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import useAppStore from '../../store/useAppStore';
import { COLORS, GRADIENTS, FONTS } from '../../utils/constants';

const { width } = Dimensions.get('window');

const QUICK_ACTIONS = [
  { id: 'ai', icon: '\u{1F916}', label: 'AI Diagnosis', sub: 'Instant answers', screen: 'SymptomChat', gradient: ['#F3F4F6', '#FFFFFF'] },
  { id: 'doc', icon: '\u{1F468}\u{200D}\u{2695}\u{FE0F}', label: 'Book Doctor', sub: 'Video consult', screen: 'DoctorList', gradient: ['#F3F4F6', '#FFFFFF'] },
  { id: 'rx', icon: '\u{1F48A}', label: 'Prescriptions', sub: 'Download PDFs', screen: 'HealthVault', gradient: ['#F3F4F6', '#FFFFFF'] },
  { id: 'checkin', icon: '\u{1F4CA}', label: 'Weekly Check-in', sub: 'Track progress', screen: 'WeeklyCheckIn', gradient: ['#F3F4F6', '#FFFFFF'] },
];

const HEALTH_CONCERNS = [
  { id: 'hair', label: 'Hair Fall', icon: '\u{1F487}', gradient: ['#F3F4F6', '#FFFFFF'], tag: 'Most searched' },
  { id: 'skin', label: 'Skin & Acne', icon: '\u{2728}', gradient: ['#F3F4F6', '#FFFFFF'], tag: '' },
  { id: 'stress', label: 'Stress & Sleep', icon: '\u{1F9E0}', gradient: ['#F3F4F6', '#FFFFFF'], tag: '' },
  { id: 'sexual', label: 'Sexual Health', icon: '\u{2764}\u{FE0F}', gradient: ['#F3F4F6', '#FFFFFF'], tag: 'Private' },
];

export default function HomeScreen({ navigation }) {
  const user = useAppStore((s) => s.user);
  const selectedConcerns = useAppStore((s) => s.selectedConcerns);
  const subscription = useAppStore((s) => s.subscription);
  const streaks = useAppStore((s) => s.streaks);

  const firstName = user?.name?.split(' ')[0] || 'Friend';
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';
  const healthScore = 72; // mock

  return (
    <ScrollView style={styles.root} showsVerticalScrollIndicator={false}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      {/* â”€â”€ Hero Header â”€â”€ */}
      <LinearGradient colors={GRADIENTS.hero} style={styles.hero} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
        <View style={styles.heroDeco} />
        <View style={styles.heroTop}>
          <View>
            <Text style={styles.greetingText}>{greeting}, {firstName} {'\u{1F44B}'}</Text>
            <Text style={styles.heroDate}>
              {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
            </Text>
          </View>
          <View style={styles.heroRight}>
            <TouchableOpacity style={styles.notifBtn} onPress={() => navigation.navigate('Notifications')}>
              <Ionicons name="notifications-outline" size={22} color="#111827" />
              <View style={styles.notifDot} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
              <LinearGradient colors={['#D4A017', '#B8860B']} style={styles.avatarCircle}>
                <Text style={styles.avatarText}>{firstName[0].toUpperCase()}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        {/* Health Score Card */}
        <View style={styles.scoreCard}>
          <View style={styles.scoreLeft}>
            <Text style={styles.scoreLabel}>Health Score</Text>
            <Text style={styles.scoreVal}>{healthScore}<Text style={styles.scoreOf}>/100</Text></Text>
            <Text style={styles.scoreSub}>{'\u{1F525}'} {streaks} day streak {'\u{2022}'} Keep going!</Text>
          </View>
          <View style={styles.scoreRight}>
            <View style={styles.scoreRing}>
              <Text style={styles.scoreRingVal}>{healthScore}%</Text>
            </View>
            <TouchableOpacity style={styles.scoreCta} onPress={() => navigation.navigate('Dashboard')}>
              <Text style={styles.scoreCtaText}>View Details {'\u{2192}'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      {/* â”€â”€ Plan Banner â”€â”€ */}
      {(!subscription?.plan_type || subscription.plan_type === 'freemium') && (
        <TouchableOpacity style={styles.planBanner} onPress={() => navigation.navigate('Plans')} activeOpacity={0.85}>
          <LinearGradient colors={['#D4A017', '#B8860B']} style={styles.planBannerGrad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
            <View>
              <Text style={styles.planBannerTitle}>Upgrade to Premium</Text>
              <Text style={styles.planBannerSub}>Unlimited AI {'\u{2022}'} Doctor calls {'\u{2022}'} Prescriptions</Text>
            </View>
            <View style={styles.planBannerPill}>
              <Text style={styles.planBannerPrice}>{'\u{20B9}'}149/mo</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      )}

      {/* â”€â”€ Quick Actions â”€â”€ */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickGrid}>
          {QUICK_ACTIONS.map((a) => (
            <TouchableOpacity
              key={a.id}
              style={styles.quickCard}
              onPress={() => navigation.navigate(a.screen)}
              activeOpacity={0.85}
            >
              <LinearGradient colors={a.gradient} style={styles.quickCardGrad}>
                <Text style={styles.quickIcon}>{a.icon}</Text>
                <Text style={styles.quickLabel}>{a.label}</Text>
                <Text style={styles.quickSub}>{a.sub}</Text>
                <Ionicons name="arrow-forward-outline" size={14} color="rgba(255,255,255,0.7)" style={{ marginTop: 8 }} />
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* â”€â”€ Treat Your Concern â”€â”€ */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Treat Your Concern</Text>
          <TouchableOpacity onPress={() => navigation.navigate('ProblemSelect')}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.concernsScroll}>
          {HEALTH_CONCERNS.map((c) => (
            <TouchableOpacity
              key={c.id}
              style={styles.concernCard}
              onPress={() => navigation.navigate('SymptomChat', { concern: c.id })}
              activeOpacity={0.85}
            >
              <LinearGradient colors={c.gradient} style={styles.concernCardGrad}>
                {!!c.tag && (
                  <View style={styles.concernTag}>
                    <Text style={styles.concernTagText}>{c.tag}</Text>
                  </View>
                )}
                <Text style={styles.concernIcon}>{c.icon}</Text>
                <Text style={styles.concernLabel}>{c.label}</Text>
                <Text style={styles.concernCta}>Get Treatment {'\u{2192}'}</Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* â”€â”€ Doctors Near You â”€â”€ */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Top Doctors</Text>
          <TouchableOpacity onPress={() => navigation.navigate('DoctorList')}>
            <Text style={styles.seeAll}>View All</Text>
          </TouchableOpacity>
        </View>
        {[
          { name: 'Dr. Priya Sharma', spec: 'Dermatologist', exp: '8 yrs', rating: '4.9', price: '\u{20B9}399', avail: 'Available Now', emoji: '\u{1F469}\u{200D}\u{2695}\u{FE0F}' },
          { name: 'Dr. Rajan Mehta', spec: 'Trichologist', exp: '12 yrs', rating: '4.8', price: '\u{20B9}499', avail: 'Today 6 PM', emoji: '\u{1F468}\u{200D}\u{2695}\u{FE0F}' },
        ].map((doc, i) => (
          <TouchableOpacity
            key={i}
            style={styles.docCard}
            onPress={() => navigation.navigate('DoctorList')}
            activeOpacity={0.85}
          >
            <View style={styles.docAvatar}>
              <Text style={{ fontSize: 28 }}>{doc.emoji}</Text>
            </View>
            <View style={styles.docInfo}>
              <Text style={styles.docName}>{doc.name}</Text>
              <Text style={styles.docSpec}>{doc.spec} {'\u{2022}'} {doc.exp}</Text>
              <View style={styles.docMeta}>
                <Text style={styles.docRating}>{'\u{2B50}'} {doc.rating}</Text>
                <View style={[styles.availPill, { backgroundColor: doc.avail === 'Available Now' ? COLORS.successBg : COLORS.warningBg }]}>
                  <Text style={[styles.availText, { color: doc.avail === 'Available Now' ? COLORS.success : COLORS.warning }]}>{doc.avail}</Text>
                </View>
              </View>
            </View>
            <View style={styles.docRight}>
              <Text style={styles.docPrice}>{doc.price}</Text>
              <TouchableOpacity style={styles.bookBtn} onPress={() => navigation.navigate('DoctorList')}>
                <Text style={styles.bookBtnText}>Book</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* â”€â”€ Wellness Tips â”€â”€ */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Wellness Tips</Text>
          <TouchableOpacity onPress={() => navigation.navigate('WellnessFeed')}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tipsScroll}>
          {[
            { icon: '\u{1F4A7}', title: 'Drink 8 glasses of water', color: '#1F2937', accent: '#D4A017', tag: 'Hydration' },
            { icon: '\u{1F319}', title: '7-8 hours of sleep daily', color: '#1F2937', accent: '#D4A017', tag: 'Sleep' },
            { icon: '\u{1F6B6}', title: '10,000 steps a day', color: '#1F2937', accent: '#D4A017', tag: 'Fitness' },
          ].map((tip, i) => (
            <TouchableOpacity key={i} style={[styles.tipCard, { backgroundColor: tip.color }]} activeOpacity={0.85}>
              <Text style={[styles.tipTag, { color: tip.accent }]}>{tip.tag}</Text>
              <Text style={styles.tipIcon}>{tip.icon}</Text>
              <Text style={styles.tipTitle}>{tip.title}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },

  // Hero
  hero: { paddingTop: 52, paddingBottom: 24, paddingHorizontal: 20, overflow: 'hidden' },
  heroDeco: {
    position: 'absolute', right: -80, top: -40,
    width: 300, height: 300, borderRadius: 150,
    backgroundColor: 'rgba(212,160,23,0.08)',
  },
  heroTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  greetingText: { fontFamily: FONTS.bold, fontSize: 20, color: '#111827' },
  heroDate: { fontFamily: FONTS.regular, fontSize: 12, color: '#6B7280', marginTop: 2 },
  heroRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  notifBtn: { position: 'relative', width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(0,0,0,0.05)', alignItems: 'center', justifyContent: 'center' },
  notifDot: { position: 'absolute', top: 8, right: 8, width: 8, height: 8, borderRadius: 4, backgroundColor: '#D4A017', borderWidth: 1.5, borderColor: '#0B0B0B' },
  avatarCircle: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontFamily: FONTS.bold, fontSize: 18, color: '#111827' },

  scoreCard: {
    flexDirection: 'row', backgroundColor: 'rgba(0,0,0,0.04)',
    borderRadius: 20, padding: 18, borderWidth: 1, borderColor: '#E5E7EB',
  },
  scoreLeft: { flex: 1 },
  scoreLabel: { fontFamily: FONTS.medium, fontSize: 12, color: '#6B7280', marginBottom: 4 },
  scoreVal: { fontFamily: FONTS.bold, fontSize: 36, color: '#111827' },
  scoreOf: { fontSize: 16, color: '#6B7280' },
  scoreSub: { fontFamily: FONTS.regular, fontSize: 12, color: '#6B7280', marginTop: 6 },
  scoreRight: { alignItems: 'center', justifyContent: 'center', gap: 12 },
  scoreRing: {
    width: 64, height: 64, borderRadius: 32,
    borderWidth: 4, borderColor: '#D4A017',
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(212,160,23,0.08)',
  },
  scoreRingVal: { fontFamily: FONTS.bold, fontSize: 14, color: '#D4A017' },
  scoreCta: { backgroundColor: 'rgba(0,0,0,0.06)', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6 },
  scoreCtaText: { fontFamily: FONTS.medium, fontSize: 12, color: '#111827' },

  // Plan Banner
  planBanner: { marginHorizontal: 16, marginTop: 16, borderRadius: 16, overflow: 'hidden' },
  planBannerGrad: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
  planBannerTitle: { fontFamily: FONTS.bold, fontSize: 16, color: '#111827' },
  planBannerSub: { fontFamily: FONTS.regular, fontSize: 12, color: '#4B5563', marginTop: 2 },
  planBannerPill: { backgroundColor: 'rgba(0,0,0,0.08)', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8 },
  planBannerPrice: { fontFamily: FONTS.bold, fontSize: 15, color: '#111827' },

  // Sections
  section: { paddingHorizontal: 16, marginTop: 24 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  sectionTitle: { fontFamily: FONTS.bold, fontSize: 18, color: COLORS.text },
  seeAll: { fontFamily: FONTS.semiBold, fontSize: 13, color: COLORS.primary },

  // Quick Actions
  quickGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  quickCard: { width: (width - 44) / 2, borderRadius: 20, overflow: 'hidden' },
  quickCardGrad: { padding: 18, minHeight: 130 },
  quickIcon: { fontSize: 28, marginBottom: 8 },
  quickLabel: { fontFamily: FONTS.bold, fontSize: 15, color: '#111827' },
  quickSub: { fontFamily: FONTS.regular, fontSize: 12, color: '#6B7280', marginTop: 2 },

  // Concerns
  concernsScroll: { paddingRight: 8, gap: 12 },
  concernCard: { width: 150, borderRadius: 20, overflow: 'hidden' },
  concernCardGrad: { padding: 18, minHeight: 160 },
  concernTag: {
    backgroundColor: 'rgba(0,0,0,0.08)', borderRadius: 10,
    paddingHorizontal: 8, paddingVertical: 3, alignSelf: 'flex-start', marginBottom: 10,
  },
  concernTagText: { fontFamily: FONTS.bold, fontSize: 9, color: '#111827', letterSpacing: 0.5 },
  concernIcon: { fontSize: 32, marginBottom: 8 },
  concernLabel: { fontFamily: FONTS.bold, fontSize: 15, color: '#111827', marginBottom: 8 },
  concernCta: { fontFamily: FONTS.regular, fontSize: 11, color: '#4B5563' },

  // Doctor cards
  docCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#F3F4F6', borderRadius: 16, padding: 14,
    marginBottom: 12, borderWidth: 1, borderColor: '#E5E7EB',
  },
  docAvatar: {
    width: 52, height: 52, borderRadius: 16, backgroundColor: COLORS.cream,
    alignItems: 'center', justifyContent: 'center', marginRight: 12,
  },
  docInfo: { flex: 1 },
  docName: { fontFamily: FONTS.semiBold, fontSize: 15, color: COLORS.text },
  docSpec: { fontFamily: FONTS.regular, fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  docMeta: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 6 },
  docRating: { fontFamily: FONTS.medium, fontSize: 12, color: COLORS.text },
  availPill: { borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3 },
  availText: { fontFamily: FONTS.medium, fontSize: 11 },
  docRight: { alignItems: 'flex-end', gap: 8 },
  docPrice: { fontFamily: FONTS.bold, fontSize: 15, color: COLORS.text },
  bookBtn: {
    backgroundColor: COLORS.primary, borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 7,
  },
  bookBtnText: { fontFamily: FONTS.bold, fontSize: 12, color: '#111827' },

  // Tips
  tipsScroll: { paddingRight: 8, gap: 12 },
  tipCard: { width: 160, borderRadius: 16, padding: 16 },
  tipTag: { fontFamily: FONTS.bold, fontSize: 10, letterSpacing: 1, marginBottom: 8 },
  tipIcon: { fontSize: 28, marginBottom: 8 },
  tipTitle: { fontFamily: FONTS.medium, fontSize: 13, color: COLORS.text, lineHeight: 18 },
});

