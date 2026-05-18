import { useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useRouter, useNavigation } from 'expo-router';
import { StreamingText } from '../components/StreamingText';
import { ChatThread } from '../components/ChatThread';
import { useRequest } from '../context/RequestContext';
import { streamBrew, streamTroubleshoot, streamChat, BASE_URL } from '../services/api';
import { colors, spacing, radius, typography } from '../constants/theme';
import type { ChatMessage } from '../types';

type Status = 'connecting' | 'streaming' | 'done' | 'error';

const STATUS_LABEL: Record<Status, string> = {
  connecting: 'Connecting…',
  streaming: 'Receiving…',
  done: 'Done',
  error: 'Failed',
};

const STATUS_COLOR: Record<Status, string> = {
  connecting: colors.textSecondary,
  streaming: colors.primary,
  done: '#5A9E6B',
  error: colors.error,
};

export default function ResultScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const { pending } = useRequest();

  const [status, setStatus] = useState<Status>('connecting');
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState('');

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatStreamingReply, setChatStreamingReply] = useState('');
  const [isChatStreaming, setIsChatStreaming] = useState(false);

  const scrollRef = useRef<ScrollView>(null);
  const abortRef = useRef<(() => void) | null>(null);
  // Track whether first chunk arrived so we only call setStatus('streaming') once.
  const firstChunkRef = useRef(false);

  useEffect(() => {
    if (!pending) {
      router.replace('/');
      return;
    }

    navigation.setOptions({ title: pending.mode === 'brew' ? 'Brew guide' : 'Diagnosis' });

    const callbacks = {
      onChunk: (chunk: string) => {
        if (!firstChunkRef.current) {
          firstChunkRef.current = true;
          setStatus('streaming');
        }
        setResult((prev) => prev + chunk);
        scrollRef.current?.scrollToEnd({ animated: false });
      },
      onDone: () => {
        setStatus('done');
      },
      onError: (err: Error) => {
        setStatus('error');
        setError(err.message);
      },
    };

    const abort =
      pending.mode === 'brew'
        ? streamBrew(pending.data, callbacks)
        : streamTroubleshoot(pending.data, callbacks);

    abortRef.current = abort;
    return () => abortRef.current?.();
  }, []);

  const handleChatSend = (message: string) => {
    const assistantSeed: ChatMessage = { role: 'assistant', content: result };
    const userMessage: ChatMessage = { role: 'user', content: message };

    const history: ChatMessage[] =
      chatMessages.length === 0
        ? [assistantSeed, userMessage]
        : [...chatMessages, userMessage];

    setChatMessages(history);
    setIsChatStreaming(true);
    setChatStreamingReply('');

    let accumulated = '';

    abortRef.current = streamChat(history, {
      onChunk: (chunk) => {
        accumulated += chunk;
        setChatStreamingReply(accumulated);
        scrollRef.current?.scrollToEnd({ animated: false });
      },
      onDone: () => {
        setChatMessages((prev) => [...prev, { role: 'assistant', content: accumulated }]);
        setChatStreamingReply('');
        setIsChatStreaming(false);
      },
      onError: () => {
        setIsChatStreaming(false);
      },
    });
  };

  return (
    <ScrollView
      ref={scrollRef}
      style={styles.scroll}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      {/* Status bar */}
      <View style={styles.statusRow}>
        <View style={[styles.statusDot, { backgroundColor: STATUS_COLOR[status] }]} />
        <Text style={[styles.statusText, { color: STATUS_COLOR[status] }]}>
          {STATUS_LABEL[status]}
        </Text>
        <Text style={styles.apiUrl}>{BASE_URL}</Text>
      </View>

      {status === 'error' ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorTitle}>Could not reach the server</Text>
          <Text style={styles.errorMessage}>{error}</Text>
          <Text style={styles.errorHint}>
            Make sure the server is running at {BASE_URL} and your device is on the same network.
          </Text>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Go back</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <StreamingText text={result} isStreaming={status === 'connecting' || status === 'streaming'} />

          {status === 'done' && (
            <ChatThread
              messages={chatMessages.length === 0 ? [{ role: 'assistant', content: result }] : chatMessages}
              streamingReply={chatStreamingReply}
              isStreaming={isChatStreaming}
              onSend={handleChatSend}
            />
          )}
        </>
      )}

      <View style={styles.bottomPad} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { padding: spacing.lg },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { ...typography.label, textTransform: 'none', letterSpacing: 0 },
  apiUrl: {
    ...typography.label,
    textTransform: 'none',
    letterSpacing: 0,
    color: colors.border,
    marginLeft: 'auto',
    fontSize: 10,
  },
  errorBox: {
    backgroundColor: colors.surfaceSubtle,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  errorTitle: { ...typography.subheading, color: colors.error },
  errorMessage: { ...typography.body, color: colors.text },
  errorHint: { ...typography.body, color: colors.textSecondary, fontSize: 13 },
  backButton: {
    marginTop: spacing.sm,
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: spacing.sm + 4,
    alignItems: 'center',
  },
  backButtonText: { color: '#fff', fontWeight: '600', fontSize: 15 },
  bottomPad: { height: spacing.xxl },
});
