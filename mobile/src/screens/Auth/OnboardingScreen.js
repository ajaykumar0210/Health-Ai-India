import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, FlatList, Dimensions,
  TouchableOpacity, StatusBar, Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS } from '../../utils/constants';

const { width, height } = Dimensions.get('window');

const SLIDES = [
  {
    id: '1',
    tag: 'HAIR CARE',
    icon: '\uD83D\uDC87\u200D\u2642\uFE0F',
    title: 'Stop Hair Fall.\nStart Growing.',
    sub: 'Personalised treatment plans by certified trichologists & AI.',
    stats: [{ val: '93%', label: 'Success Rate' }, { val: '1M+', label: 'Treated' }, { val: '12 Wk', label: 'Results' }],
    gradient: ['#FFFFFF', '#F9FAFB'],
    accent: '#D4A017',
    tagBg: 'rgba(212,160,23,0.1)',
    tagColor: '#D4A017',
  },
  {
    id: '2',
    tag: 'SKIN HEALTH',
    icon: '\u2728',
    title: 'Glow-Up with\nScience-Backed Care.',
    sub: 'Acne, dark spots, pigmentation \u2014 get prescription-grade solutions from dermatologists online.',
    stats: [{ val: '50K+', label: 'Skin Cases' }, { val: '4.8\u2605', label: 'Rating' }, { val: '48h', label: 'Consult' }],
    gradient: ['#FFFFFF', '#F9FAFB'],
    accent: '#D4A017',
    tagBg: 'rgba(212,160,23,0.1)',
    tagColor: '#E6B422',
  },
  {
    id: '3',
    tag: 'AI DIAGNOSIS',
    icon: '\uD83E\uDD16',
    title: 'AI That Speaks\nHindi & English.',
    sub: 'Describe symptoms in Hindi or English. Get instant root cause analysis, not just generic tips.',
    stats: [{ val: '500+', label: 'Conditions' }, { val: '24/7', label: 'Available' }, { val: '\uD83D\uDD12', label: 'Private' }],
    gradient: ['#FFFFFF', '#F9FAFB'],
    accent: '#D4A017',
    tagBg: 'rgba(212,160,23,0.1)',
    tagColor: '#D4A017',
  },
  {
    id: '4',
    tag: 'CERTIFIED DOCTORS',
    icon: '\uD83D\uDC68\u200D\u2695\uFE0F',
    title: 'Real Doctors.\nReal Prescriptions.',
    sub: 'Video consult with MBBS/MD specialists. Get real prescription PDFs. Starting at just \u20B9149.',
    stats: [{ val: '\u20B9149', label: 'Starting' }, { val: '200+', label: 'Doctors' }, { val: 'PDF', label: 'Prescription' }],
    gradient: ['#FFFFFF', '#F9FAFB'],
    accent: '#D4A017',
    tagBg: 'rgba(212,160,23,0.1)',
    tagColor: '#E6B422',
  },
];

export default function OnboardingScreen({ navigation }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      const nextIndex = currentIndex + 1;
      // Update state first (works on web)
      setCurrentIndex(nextIndex);
      // Animate dot indicator manually (works on web + native)
      Animated.timing(scrollX, {
        toValue: nextIndex * width,
        duration: 300,
        useNativeDriver: false,
      }).start();
      // Also try FlatList scroll (works on native)
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
    } else {
      navigation.replace('Login');
    }
  };

  const renderSlide = ({ item }) => (
    <LinearGradient colors={item.gradient} style={styles.slide} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
      <View style={[styles.decoCircle, { borderColor: item.accent + '20' }]} />
      <View style={[styles.decoCircle2, { borderColor: item.accent + '10' }]} />

      <View style={[styles.tagPill, { backgroundColor: item.tagBg }]}>  
        <Text style={[styles.tagText, { color: item.tagColor }]}>{item.tag}</Text>
      </View>

      <View style={[styles.iconWrap, { borderColor: item.accent + '40', shadowColor: item.accent }]}>
        <Text style={styles.slideIcon}>{item.icon}</Text>
      </View>

      <Text style={styles.slideTitle}>{item.title}</Text>
      <Text style={styles.slideSub}>{item.sub}</Text>

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
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      {/* Render current slide directly — works on web + native */}
      {renderSlide({ item: SLIDES[currentIndex] })}

      {/* Hidden FlatList just to support swipe gestures on native */}
      <Animated.FlatList
        ref={flatListRef}
        data={SLIDES}
        renderItem={() => <View style={{ width, height }} />}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        getItemLayout={(_, index) => ({ length: width, offset: width * index, index })}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0 }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onMomentumScrollEnd={(e) => {
          setCurrentIndex(Math.round(e.nativeEvent.contentOffset.x / width));
        }}
        scrollEventThrottle={16}
      />

      <View style={styles.bottomBar}>
        <View style={styles.dots}>
          {SLIDES.map((s, i) => {
            const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
            const dotWidth = scrollX.interpolate({ inputRange, outputRange: [8, 24, 8], extrapolate: 'clamp' });
            const opacity = scrollX.interpolate({ inputRange, outputRange: [0.4, 1, 0.4], extrapolate: 'clamp' });
            return (
              <Animated.View
                key={i}
                style={[styles.dot, { width: dotWidth, opacity, backgroundColor: '#D4A017' }]}
              />
            );
          })}
        </View>

        <TouchableOpacity style={styles.skipBtn} onPress={() => navigation.replace('Login')}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={currentIndex === SLIDES.length - 1 ? () => navigation.replace('Login') : handleNext}
          activeOpacity={0.85}
        >
          <LinearGradient colors={['#D4A017', '#B8860B']} style={styles.nextBtn} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
            <Text style={styles.nextText}>
              {currentIndex === SLIDES.length - 1 ? 'Get Started' : 'Next'}
            </Text>
            <Ionicons name="arrow-forward" size={18} color="#0B0B0B" style={{ marginLeft: 6 }} />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
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
    backgroundColor: 'rgba(212,160,23,0.06)',
    marginBottom: 28,
    shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.4, shadowRadius: 16, elevation: 10,
  },
  slideIcon: { fontSize: 44 },
  slideTitle: {
    fontFamily: FONTS.bold, fontSize: 34, color: '#111827',
    lineHeight: 42, marginBottom: 16,
  },
  slideSub: {
    fontFamily: FONTS.regular, fontSize: 15, color: '#6B7280',
    lineHeight: 24, marginBottom: 32, maxWidth: '90%',
  },
  statsRow: { flexDirection: 'row', gap: 12 },
  statCard: {
    backgroundColor: 'rgba(31,41,55,0.5)', borderRadius: 14,
    paddingHorizontal: 16, paddingVertical: 12, borderWidth: 1,
    alignItems: 'center', minWidth: 80,
  },
  statVal: { fontFamily: FONTS.bold, fontSize: 16, marginBottom: 2 },
  statLabel: { fontFamily: FONTS.regular, fontSize: 11, color: '#6B7280' },
  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    paddingHorizontal: 24, paddingBottom: 40, paddingTop: 20,
    backgroundColor: 'rgba(11,11,11,0.9)',
    flexDirection: 'row', alignItems: 'center',
  },
  dots: { flexDirection: 'row', gap: 6, flex: 1 },
  dot: { height: 4, borderRadius: 2 },
  skipBtn: { marginRight: 16 },
  skipText: { fontFamily: FONTS.medium, fontSize: 14, color: '#6B7280' },
  nextBtn: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 24, paddingVertical: 14, borderRadius: 14,
  },
  nextText: { fontFamily: FONTS.bold, fontSize: 15, color: '#0B0B0B' },
});
