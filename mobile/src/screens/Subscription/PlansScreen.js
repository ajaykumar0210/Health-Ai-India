import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar,
} from 'react-native';
import { COLORS, PLANS } from '../../utils/constants';
import useAppStore from '../../store/useAppStore';

export default function PlansScreen({ navigation }) {
  const subscription = useAppStore((s) => s.subscription);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="dark-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>
        <Text style={styles.heading}>Plans चुनें</Text>
        <Text style={styles.sub}>Choose your health plan</Text>
      </View>

      <View style={styles.trustRow}>
        <Text style={styles.trustItem}>✅ Cancel anytime</Text>
        <Text style={styles.trustItem}>🔒 100% private</Text>
        <Text style={styles.trustItem}>💰 Money-back</Text>
      </View>

      {PLANS.map((plan) => {
        const isCurrent = subscription?.plan_type === plan.id;
        return (
          <View
            key={plan.id}
            style={[styles.planCard, { borderColor: plan.color }, isCurrent && styles.currentCard]}
          >
            {plan.tag && (
              <View style={[styles.tag, { backgroundColor: plan.color }]}>
                <Text style={styles.tagText}>{plan.tag}</Text>
              </View>
            )}
            {isCurrent && (
              <View style={[styles.tag, { backgroundColor: COLORS.success }]}>
                <Text style={styles.tagText}>Current Plan</Text>
              </View>
            )}

            <Text style={styles.planNameHi}>{plan.nameHi}</Text>
            <Text style={styles.planName}>{plan.name}</Text>

            <View style={styles.priceRow}>
              <Text style={[styles.price, { color: plan.color }]}>
                {plan.price === 0 ? 'FREE' : `₹${plan.price}`}
              </Text>
              <Text style={styles.period}>/{plan.period}</Text>
            </View>

            {plan.features.map((f, i) => (
              <View key={i} style={styles.featureRow}>
                <Text style={[styles.featureDot, { color: plan.color }]}>●</Text>
                <Text style={styles.featureText}>{f}</Text>
              </View>
            ))}

            <View style={styles.consultRow}>
              <Text style={styles.consultLabel}>Doctor Consultation:</Text>
              <Text style={[styles.consultPrice, { color: plan.color }]}>₹{plan.consultPrice}</Text>
            </View>

            <TouchableOpacity
              style={[styles.selectBtn, { backgroundColor: isCurrent ? COLORS.success : plan.color }]}
              onPress={() =>
                isCurrent
                  ? null
                  : navigation.navigate('Payment', { plan })
              }
              disabled={isCurrent}
            >
              <Text style={styles.selectBtnText}>
                {isCurrent ? '✓ Current Plan' : plan.price === 0 ? 'Start Free' : `Get ${plan.name}`}
              </Text>
            </TouchableOpacity>
          </View>
        );
      })}

      <Text style={styles.note}>
        💡 All plans include AI symptom checker in Hindi + English.
        Doctor consultations billed separately unless included in plan.
      </Text>
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    backgroundColor: COLORS.primary, padding: 20, paddingTop: 48,
  },
  back: { color: '#4B5563', fontSize: 22, marginBottom: 8 },
  heading: { fontSize: 24, fontWeight: 'bold', color: '#111827' },
  sub: { fontSize: 14, color: '#B3D4FF', marginTop: 4 },
  trustRow: {
    flexDirection: 'row', justifyContent: 'space-around',
    backgroundColor: COLORS.white, padding: 12,
  },
  trustItem: { fontSize: 12, color: COLORS.textSecondary },
  planCard: {
    backgroundColor: COLORS.white, margin: 16, marginBottom: 0,
    borderRadius: 14, padding: 20, borderWidth: 2, position: 'relative',
  },
  currentCard: { elevation: 4 },
  tag: {
    position: 'absolute', top: -10, right: 16,
    paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12,
  },
  tagText: { color: '#111827', fontSize: 11, fontWeight: 'bold' },
  planNameHi: { fontSize: 18, fontWeight: 'bold', color: COLORS.text },
  planName: { fontSize: 13, color: COLORS.textSecondary, marginBottom: 10 },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', marginBottom: 16 },
  price: { fontSize: 32, fontWeight: 'bold' },
  period: { fontSize: 14, color: COLORS.textSecondary, marginLeft: 4 },
  featureRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 6 },
  featureDot: { fontSize: 8, marginTop: 5, marginRight: 8 },
  featureText: { fontSize: 14, color: COLORS.text, flex: 1 },
  consultRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    borderTopWidth: 1, borderTopColor: COLORS.border,
    paddingTop: 12, marginTop: 12, marginBottom: 16,
  },
  consultLabel: { fontSize: 13, color: COLORS.textSecondary },
  consultPrice: { fontSize: 15, fontWeight: 'bold' },
  selectBtn: { borderRadius: 10, paddingVertical: 14, alignItems: 'center' },
  selectBtnText: { color: '#111827', fontWeight: 'bold', fontSize: 15 },
  note: {
    fontSize: 12, color: COLORS.textSecondary,
    margin: 16, lineHeight: 18, textAlign: 'center',
  },
});
