import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StreamingText } from './StreamingText';
import { ChatInput } from './ChatInput';
import { colors, spacing, radius, typography } from '../constants/theme';
import type { ChatMessage } from '../types';

type Props = {
  messages: ChatMessage[];
  streamingReply: string;
  isStreaming: boolean;
  onSend: (message: string) => void;
};

export function ChatThread({ messages, streamingReply, isStreaming, onSend }: Props) {
  // messages[0] is the initial assistant brew/troubleshoot response — skip rendering it
  // as it's already shown by the result screen. Show only subsequent turns.
  const followUpMessages = messages.slice(1);

  return (
    <View style={styles.container}>
      <View style={styles.divider} />
      <Text style={styles.sectionLabel}>Follow-up</Text>

      {followUpMessages.map((msg, i) => (
        <View
          key={i}
          style={[styles.bubble, msg.role === 'user' ? styles.userBubble : styles.assistantBubble]}
        >
          {msg.role === 'user' ? (
            <Text style={styles.userText}>{msg.content}</Text>
          ) : (
            <StreamingText text={msg.content} isStreaming={false} />
          )}
        </View>
      ))}

      {isStreaming && streamingReply !== '' && (
        <View style={styles.assistantBubble}>
          <StreamingText text={streamingReply} isStreaming={isStreaming} />
        </View>
      )}

      {isStreaming && streamingReply === '' && (
        <View style={styles.assistantBubble}>
          <StreamingText text="" isStreaming={true} />
        </View>
      )}

      <ChatInput onSend={onSend} disabled={isStreaming} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: spacing.lg },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginBottom: spacing.lg,
  },
  sectionLabel: { ...typography.label, marginBottom: spacing.md },
  bubble: {
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 4,
    marginBottom: spacing.sm,
    maxWidth: '90%',
  },
  userBubble: {
    backgroundColor: colors.primary,
    alignSelf: 'flex-end',
  },
  assistantBubble: {
    backgroundColor: colors.surfaceSubtle,
    alignSelf: 'flex-start',
  },
  userText: { ...typography.body, color: '#fff' },
});
