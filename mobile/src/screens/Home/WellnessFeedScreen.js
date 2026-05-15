import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, GRADIENTS, FONTS } from '../../utils/constants';

const CATEGORIES = ['All', 'Hair', 'Skin', 'Nutrition', 'Sleep', 'Mental'];

const ARTICLES = [
  {
    id: '1', cat: 'Hair', emoji: 'ðŸ’‡â€â™‚ï¸', readTime: '4 min',
    title: '7 Science-Backed Ways to Stop Hair Fall',
    sub: 'From DHT blockers to biotin â€” what actually works vs what\'s a myth.',
    gradient: ['#1E3A5F', '#3B82C4'], tag: 'TRENDING',
  },
  {
    id: '2', cat: 'Skin', emoji: 'âœ¨', readTime: '6 min',
    title: 'The Indian Skincare Routine for Pigmentation',
    sub: 'Niacinamide, Kojic Acid & Sunscreen â€” the dermat-approved combo.',
    gradient: ['#0D9488', '#14B8A6'], tag: 'EXPERT',
  },
  {
    id: '3', cat: 'Nutrition', emoji: 'ðŸ¥—', readTime: '3 min',
    title: 'Foods That Boost Hair Growth Naturally',
    sub: 'Amla, spinach, eggs â€” the Indian superfoods your hair loves.',
    gradient: ['#059669', '#0D9488'], tag: '',
  },
  {
    id: '4', cat: 'Sleep', emoji: 'ðŸŒ™', readTime: '5 min',
    title: 'How Bad Sleep Causes Hair Loss & Acne',
    sub: 'The cortisol-sleep-skin connection explained simply.',
    gradient: ['#1E1B4B', '#4338CA'], tag: 'NEW',
  },
  {
    id: '5', cat: 'Mental', emoji: 'ðŸ§ ', readTime: '7 min',
    title: 'Stress & Hair Fall: Break the Cycle',
    sub: 'Telogen effluvium is real. Here\'s how to manage stress-induced hair loss.',
    gradient: ['#D97706', '#F59E0B'], tag: '',
  },
  {
    id: '6', cat: 'Skin', emoji: 'ðŸ§´', readTime: '4 min',
    title: 'Tretinoin vs Retinol: What Indian Skin Needs',
    sub: 'A dermatologist\'s guide to retinoids for Indian skin types.',
    gradient: ['#DB2777', '#EC4899'], tag: 'EXPERT',
  },
];

export default function WellnessFeedScreen({ navigation }) {
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = activeCategory === 'All'
    ? ARTICLES
    : ARTICLES.filter((a) => a.cat === activeCategory);

  return (
    <View style={styles.root}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      {/* Header */}
      <LinearGradient colors={GRADIENTS.hero} style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Wellness Feed</Text>
        <Text style={styles.headerSub}>Expert-curated health articles</Text>
      </LinearGradient>

      {/* Category tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catBar} contentContainerStyle={styles.catContent}>
        {CATEGORIES.map((c) => (
          <TouchableOpacity
            key={c}
            style={[styles.catChip, activeCategory === c && styles.catChipActive]}
            onPress={() => setActiveCategory(c)}
          >
            <Text style={[styles.catText, activeCategory === c && styles.catTextActive]}>{c}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Articles list */}
      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        {filtered.map((a, i) => (
          <TouchableOpacity key={a.id} style={styles.card} activeOpacity={0.85}>
            <LinearGradient colors={a.gradient} style={styles.cardLeft}>
              {!!a.tag && (
                <View style={styles.articleTag}>
                  <Text style={styles.articleTagText}>{a.tag}</Text>
                </View>
              )}
              <Text style={styles.cardEmoji}>{a.emoji}</Text>
              <Text style={styles.cardCat}>{a.cat}</Text>
            </LinearGradient>
            <View style={styles.cardRight}>
              <Text style={styles.cardTitle} numberOfLines={2}>{a.title}</Text>
              <Text style={styles.cardSub} numberOfLines={2}>{a.sub}</Text>
              <View style={styles.cardMeta}>
                <Ionicons name="time-outline" size={12} color={COLORS.textLight} />
                <Text style={styles.cardRead}>{a.readTime} read</Text>
                <TouchableOpacity style={styles.readBtn}>
                  <Text style={styles.readBtnText}>Read â†’</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        ))}
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },
  header: { paddingTop: 56, paddingBottom: 24, paddingHorizontal: 20 },
  backBtn: {
    width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center', justifyContent: 'center', marginBottom: 14,
  },
  headerTitle: { fontFamily: FONTS.bold, fontSize: 24, color: '#fff', marginBottom: 4 },
  headerSub: { fontFamily: FONTS.regular, fontSize: 13, color: 'rgba(255,255,255,0.6)' },

  catBar: { maxHeight: 60, backgroundColor: COLORS.white, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  catContent: { paddingHorizontal: 16, paddingVertical: 12, gap: 8, alignItems: 'center' },
  catChip: {
    paddingHorizontal: 18, paddingVertical: 8, borderRadius: 20,
    backgroundColor: COLORS.background, borderWidth: 1.5, borderColor: COLORS.border,
  },
  catChipActive: { backgroundColor: COLORS.dark, borderColor: COLORS.dark },
  catText: { fontFamily: FONTS.medium, fontSize: 13, color: COLORS.textSecondary },
  catTextActive: { color: '#fff' },

  list: { padding: 16, gap: 14 },
  card: {
    flexDirection: 'row', backgroundColor: COLORS.white, borderRadius: 20,
    overflow: 'hidden', shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 1, shadowRadius: 12, elevation: 4,
  },
  cardLeft: {
    width: 90, paddingVertical: 16, paddingHorizontal: 12,
    alignItems: 'center', justifyContent: 'flex-end', gap: 4,
    position: 'relative',
  },
  articleTag: {
    position: 'absolute', top: 8, left: 6,
    backgroundColor: 'rgba(255,255,255,0.25)', borderRadius: 6,
    paddingHorizontal: 5, paddingVertical: 2,
  },
  articleTagText: { fontFamily: FONTS.bold, fontSize: 7, color: '#fff', letterSpacing: 0.5 },
  cardEmoji: { fontSize: 28 },
  cardCat: { fontFamily: FONTS.bold, fontSize: 9, color: 'rgba(255,255,255,0.8)', letterSpacing: 1 },
  cardRight: { flex: 1, padding: 14 },
  cardTitle: { fontFamily: FONTS.bold, fontSize: 14, color: COLORS.text, lineHeight: 20, marginBottom: 4 },
  cardSub: { fontFamily: FONTS.regular, fontSize: 12, color: COLORS.textSecondary, lineHeight: 17, marginBottom: 10 },
  cardMeta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  cardRead: { fontFamily: FONTS.regular, fontSize: 11, color: COLORS.textLight, flex: 1 },
  readBtn: { backgroundColor: COLORS.primaryBg, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  readBtnText: { fontFamily: FONTS.semiBold, fontSize: 11, color: COLORS.primary },
});
