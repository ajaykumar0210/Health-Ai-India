import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, FlatList, Dimensions, TouchableOpacity, StatusBar,
} from 'react-native';
import { COLORS } from '../../utils/constants';

const { width } = Dimensions.get('window');

const SLIDES = [
  {
    id: '1',
    emoji: '🤖',
    title: 'AI Health Assistant',
    titleHi: 'AI स्वास्थ्य सहायक',
    desc: 'Get instant answers to your health questions in Hindi or English — completely private.',
    descHi: 'हिंदी या अंग्रेजी में अपने स्वास्थ्य सवालों के तुरंत जवाब पाएं — पूरी तरह निजी।',
    bg: '#1A73E8',
  },
  {
    id: '2',
    emoji: '👨‍⚕️',
    title: 'Licensed Doctors',
    titleHi: 'लाइसेंस प्राप्त डॉक्टर',
    desc: 'Book private video consultations with verified Indian doctors. Starting at ₹149.',
    descHi: 'सत्यापित भारतीय डॉक्टरों के साथ निजी वीडियो परामर्श बुक करें। ₹149 से शुरू।',
    bg: '#34A853',
  },
  {
    id: '3',
    emoji: '🔒',
    title: '100% Private & Secure',
    titleHi: '100% निजी और सुरक्षित',
    desc: 'Your data stays in India. No one — not even us — can see your health conversations.',
    descHi: 'आपका डेटा भारत में रहता है। कोई भी — हम भी नहीं — आपकी बातें नहीं देख सकता।',
    bg: '#FF6D00',
  },
  {
    id: '4',
    emoji: '💊',
    title: 'Prescription PDF',
    titleHi: 'प्रिस्क्रिप्शन PDF',
    desc: 'Get a real prescription PDF. Buy medicine from any medical store or 1mg yourself.',
    descHi: 'असली प्रिस्क्रिप्शन PDF पाएं। किसी भी मेडिकल स्टोर या 1mg से खुद दवाई खरीदें।',
    bg: '#9C27B0',
  },
];

export default function OnboardingScreen({ navigation }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
      setCurrentIndex(currentIndex + 1);
    } else {
      navigation.replace('Login');
    }
  };

  const renderSlide = ({ item }) => (
    <View style={[styles.slide, { backgroundColor: item.bg }]}>
      <Text style={styles.emoji}>{item.emoji}</Text>
      <Text style={styles.title}>{item.titleHi}</Text>
      <Text style={styles.subtitle}>{item.title}</Text>
      <Text style={styles.desc}>{item.descHi}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        renderItem={renderSlide}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
      />
      <View style={styles.footer}>
        <View style={styles.dots}>
          {SLIDES.map((_, i) => (
            <View
              key={i}
              style={[styles.dot, i === currentIndex && styles.dotActive]}
            />
          ))}
        </View>
        <TouchableOpacity style={styles.btn} onPress={handleNext}>
          <Text style={styles.btnText}>
            {currentIndex === SLIDES.length - 1 ? 'शुरू करें (Get Started)' : 'आगे (Next)'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.replace('Login')}>
          <Text style={styles.skip}>Skip</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  slide: {
    width,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingTop: 60,
  },
  emoji: { fontSize: 80, marginBottom: 24 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#fff', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 16, color: 'rgba(255,255,255,0.8)', marginBottom: 16 },
  desc: { fontSize: 15, color: 'rgba(255,255,255,0.9)', textAlign: 'center', lineHeight: 22 },
  footer: {
    padding: 24,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  dots: { flexDirection: 'row', marginBottom: 20 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#DDD', marginHorizontal: 4 },
  dotActive: { backgroundColor: COLORS.primary, width: 20 },
  btn: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 48,
    marginBottom: 12,
    width: '100%',
    alignItems: 'center',
  },
  btnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  skip: { color: COLORS.textSecondary, fontSize: 14 },
});
