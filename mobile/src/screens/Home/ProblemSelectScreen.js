import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar,
} from 'react-native';
import useAppStore from '../../store/useAppStore';
import { COLORS, CONCERNS } from '../../utils/constants';

export default function ProblemSelectScreen({ navigation }) {
  const selectedConcerns = useAppStore((s) => s.selectedConcerns);
  const toggleConcern = useAppStore((s) => s.toggleConcern);

  const handleContinue = () => {
    if (selectedConcerns.length === 0) return;
    if (selectedConcerns.length === 1) {
      navigation.navigate('SymptomChat', { concern: selectedConcerns[0] });
    } else {
      navigation.navigate('RootCause');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.white} barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.heading}>आप किस समस्या से जूझ रहे हैं?</Text>
        <Text style={styles.sub}>What health concern do you have?</Text>
        <Text style={styles.hint}>Select one or more — it's private 🔒</Text>

        <View style={styles.grid}>
          {CONCERNS.map((c) => {
            const selected = selectedConcerns.includes(c.id);
            return (
              <TouchableOpacity
                key={c.id}
                style={[
                  styles.card,
                  selected && { borderColor: c.color, backgroundColor: c.color + '20' },
                ]}
                onPress={() => toggleConcern(c.id)}
              >
                <Text style={styles.cardIcon}>{c.icon}</Text>
                <Text style={[styles.cardLabelHi, selected && { color: c.color }]}>
                  {c.labelHi}
                </Text>
                <Text style={styles.cardLabel}>{c.label}</Text>
                {selected && (
                  <View style={[styles.checkBadge, { backgroundColor: c.color }]}>
                    <Text style={styles.checkText}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {selectedConcerns.length > 1 && (
          <View style={styles.multiInfo}>
            <Text style={styles.multiInfoText}>
              🔍 Multiple concerns selected — AI will find the root cause connecting them all!
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={[styles.btn, selectedConcerns.length === 0 && styles.btnDisabled]}
          onPress={handleContinue}
          disabled={selectedConcerns.length === 0}
        >
          <Text style={styles.btnText}>
            {selectedConcerns.length === 0
              ? 'कम से कम एक चुनें'
              : selectedConcerns.length === 1
              ? 'AI से पूछें →'
              : `${selectedConcerns.length} समस्याओं का Root Cause जानें →`}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  scroll: { padding: 20, paddingTop: 48 },
  heading: { fontSize: 22, fontWeight: 'bold', color: COLORS.text, marginBottom: 4 },
  sub: { fontSize: 15, color: COLORS.textSecondary, marginBottom: 4 },
  hint: { fontSize: 13, color: COLORS.primary, marginBottom: 24 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 20 },
  card: {
    width: '46%', padding: 16, borderRadius: 14,
    borderWidth: 2, borderColor: COLORS.border,
    backgroundColor: COLORS.white, position: 'relative',
  },
  cardIcon: { fontSize: 36, marginBottom: 10 },
  cardLabelHi: { fontSize: 15, fontWeight: 'bold', color: COLORS.text, marginBottom: 4 },
  cardLabel: { fontSize: 12, color: COLORS.textSecondary },
  checkBadge: {
    position: 'absolute', top: 10, right: 10,
    width: 22, height: 22, borderRadius: 11,
    alignItems: 'center', justifyContent: 'center',
  },
  checkText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  multiInfo: {
    backgroundColor: '#E8F0FE', borderRadius: 10,
    padding: 14, marginBottom: 16,
  },
  multiInfoText: { color: COLORS.primary, fontSize: 13, lineHeight: 20 },
  btn: {
    backgroundColor: COLORS.primary, borderRadius: 12,
    paddingVertical: 16, alignItems: 'center', marginTop: 4,
  },
  btnDisabled: { backgroundColor: COLORS.border },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
});
