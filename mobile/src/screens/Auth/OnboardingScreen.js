import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, FlatList, Dimensions,
  TouchableOpacity, StatusBar, Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, GRADIENTS, FONTS } from '../../utils/constants';

const { width, height } = Dimensions.get('window');

const SLIDES = [
  {
    id: '1',
    tag: 'HAIR CARE',
    icon: 'ðŸ’‡â€â™‚ï¸',
    title: 'Stop Hair Fall.\nStart Growing.',
    sub: 'Personalised treatment plans by certified trichologists & AI â€” like Traya but smarter.',
    stats: [{ val: '93%', label: 'Success Rate' }, { val: '1M+', label: 'Treated' }, { val: '12 Wk', label: 'Results' }],
    gradient: ['#122640', '#1E3A5F'],
    accent: '#1E3A5F',
    tagBg: '#1E3A5F22',
    tagColor: '#3B82C4',
  },
  {
    id: '2',
    tag: 'SKIN HEALTH',
    icon: 'âœ¨',
    title: 'Glow-Up with\nScience-Backed Care.',
    sub: 'Acne, dark spots, pigmentation â€” get prescription-grade solutions from dermatologists online.',
    stats: [{ val: '50K+', label: 'Skin Cases' }, { val: '4.8â˜…', label: 'Rating' }, { val: '48h', label: 'Consult' }],
    gradient: ['#0F172A', '#1E1B4B'],
    accent: '#0D9488',
    tagBg: '#0D948822',
    tagColor: '#14B8A6',
  },
  {
    id: '3',
    tag: 'AI DIAGNOSIS',
    icon: 'ðŸ¤–',
    title: 'AI That Speaks\nHindi & English.',
    sub: 'Describe symptoms in Hindi or English. Get instant root cause analysis, not just generic tips.',
    stats: [{ val: '500+', label: 'Conditions' }, { val: '24/7', label: 'Available' }, { val: 'ðŸ”’', label: 'Private' }],
    gradient: ['#0F2027', '#203A43', '#2C5364'],
    accent: '#0D9488',
    tagBg: '#0D948822',
    tagColor: '#2DD4BF',
  },
  {
    id: '4',
    tag: 'CERTIFIED DOCTORS',
    icon: 'ðŸ‘¨â€âš•ï¸',
    title: 'Real Doctors.\nReal Prescriptions.',
    sub: 'Video consult with MBBS/MD specialists. Get real prescription PDFs. Starting at just â‚¹149.',
    stats: [{ val: 'â‚¹149', label: 'Starting' }, { val: '200+', label: 'Doctors' }, { val: 'PDF', label: 'Prescription' }],
    gradient: ['#122640', '#16213E'],
    accent: '#1E3A5F',
    tagBg: '#1E3A5F22',
    tagColor: '#3B82C4',
  },
];

