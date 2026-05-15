import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
} from 'react-native';
import { COLORS } from '../../utils/constants';

export default function VideoConsultScreen({ navigation, route }) {
  const { consultation } = route.params || {};

  return (
    <View style={styles.container}>
      <View style={styles.videoArea}>
        <Text style={styles.videoPlaceholder}>ðŸ“¹</Text>
        <Text style={styles.videoText}>Video consultation</Text>
        <Text style={styles.videoSub}>
          Agora.io video SDK will be integrated here in Phase 2{'\n'}
          Live video call with end-to-end encryption
        </Text>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity style={[styles.controlBtn, styles.muteBtn]}>
          <Text style={styles.controlIcon}>ðŸŽ¤</Text>
          <Text style={styles.controlLabel}>Mute</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.controlBtn, styles.endBtn]}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.controlIcon}>ðŸ“µ</Text>
          <Text style={[styles.controlLabel, { color: '#fff' }]}>End Call</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.controlBtn, styles.camBtn]}>
          <Text style={styles.controlIcon}>ðŸ“·</Text>
          <Text style={styles.controlLabel}>Camera</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.infoPanel}>
        <View style={styles.consultInfo}>
          <Text style={styles.infoTitle}>Consultation Details</Text>
          <Text style={styles.infoItem}>ðŸ‘¨â€âš•ï¸ Doctor: {consultation?.doctorName || 'Dr. Priya Sharma'}</Text>
          <Text style={styles.infoItem}>â±ï¸ Minimum duration: 15 minutes</Text>
          <Text style={styles.infoItem}>ðŸ”’ This call is private and encrypted</Text>
          <Text style={styles.infoItem}>ðŸ“‹ Prescription will be available after the call</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#122640' },
  videoArea: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#16213e',
  },
  videoPlaceholder: { fontSize: 80, marginBottom: 16 },
  videoText: { fontSize: 22, fontWeight: 'bold', color: '#fff', marginBottom: 8 },
  videoSub: { fontSize: 13, color: 'rgba(255,255,255,0.6)', textAlign: 'center', paddingHorizontal: 40, lineHeight: 20 },
  controls: {
    flexDirection: 'row', justifyContent: 'space-around',
    padding: 20, backgroundColor: '#122640',
  },
  controlBtn: {
    width: 70, height: 70, borderRadius: 35,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  muteBtn: {},
  endBtn: { backgroundColor: COLORS.error },
  camBtn: {},
  controlIcon: { fontSize: 24 },
  controlLabel: { fontSize: 11, color: 'rgba(255,255,255,0.7)', marginTop: 4 },
  infoPanel: { maxHeight: 180, backgroundColor: COLORS.white },
  consultInfo: { padding: 16 },
  infoTitle: { fontSize: 14, fontWeight: 'bold', color: COLORS.text, marginBottom: 10 },
  infoItem: { fontSize: 13, color: COLORS.textSecondary, marginBottom: 6 },
});
