import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  StatusBar, FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, GRADIENTS, FONTS } from '../../utils/constants';

const NOTIFICATIONS = [
  {
    id: '1', type: 'appointment', icon: 'ðŸ‘¨â€âš•ï¸', time: '10 min ago', unread: true,
    title: 'Appointment Confirmed',
    body: 'Dr. Priya Sharma confirmed your video consultation for Today at 6:00 PM.',
    action: 'Join Now',
    gradient: ['#0D9488', '#14B8A6'],
  },
  {
    id: '2', type: 'reminder', icon: 'ðŸ’Š', time: '1 hr ago', unread: true,
    title: 'Medication Reminder',
    body: 'Time to take your Minoxidil 5% â€” evening dose. Consistency = results.',
    action: 'Mark Done',
    gradient: ['#1E3A5F', '#3B82C4'],
  },
  {
    id: '3', type: 'report', icon: 'ðŸ“‹', time: '3 hrs ago', unread: false,
    title: 'Prescription Ready',
    body: 'Dr. Rajan Mehta has added your prescription. Download your PDF now.',
    action: 'Download',
    gradient: ['#059669', '#0D9488'],
  },
  {
    id: '4', type: 'ai', icon: 'ðŸ¤–', time: 'Yesterday', unread: false,
    title: 'AI Insight Available',
    body: 'Based on your weekly check-in, your stress levels may be contributing to hair fall.',
    action: 'View Insight',
    gradient: ['#D97706', '#F59E0B'],
  },
  {
    id: '5', type: 'tip', icon: 'âœ¨', time: 'Yesterday', unread: false,
    title: 'Today\'s Skin Tip',
    body: 'Apply SPF 50 sunscreen 20 minutes before stepping out. UV causes 80% of premature aging.',
    action: 'Learn More',
    gradient: ['#DB2777', '#EC4899'],
  },
  {
    id: '6', type: 'streak', icon: 'ðŸ”¥', time: '2 days ago', unread: false,
    title: 'You\'re on a 5-Day Streak! ðŸŽ‰',
    body: 'Amazing consistency! Keep logging your daily health data to maintain your streak.',
    action: 'View Progress',
    gradient: ['#1E1B4B', '#4338CA'],
  },
];

const TYPE_ICONS = {
  appointment: { icon: 'calendar', color: '#0D9488' },
  reminder: { icon: 'alarm', color: '#1E3A5F' },
  report: { icon: 'document-text', color: '#059669' },
  ai: { icon: 'sparkles', color: '#D97706' },
  tip: { icon: 'bulb', color: '#DB2777' },
  streak: { icon: 'flame', color: '#4338CA' },
};

export default function NotificationsScreen({ navigation }) {
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  const markRead = (id) => setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, unread: false } : n));

  return (
    <View style={styles.root}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      <LinearGradient colors={GRADIENTS.hero} style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.headerTitle}>Notifications</Text>
            {unreadCount > 0 && (
              <Text style={styles.headerSub}>{unreadCount} unread notification{unreadCount > 1 ? 's' : ''}</Text>
            )}
          </View>
          {unreadCount > 0 && (
            <TouchableOpacity style={styles.markAllBtn} onPress={markAllRead}>
              <Text style={styles.markAllText}>Mark all read</Text>
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.card, item.unread && styles.cardUnread]}
            onPress={() => markRead(item.id)}
            activeOpacity={0.85}
          >
            {/* Unread dot */}
            {item.unread && <View style={styles.unreadDot} />}

            <LinearGradient colors={item.gradient} style={styles.cardIcon}>
              <Text style={{ fontSize: 20 }}>{item.icon}</Text>
            </LinearGradient>

            <View style={styles.cardContent}>
              <View style={styles.cardHeader}>
                <Text style={[styles.cardTitle, item.unread && styles.cardTitleUnread]}>{item.title}</Text>
                <Text style={styles.cardTime}>{item.time}</Text>
              </View>
              <Text style={styles.cardBody} numberOfLines={2}>{item.body}</Text>
              <TouchableOpacity style={styles.actionBtn}>
                <Text style={styles.actionText}>{item.action} â†’</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
        ListFooterComponent={<View style={{ height: 100 }} />}
      />
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
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  headerTitle: { fontFamily: FONTS.bold, fontSize: 24, color: '#fff', marginBottom: 4 },
  headerSub: { fontFamily: FONTS.regular, fontSize: 13, color: 'rgba(255,255,255,0.6)' },
  markAllBtn: {
    backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 20,
    paddingHorizontal: 14, paddingVertical: 8, marginTop: 4,
  },
  markAllText: { fontFamily: FONTS.medium, fontSize: 12, color: '#fff' },

  list: { padding: 16, paddingTop: 12 },
  card: {
    flexDirection: 'row', backgroundColor: COLORS.white, borderRadius: 18,
    padding: 14, marginBottom: 10, gap: 12,
    shadowColor: COLORS.shadow, shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1, shadowRadius: 8, elevation: 3,
    position: 'relative',
  },
  cardUnread: {
    borderLeftWidth: 3, borderLeftColor: COLORS.primary,
    backgroundColor: '#FAFBFF',
  },
  unreadDot: {
    position: 'absolute', top: 14, right: 14,
    width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.primary,
  },
  cardIcon: {
    width: 52, height: 52, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  cardContent: { flex: 1 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 },
  cardTitle: { fontFamily: FONTS.semiBold, fontSize: 14, color: COLORS.text, flex: 1, marginRight: 8 },
  cardTitleUnread: { fontFamily: FONTS.bold },
  cardTime: { fontFamily: FONTS.regular, fontSize: 11, color: COLORS.textLight, flexShrink: 0 },
  cardBody: { fontFamily: FONTS.regular, fontSize: 12, color: COLORS.textSecondary, lineHeight: 17, marginBottom: 8 },
  actionBtn: {
    backgroundColor: COLORS.primaryBg, borderRadius: 8,
    paddingHorizontal: 10, paddingVertical: 5, alignSelf: 'flex-start',
  },
  actionText: { fontFamily: FONTS.semiBold, fontSize: 11, color: COLORS.primary },
});