export default function OnboardingScreen({ navigation }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1, animated: true });
    } else {
      navigation.replace('Login');
    }
  };

  const renderSlide = ({ item }) => (
    <LinearGradient colors={item.gradient} style={styles.slide} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
      {/* Decorative circle */}
      <View style={[styles.decoCircle, { borderColor: item.accent + '20' }]} />
      <View style={[styles.decoCircle2, { borderColor: item.accent + '10' }]} />

      {/* Top tag */}
      <View style={[styles.tagPill, { backgroundColor: item.tagBg }]}>
        <Text style={[styles.tagText, { color: item.tagColor }]}>{item.tag}</Text>
      </View>

      {/* Main icon */}
      <View style={[styles.iconWrap, { borderColor: item.accent + '40', shadowColor: item.accent }]}>
        <Text style={styles.slideIcon}>{item.icon}</Text>
      </View>

      {/* Title */}
      <Text style={styles.slideTitle}>{item.title}</Text>

      {/* Subtitle */}
      <Text style={styles.slideSub}>{item.sub}</Text>

      {/* Stats row */}
      <View style={styles.statsRow}>
        {item.stats.map((s, i) => (
          <View key={i} style={[styles.statCard, { borderColor: item.accent + '30' }]}>
            <Text style={[styles.statVal, { color: item.accent }]}>{s.val}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>
    </LinearGradient>
  );

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      <Animated.FlatList
        ref={flatListRef}
        data={SLIDES}
        renderItem={renderSlide}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onMomentumScrollEnd={(e) => {
          setCurrentIndex(Math.round(e.nativeEvent.contentOffset.x / width));
        }}
        scrollEventThrottle={16}
      />

      {/* Bottom bar */}
      <View style={styles.bottomBar}>
        {/* Dots */}
        <View style={styles.dots}>
          {SLIDES.map((s, i) => {
            const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
            const dotWidth = scrollX.interpolate({ inputRange, outputRange: [8, 24, 8], extrapolate: 'clamp' });
            const opacity = scrollX.interpolate({ inputRange, outputRange: [0.4, 1, 0.4], extrapolate: 'clamp' });
            return (
              <Animated.View
                key={i}
                style={[styles.dot, { width: dotWidth, opacity, backgroundColor: SLIDES[currentIndex].accent }]}
              />
            );
          })}
        </View>

        {/* Skip */}
        <TouchableOpacity style={styles.skipBtn} onPress={() => navigation.replace('Login')}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>

        {/* Next / Get Started */}
        <TouchableOpacity onPress={handleNext} activeOpacity={0.85}>
          <LinearGradient colors={['#1E3A5F', '#3B82C4']} style={styles.nextBtn} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
            <Text style={styles.nextText}>
              {currentIndex === SLIDES.length - 1 ? 'Get Started' : 'Next'}
            </Text>
            <Ionicons name="arrow-forward" size={18} color="#fff" style={{ marginLeft: 6 }} />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B1929' },
  slide: {
    width, height, paddingTop: 80, paddingHorizontal: 28,
    alignItems: 'flex-start', justifyContent: 'center',
  },
  decoCircle: {
    position: 'absolute', right: -80, top: height * 0.1,
    width: 320, height: 320, borderRadius: 160, borderWidth: 1,
  },
  decoCircle2: {
    position: 'absolute', right: -140, top: height * 0.05,
    width: 500, height: 500, borderRadius: 250, borderWidth: 1,
  },
  tagPill: {
    borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6,
    marginBottom: 28, alignSelf: 'flex-start',
  },
  tagText: { fontFamily: FONTS.bold, fontSize: 11, letterSpacing: 2 },
  iconWrap: {
    width: 96, height: 96, borderRadius: 28, borderWidth: 1,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
    marginBottom: 28,
    shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.4, shadowRadius: 16, elevation: 10,
  },
  slideIcon: { fontSize: 44 },
  slideTitle: {
    fontFamily: FONTS.bold, fontSize: 34, color: '#FFFFFF',
    lineHeight: 42, marginBottom: 16,
  },
  slideSub: {
    fontFamily: FONTS.regular, fontSize: 15, color: 'rgba(255,255,255,0.65)',
    lineHeight: 24, marginBottom: 36,
  },
  statsRow: { flexDirection: 'row', gap: 12 },
  statCard: {
    flex: 1, borderWidth: 1, borderRadius: 16,
    paddingVertical: 14, alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  statVal: { fontFamily: FONTS.bold, fontSize: 20 },
  statLabel: { fontFamily: FONTS.regular, fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 2 },

  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    paddingBottom: 36, paddingHorizontal: 28, paddingTop: 20,
    backgroundColor: 'rgba(15,14,23,0.95)',
    borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.06)',
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  dots: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot: { height: 8, borderRadius: 4 },
  skipBtn: { padding: 8 },
  skipText: { fontFamily: FONTS.medium, fontSize: 14, color: 'rgba(255,255,255,0.45)' },
  nextBtn: {
    flexDirection: 'row', alignItems: 'center',
    borderRadius: 30, paddingHorizontal: 24, paddingVertical: 14,
    shadowColor: '#1E3A5F', shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45, shadowRadius: 12, elevation: 8,
  },
  nextText: { fontFamily: FONTS.bold, fontSize: 15, color: '#FFFFFF' },
});
