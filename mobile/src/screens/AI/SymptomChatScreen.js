import React, { useState, useRef, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, ActivityIndicator, StatusBar,
} from 'react-native';
import { COLORS } from '../../utils/constants';
import useAppStore from '../../store/useAppStore';

const GEMINI_API_KEY = 'AIzaSyDGW6VRp31lGuRF3JIhpIcTQpwa-b71AM8';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

const SYSTEM_PROMPT = `You are a helpful Indian health assistant for Health AI India app.
You understand Hindi, English, and Hinglish.
You analyze symptoms, give practical advice, suggest home remedies, and advise when to see a doctor.
Always respond in the same language the user writes in.
Keep responses under 120 words. Be empathetic and clear.
IMPORTANT: Never ask the same question twice. Remember everything the user has told you.
Always add a gentle reminder to see a real doctor for serious symptoms.`;

async function callGemini(geminiContents) {
  const response = await fetch(GEMINI_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents: geminiContents,
      generationConfig: { temperature: 0.7, maxOutputTokens: 512 },
    }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error?.message || 'Gemini error');
  return data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I could not respond. Please try again.';
}

const DISCLAIMER = '⚠️ This is not a medical diagnosis — just a health assistant.';

export default function SymptomChatScreen({ navigation, route }) {
  const { concern } = route.params || {};
  const [messages, setMessages] = useState([
    {
      id: '1',
      role: 'assistant',
      text: `Hello! 🙏 I'm your AI Health Assistant.\n\nI see you're concerned about **${concern || 'your health'}**. I'm here to help — everything you share is completely private and secure.\n\nWhat symptoms are you experiencing? Please describe how you're feeling.\n\n${DISCLAIMER}`,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef(null);
  const addChatMessage = useAppStore((s) => s.addChatMessage);
  const subscription = useAppStore((s) => s.subscription);

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg = { id: Date.now().toString(), role: 'user', text };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    if (addChatMessage) addChatMessage('session', userMsg);

    try {
      // Build Gemini conversation history — skip initial greeting (id '1'), only real turns
      const geminiContents = updatedMessages
        .filter((m) => m.id !== '1')
        .map((m) => ({
          role: m.role === 'user' ? 'user' : 'model',
          parts: [{ text: m.text }],
        }));

      // Gemini requires conversation to start with user role
      if (geminiContents.length > 0 && geminiContents[0].role !== 'user') {
        geminiContents.shift();
      }

      // Add concern context to the first user message
      if (geminiContents.length === 1 && concern) {
        geminiContents[0].parts[0].text = `My health concern is: ${concern}. ${geminiContents[0].parts[0].text}`;
      }

      const reply = await callGemini(geminiContents);
      const aiMsg = { id: (Date.now() + 1).toString(), role: 'assistant', text: reply };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      const aiMsg = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: 'I\'m having trouble connecting right now. Please check your internet connection and try again.',
      };
      setMessages((prev) => [...prev, aiMsg]);
    } finally {
      setLoading(false);
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [input, loading, messages, concern]);

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
