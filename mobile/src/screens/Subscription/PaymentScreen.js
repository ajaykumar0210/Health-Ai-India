import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator,
} from 'react-native';
import { COLORS } from '../../utils/constants';
import { subscriptionsAPI } from '../../utils/api';
import useAppStore from '../../store/useAppStore';

export default function PaymentScreen({ navigation, route }) {
  const { plan } = route.params;
  const [loading, setLoading] = useState(false);
  const setSubscription = useAppStore((s) => s.setSubscription);

  const handlePay = async () => {
    setLoading(true);
    try {
      const orderRes = await subscriptionsAPI.createOrder(plan.id);
      const { orderId, amount, currency } = orderRes.data;
      // In production: open Razorpay SDK with orderId
      // For dev: mock success
      Alert.alert(
        '✅ Payment Successful!',
        `${plan.name} plan activated.\n\nIn production, Razorpay SDK will open here for UPI/Card/EMI payment.`,
        [
          {
            text: 'Continue',
            onPress: () => {
              setSubscription({
                plan_type: plan.id,
                start_date: new Date().toISOString(),
                end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
              });
              navigation.navigate('Home');
            },
          },
        ]
      );
    } catch {
      // Dev mode — mock payment
      Alert.alert(
        '✅ Dev Mode — Payment Success',
        `${plan.name} plan activated (mock).\n\nRazorpay integration needs live keys.`,
        [
          {
            text: 'Continue',
            onPress: () => {
              setSubscription({ plan_type: plan.id });
              navigation.navigate('Home');
            },
          },
        ]
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>← वापस</Text>
        </TouchableOpacity>
        <Text style={styles.heading}>Payment</Text>
      </View>

      {/* Order summary */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Order Summary</Text>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>{plan.nameHi} ({plan.name})</Text>
          <Text style={styles.rowValue}>₹{plan.price}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>GST (18%)</Text>
          <Text style={styles.rowValue}>₹{Math.round(plan.price * 0.18)}</Text>
        </View>
        <View style={[styles.row, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>₹{Math.round(plan.price * 1.18)}</Text>
        </View>
      </View>

      {/* Payment methods */}
      <View style={styles.payCard}>
        <Text style={styles.payTitle}>Payment Options</Text>
        <View style={styles.payMethods}>
          {['📱 UPI / PhonePe / GPay', '💳 Credit / Debit Card', '🏦 Net Banking', '📦 EMI'].map(
            (m) => (
              <View key={m} style={styles.payMethod}>
                <Text style={styles.payMethodText}>{m}</Text>
              </View>
            )
          )}
        </View>
        <Text style={styles.poweredBy}>Powered by Razorpay 🔒 Secure Payment</Text>
      </View>

      {/* What you get */}
      <View style={styles.benefitsCard}>
        <Text style={styles.benefitsTitle}>What you get:</Text>
        {plan.features.map((f, i) => (
          <Text key={i} style={styles.benefit}>✓ {f}</Text>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.payBtn, { backgroundColor: plan.color }, loading && styles.payBtnDisabled]}
        onPress={handlePay}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.payBtnText}>
            Pay ₹{Math.round(plan.price * 1.18)} — {plan.name}
          </Text>
        )}
      </TouchableOpacity>

      <Text style={styles.refundNote}>
        💰 30-day money-back guarantee if no improvement.
        Cancel anytime from your profile.
      </Text>
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { backgroundColor: COLORS.primary, padding: 20, paddingTop: 48 },
  back: { color: 'rgba(255,255,255,0.8)', marginBottom: 8 },
  heading: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  summaryCard: {
    backgroundColor: COLORS.white, margin: 16, borderRadius: 12, padding: 16,
  },
  summaryTitle: { fontWeight: 'bold', fontSize: 16, marginBottom: 16, color: COLORS.text },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  rowLabel: { fontSize: 14, color: COLORS.textSecondary },
  rowValue: { fontSize: 14, color: COLORS.text },
  totalRow: {
    borderTopWidth: 1, borderTopColor: COLORS.border,
    paddingTop: 10, marginTop: 4,
  },
  totalLabel: { fontSize: 16, fontWeight: 'bold', color: COLORS.text },
  totalValue: { fontSize: 18, fontWeight: 'bold', color: COLORS.primary },
  payCard: { backgroundColor: COLORS.white, marginHorizontal: 16, borderRadius: 12, padding: 16, marginBottom: 16 },
  payTitle: { fontWeight: 'bold', fontSize: 15, color: COLORS.text, marginBottom: 12 },
  payMethods: { gap: 8 },
  payMethod: {
    padding: 12, borderWidth: 1, borderColor: COLORS.border,
    borderRadius: 8,
  },
  payMethodText: { fontSize: 14, color: COLORS.text },
  poweredBy: { fontSize: 12, color: COLORS.textSecondary, marginTop: 12, textAlign: 'center' },
  benefitsCard: {
    backgroundColor: '#E8F0FE', marginHorizontal: 16, borderRadius: 12,
    padding: 16, marginBottom: 16,
  },
  benefitsTitle: { fontWeight: 'bold', fontSize: 14, color: COLORS.primary, marginBottom: 8 },
  benefit: { fontSize: 14, color: COLORS.text, marginBottom: 6 },
  payBtn: {
    marginHorizontal: 16, borderRadius: 12,
    paddingVertical: 16, alignItems: 'center', marginBottom: 12,
  },
  payBtnDisabled: { opacity: 0.6 },
  payBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  refundNote: {
    fontSize: 12, color: COLORS.textSecondary,
    marginHorizontal: 16, textAlign: 'center', lineHeight: 18,
  },
});
