import React, { useEffect, useRef, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import Markdown from 'react-native-markdown-display';
import { colors, spacing, typography } from '../constants/theme';

type Props = {
  text: string;
  isStreaming: boolean;
};

const markdownStyles = {
  body: { ...typography.body },
  heading1: { ...typography.heading, marginVertical: spacing.sm },
  heading2: { ...typography.subheading, marginTop: spacing.md, marginBottom: spacing.xs },
  strong: { fontWeight: '700' as const, color: colors.text },
  paragraph: { marginVertical: spacing.xs },
  bullet_list: { marginVertical: spacing.xs },
  list_item: { marginVertical: 2 },
};

// Characters per tick and tick interval control the typewriter speed.
// At 6 chars / 25ms, a 500-char response fully animates in ~2 seconds.
const CHARS_PER_TICK = 6;
const TICK_MS = 25;

export function StreamingText({ text, isStreaming }: Props) {
  const [displayed, setDisplayed] = useState('');
  // Keep a ref so the interval callback always reads the latest text
  // without needing text in its dependency array.
  const textRef = useRef('');
  textRef.current = text;

  useEffect(() => {
    if (!isStreaming) {
      // Stream finished — show everything immediately.
      setDisplayed(textRef.current);
      return;
    }

    // Advance displayed text toward the current text at a fixed rate.
    const timer = setInterval(() => {
      setDisplayed((prev) => {
        const target = textRef.current;
        if (prev.length >= target.length) return prev;
        return target.slice(0, prev.length + CHARS_PER_TICK);
      });
    }, TICK_MS);

    return () => clearInterval(timer);
  }, [isStreaming]);

  if (!displayed) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.primary} size="small" />
        <Text style={styles.loadingText}>Thinking…</Text>
      </View>
    );
  }

  return (
    <View>
      <Markdown style={markdownStyles}>{displayed}</Markdown>
      {isStreaming && <View style={styles.cursor} />}
    </View>
  );
}

const styles = StyleSheet.create({
  loading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.lg,
  },
  loadingText: { ...typography.body, color: colors.textSecondary },
  cursor: {
    width: 2,
    height: 16,
    backgroundColor: colors.primary,
    marginTop: 2,
    marginLeft: 2,
  },
});
