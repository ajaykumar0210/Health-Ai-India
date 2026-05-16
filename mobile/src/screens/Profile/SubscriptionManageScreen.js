import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert,
} from 'react-native';
import { COLORS, PLANS } from '../../utils/constants';
import { subscriptionsAPI } from '../../utils/api';
import useAppStore from '../../store/useAppStore';

export default function SubscriptionManageScreen({ navigation }) {
  const subscription = useAppStore((s) => s.subscription);
  const setSubscription = useAppStore((s) => s.setSubscription);

  const currentPlan = PLANS.find((p) => p.id === subscription?.plan_type) || PLANS[0];

  const handleCancel = () => {
    Alert.alert(
      'Cancel Subscription',
      'क्या आप subscription cancel करना चाहते हैं? आप plan period खत्म होने तक access रखेंगे।',
      [
        { text: 'Keep Plan', style: 'cancel' },
        {
          text: 'Cancel',
          style: 'destructive',
          onPress: async () => {
            try {
              await subscriptionsAPI.cancel();
            } catch {}
            setSubscription(null);
            Alert.alert('Cancelled', 'Your subscription has been cancelled.');
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>
        <Text style={styles.heading}>Subscription</Text>
        <Text style={styles.sub}>सब्सक्रिप्शन प्रबंधन</Text>
      </View>

      {/* Current plan */}
      <View style={[styles.planCard, { borderColor: currentPlan.color }]}>
        <Text style={styles.planStatus}>
          {subscription ? '✅ Active Plan' : 'Current Plan'}
        </Text>
        <Text style={[styles.planName, { color: currentPlan.color }]}>
          {currentPlan.nameHi}
        </Text>
        <Text style={styles.planNameEn}>{currentPlan.name}</Text>
        <Text style={styles.planPrice}>
          {currentPlan.price === 0 ? 'FREE' : `₹${currentPlan.price}/${currentPlan.period}`}
        </Text>

        {subscription?.end_date && (
          <Text style={styles.expiryText}>
            Expires: {new Date(subscription.end_date).toLocaleDateString('en-IN')}
          </Text>
        )}
      </View>

      {/* Features */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Plan Features</Text>
        {currentPlan.features.map((f, i) => (
          <Text key={i} style={styles.feature}>✓ {f}</Text>
        ))}
        <Text style={styles.consultLine}>
          Doctor Consultation: <Text style={{ color: currentPlan.color, fontWeight: 'bold' }}>₹{currentPlan.consultPrice}</Text> per visit
        </Text>
      </View>

      {/* Upgrade */}
      {(!subscription || subscription.plan_type === 'freemium') && (
        <TouchableOpacity
          style={styles.upgradeBtn}
          onPress={() => navigation.navigate('Plans')}
        >
          <Text style={styles.upgradeBtnText}>⬆️ Upgrade Plan</Text>
        </TouchableOpacity>
      )}

      {/* Cancel */}
      {subscription && subscription.plan_type !== 'freemium' && (
        <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}>
          <Text style={styles.cancelBtnText}>Cancel Subscription</Text>
        </TouchableOpacity>
      )}

      <View style={styles.policyCard}>
        <Text style={styles.policyTitle}>Refund Policy</Text>
        <Text style={styles.policyText}>
          30-day money-back guarantee if you don't see improvement.
          Contact support@healthai-india.com for refunds.
        </Text>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { backgroundColor: COLORS.primary, padding: 20, paddingTop: 48 },
  back: { color: '#111827', fontSize: 22, marginBottom: 8 },
  heading: { fontSize: 22, fontWeight: 'bold', color: '#111827' },
  sub: { fontSize: 13, color: '#B3D4FF', marginTop: 4 },
  planCard: {
    backgroundColor: COLORS.white, margin: 16, borderRadius: 14,
    padding: 20, borderWidth: 2,
  },
  planStatus: { fontSize: 12, color: COLORS.success, fontWeight: '600', marginBottom: 8 },
  planName: { fontSize: 22, fontWeight: 'bold', marginBottom: 4 },
  planNameEn: { fontSize: 14, color: COLORS.textSecondary, marginBottom: 10 },
  planPrice: { fontSize: 28, fontWeight: 'bold', color: COLORS.text, marginBottom: 6 },
  expiryText: { fontSize: 13, color: COLORS.textSecondary },
  section: { backgroundColor: COLORS.white, marginHorizontal: 16, borderRadius: 12, padding: 16, marginBottom: 16 },
  sectionTitle: { fontSize: 15, fontWeight: 'bold', color: COLORS.text, marginBottom: 12 },
  feature: { fontSize: 14, color: COLORS.text, marginBottom: 8 },
  consultLine: { fontSize: 14, color: COLORS.textSecondary, marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: COLORS.border },
  upgradeBtn: {
    backgroundColor: COLORS.primary, marginHorizontal: 16,
    borderRadius: 12, padding: 16, alignItems: 'center', marginBottom: 12,
  },
  upgradeBtnText: { color: '#111827', fontWeight: 'bold', fontSize: 16 },
  cancelBtn: {
    backgroundColor: COLORS.white, marginHorizontal: 16,
    borderRadius: 12, padding: 16, alignItems: 'center',
    borderWidth: 1.5, borderColor: COLORS.error, marginBottom: 16,
  },
  cancelBtnText: { color: COLORS.error, fontWeight: '600', fontSize: 14 },
  policyCard: { backgroundColor: '#FFF3E0', marginHorizontal: 16, borderRadius: 12, padding: 16 },
  policyTitle: { fontSize: 14, fontWeight: 'bold', color: '#795548', marginBottom: 8 },
  policyText: { fontSize: 13, color: '#795548', lineHeight: 20 },
});
