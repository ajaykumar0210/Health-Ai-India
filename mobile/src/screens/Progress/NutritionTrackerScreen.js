import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  StatusBar, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, GRADIENTS, FONTS } from '../../utils/constants';

const MEAL_TIMES = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'];

const MACRO_DATA = { calories: 1820, target: 2200, protein: 68, carbs: 210, fat: 62 };

const MEAL_LOG = [
  { meal: 'Breakfast', items: ['Oats with milk', 'Banana'], cal: 340, time: '8:30 AM' },
  { meal: 'Lunch', items: ['Dal rice', 'Salad', 'Curd'], cal: 620, time: '1:00 PM' },
  { meal: 'Snacks', items: ['Green tea', 'Almonds (10)'], cal: 120, time: '5:00 PM' },
];

const WATER_GLASSES = 6;

export default function NutritionTrackerScreen({ navigation }) {
  const [selectedMeal, setSelectedMeal] = useState('Breakfast');
  const [water, setWater] = useState(WATER_GLASSES);

  const progress = (MACRO_DATA.calories / MACRO_DATA.target) * 100;

  return (
    <View style={styles.root}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      <LinearGradient colors={['#059669', '#0D9488']} style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.headerTitle}>Nutrition Tracker</Text>
            <Text style={styles.headerDate}>{new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' })}</Text>
          </View>
          <TouchableOpacity style={styles.logBtn} onPress={() => Alert.alert('Add Food', 'Search and add food items')}>
            <Ionicons name="add" size={22} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Calorie ring */}
        <View style={styles.calCard}>
          <View style={styles.calLeft}>
            <Text style={styles.calLabel}>Calories Today</Text>
            <Text style={styles.calVal}>{MACRO_DATA.calories}<Text style={styles.calTarget}>/{MACRO_DATA.target}</Text></Text>
            <Text style={styles.calSub}>{MACRO_DATA.target - MACRO_DATA.calories} kcal remaining</Text>
            {/* Progress bar */}
            <View style={styles.calBar}>
              <View style={[styles.calFill, { width: `${Math.min(progress, 100)}%` }]} />
            </View>
          </View>
          <View style={styles.macroCol}>
            {[
              { label: 'Protein', val: `${MACRO_DATA.protein}g`, color: '#F87171' },
              { label: 'Carbs', val: `${MACRO_DATA.carbs}g`, color: '#60A5FA' },
              { label: 'Fat', val: `${MACRO_DATA.fat}g`, color: '#FBBF24' },
            ].map((m) => (
              <View key={m.label} style={styles.macroItem}>
                <View style={[styles.macroDot, { backgroundColor: m.color }]} />
                <View>
                  <Text style={styles.macroVal}>{m.val}</Text>
                  <Text style={styles.macroLabel}>{m.label}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.body}>

        {/* Water tracker */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>💧 Water Intake</Text>
            <Text style={styles.sectionMeta}>{water}/8 glasses</Text>
          </View>
          <View style={styles.waterRow}>
            {Array.from({ length: 8 }).map((_, i) => (
              <TouchableOpacity
                key={i}
                style={[styles.waterGlass, i < water && styles.waterGlassFilled]}
                onPress={() => setWater(i + 1)}
              >
                <Text style={styles.waterEmoji}>{i < water ? '💧' : '🥛'}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Meal tabs */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Meals</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 12 }} contentContainerStyle={{ gap: 8 }}>
            {MEAL_TIMES.map((m) => (
              <TouchableOpacity
                key={m}
                style={[styles.mealTab, selectedMeal === m && styles.mealTabActive]}
                onPress={() => setSelectedMeal(m)}
              >
                <Text style={[styles.mealTabText, selectedMeal === m && styles.mealTabTextActive]}>{m}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Meal logs */}
          {MEAL_LOG.map((meal) => (
            <View key={meal.meal} style={styles.mealCard}>
              <View style={styles.mealCardHeader}>
                <Text style={styles.mealName}>{meal.meal}</Text>
                <Text style={styles.mealTime}>{meal.time}</Text>
                <Text style={styles.mealCal}>{meal.cal} kcal</Text>
              </View>
              {meal.items.map((item, i) => (
                <View key={i} style={styles.mealItem}>
                  <Ionicons name="ellipse" size={6} color={COLORS.success} />
                  <Text style={styles.mealItemText}>{item}</Text>
                </View>
              ))}
              <TouchableOpacity style={styles.addItemBtn}>
                <Ionicons name="add-circle-outline" size={16} color={COLORS.success} />
                <Text style={styles.addItemText}>Add item</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Hair & Skin Nutrition Tips */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>For Your Hair & Skin</Text>
          {[
            { icon: '🥚', title: 'Eggs', benefit: 'Biotin & protein for hair strength', status: 'eaten' },
            { icon: '🐟', title: 'Omega-3 Foods', benefit: 'Reduces inflammation & hair fall', status: 'missing' },
            { icon: '🟠', title: 'Vitamin C Foods', benefit: 'Collagen synthesis for skin glow', status: 'eaten' },
          ].map((t, i) => (
            <View key={i} style={styles.tipRow}>
              <Text style={styles.tipRowIcon}>{t.icon}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.tipRowTitle}>{t.title}</Text>
                <Text style={styles.tipRowBenefit}>{t.benefit}</Text>
              </View>
              <View style={[styles.statusPill, { backgroundColor: t.status === 'eaten' ? COLORS.successBg : COLORS.errorBg }]}>
                <Text style={[styles.statusText, { color: t.status === 'eaten' ? COLORS.success : COLORS.error }]}>
                  {t.status === 'eaten' ? '✓ Eaten' : '+ Add'}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },
  header: { paddingTop: 56, paddingBottom: 24, paddingHorizontal: 20 },
  backBtn: {
    width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center', justifyContent: 'center', marginBottom: 14,
  },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  headerTitle: { fontFamily: FONTS.bold, fontSize: 22, color: '#fff' },
  headerDate: { fontFamily: FONTS.regular, fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
  logBtn: {
    width: 44, height: 44, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
  calCard: {
    flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 20, padding: 18, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)',
  },
  calLeft: { flex: 1 },
  calLabel: { fontFamily: FONTS.medium, fontSize: 12, color: 'rgba(255,255,255,0.7)', marginBottom: 4 },
  calVal: { fontFamily: FONTS.bold, fontSize: 32, color: '#fff' },
  calTarget: { fontFamily: FONTS.regular, fontSize: 16, color: 'rgba(255,255,255,0.5)' },
  calSub: { fontFamily: FONTS.regular, fontSize: 11, color: 'rgba(255,255,255,0.6)', marginTop: 4, marginBottom: 10 },
  calBar: { height: 6, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 3, width: '80%' },
  calFill: { height: 6, backgroundColor: '#fff', borderRadius: 3 },
  macroCol: { justifyContent: 'space-around', paddingLeft: 16 },
  macroItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  macroDot: { width: 8, height: 8, borderRadius: 4 },
  macroVal: { fontFamily: FONTS.bold, fontSize: 13, color: '#fff' },
  macroLabel: { fontFamily: FONTS.regular, fontSize: 10, color: 'rgba(255,255,255,0.6)' },

  body: { padding: 16 },
  section: { marginBottom: 24 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontFamily: FONTS.bold, fontSize: 17, color: COLORS.text, marginBottom: 12 },
  sectionMeta: { fontFamily: FONTS.medium, fontSize: 13, color: COLORS.success },

  waterRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  waterGlass: {
    width: 48, height: 48, borderRadius: 12,
    backgroundColor: COLORS.border, alignItems: 'center', justifyContent: 'center',
  },
  waterGlassFilled: { backgroundColor: '#DBEAFE' },
  waterEmoji: { fontSize: 22 },

  mealTab: {
    paddingHorizontal: 18, paddingVertical: 9, borderRadius: 20,
    borderWidth: 1.5, borderColor: COLORS.border, backgroundColor: COLORS.white,
  },
  mealTabActive: { backgroundColor: COLORS.success, borderColor: COLORS.success },
  mealTabText: { fontFamily: FONTS.medium, fontSize: 13, color: COLORS.textSecondary },
  mealTabTextActive: { color: '#fff', fontFamily: FONTS.semiBold },

  mealCard: {
    backgroundColor: COLORS.white, borderRadius: 16, padding: 16,
    marginBottom: 12, shadowColor: COLORS.shadow, shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1, shadowRadius: 8, elevation: 3,
  },
  mealCardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  mealName: { fontFamily: FONTS.bold, fontSize: 14, color: COLORS.text, flex: 1 },
  mealTime: { fontFamily: FONTS.regular, fontSize: 12, color: COLORS.textLight, marginRight: 8 },
  mealCal: { fontFamily: FONTS.semiBold, fontSize: 13, color: COLORS.success },
  mealItem: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 3 },
  mealItemText: { fontFamily: FONTS.regular, fontSize: 13, color: COLORS.textSecondary },
  addItemBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: COLORS.border },
  addItemText: { fontFamily: FONTS.medium, fontSize: 13, color: COLORS.success },

  tipRow: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white,
    borderRadius: 14, padding: 14, marginBottom: 8, gap: 12,
    shadowColor: COLORS.shadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 1, shadowRadius: 6, elevation: 2,
  },
  tipRowIcon: { fontSize: 24 },
  tipRowTitle: { fontFamily: FONTS.semiBold, fontSize: 14, color: COLORS.text },
  tipRowBenefit: { fontFamily: FONTS.regular, fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  statusPill: { borderRadius: 10, paddingHorizontal: 10, paddingVertical: 5 },
  statusText: { fontFamily: FONTS.bold, fontSize: 11 },
});
