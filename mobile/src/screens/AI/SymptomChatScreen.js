import React, { useState, useRef, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, ActivityIndicator, StatusBar,
} from 'react-native';
import { COLORS } from '../../utils/constants';
import { symptomsAPI } from '../../utils/api';
import useAppStore from '../../store/useAppStore';

const DISCLAIMER = '⚠️ यह medical diagnosis नहीं है। This is not a medical diagnosis — just a health assistant.';

const MOCK_RESPONSES = {
  default: 'आपके लक्षणों के आधार पर, यह stress-related hair loss हो सकता है। मैं आपसे कुछ और जानकारी लेना चाहूंगा।\n\n*Based on your symptoms, this may be stress-related. I\'d like to know more.*\n\n1. यह समस्या कब से है? (How long have you had this?)\n2. क्या आप बहुत stressed रहते हैं? (Are you often stressed?)\n3. आपकी नींद कैसी है? (How is your sleep?)',
};

export default function SymptomChatScreen({ navigation, route }) {
  const { concern } = route.params || {};
  const [messages, setMessages] = useState([
    {
      id: '1',
      role: 'assistant',
      text: `नमस्ते! 🙏 मैं आपका AI Health Assistant हूं।\n\nI understand you're concerned about **${concern || 'your health'}**. I'm here to help — everything you share is completely private.\n\nआपको क्या तकलीफ हो रही है? What's bothering you?\n\n${DISCLAIMER}`,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const sessionId = useRef(`session_${Date.now()}`);
  const flatListRef = useRef(null);
  const addChatMessage = useAppStore((s) => s.addChatMessage);
  const subscription = useAppStore((s) => s.subscription);

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg = { id: Date.now().toString(), role: 'user', text };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    addChatMessage(sessionId.current, userMsg);

    try {
      const res = await symptomsAPI.chat(text, [concern], sessionId.current);
      const aiMsg = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: res.data.reply,
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      // Mock response for development
      const aiMsg = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: MOCK_RESPONSES.default,
      };
      setMessages((prev) => [...prev, aiMsg]);
    } finally {
      setLoading(false);
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [input, loading, concern]);

  const renderMessage = ({ item }) => (
    <View style={[styles.bubble, item.role === 'user' ? styles.userBubble : styles.aiBubble]}>
      {item.role === 'assistant' && (
        <View style={styles.aiAvatar}>
          <Text>🤖</Text>
        </View>
      )}
      <View style={[styles.bubbleInner, item.role === 'user' ? styles.userInner : styles.aiInner]}>
        <Text style={[styles.bubbleText, item.role === 'user' && styles.userText]}>
          {item.text}
        </Text>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={88}
    >
      <StatusBar backgroundColor={COLORS.primary} barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.headerTitle}>AI Health Assistant</Text>
          <Text style={styles.headerSub}>Private • Secure • Hindi/English</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Plans')}>
          <Text style={styles.doctorBtn}>👨‍⚕️ Doctor</Text>
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messageList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      {loading && (
        <View style={styles.typingIndicator}>
          <ActivityIndicator size="small" color={COLORS.primary} />
          <Text style={styles.typingText}>AI सोच रही है...</Text>
        </View>
      )}

      {/* Consult doctor suggestion after 3 messages */}
      {messages.length >= 5 && (
        <TouchableOpacity
          style={styles.consultBanner}
          onPress={() => navigation.navigate('Plans')}
        >
          <Text style={styles.consultBannerText}>
            👨‍⚕️ Want to talk to a real doctor? Book consultation from ₹149
          </Text>
        </TouchableOpacity>
      )}

      {/* Input */}
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="अपनी तकलीफ बताएं... (Type in Hindi or English)"
          value={input}
          onChangeText={setInput}
          multiline
          maxLength={500}
          onSubmitEditing={sendMessage}
        />
        <TouchableOpacity
          style={[styles.sendBtn, (!input.trim() || loading) && styles.sendBtnDisabled]}
          onPress={sendMessage}
          disabled={!input.trim() || loading}
        >
          <Text style={styles.sendIcon}>➤</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.primary, padding: 16, paddingTop: 48,
  },
  back: { color: '#111827', fontSize: 22, fontWeight: 'bold' },
  headerTitle: { color: '#111827', fontWeight: 'bold', fontSize: 16 },
  headerSub: { color: '#B3D4FF', fontSize: 12 },
  doctorBtn: { color: '#111827', backgroundColor: 'rgba(255,255,255,0.2)', padding: 8, borderRadius: 8, fontSize: 13 },
  messageList: { padding: 16, paddingBottom: 8 },
  bubble: { flexDirection: 'row', marginBottom: 16, alignItems: 'flex-end' },
  userBubble: { justifyContent: 'flex-end' },
  aiBubble: { justifyContent: 'flex-start' },
  aiAvatar: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: '#E8F0FE', alignItems: 'center',
    justifyContent: 'center', marginRight: 8,
  },
  bubbleInner: { maxWidth: '78%', borderRadius: 16, padding: 12 },
  aiInner: { backgroundColor: COLORS.white, borderTopLeftRadius: 4, elevation: 1 },
  userInner: { backgroundColor: COLORS.primary, borderTopRightRadius: 4 },
  bubbleText: { fontSize: 14, color: COLORS.text, lineHeight: 20 },
  userText: { color: '#111827' },
  typingIndicator: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 8,
  },
  typingText: { marginLeft: 8, color: COLORS.textSecondary, fontSize: 13 },
  consultBanner: {
    backgroundColor: '#E8F0FE', padding: 12, marginHorizontal: 16,
    borderRadius: 10, marginBottom: 8,
  },
  consultBannerText: { color: COLORS.primary, fontSize: 13, textAlign: 'center' },
  inputRow: {
    flexDirection: 'row', padding: 12,
    backgroundColor: COLORS.white, borderTopWidth: 1, borderTopColor: COLORS.border,
    alignItems: 'flex-end',
  },
  input: {
    flex: 1, borderWidth: 1, borderColor: COLORS.border,
    borderRadius: 22, paddingHorizontal: 16, paddingVertical: 10,
    fontSize: 14, maxHeight: 100, marginRight: 10,
  },
  sendBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center',
  },
  sendBtnDisabled: { backgroundColor: COLORS.border },
  sendIcon: { color: '#111827', fontSize: 16 },
});
