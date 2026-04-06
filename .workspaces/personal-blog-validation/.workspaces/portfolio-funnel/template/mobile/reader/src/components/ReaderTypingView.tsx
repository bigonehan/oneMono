import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { getReaderDelayMs } from '../modules/readerSpeed';

type Props = {
  content: string;
  typingIntervalMs: number;
  fontScale: number;
  fontPreset: 'sans' | 'serif' | 'mono';
  isPlaying: boolean;
  restartToken: number;
  startIndex: number;
  onCursorChange?: (cursor: number) => void;
};

const FONT_FAMILY_MAP: Record<Props['fontPreset'], string> = {
  sans: 'sans-serif',
  serif: 'serif',
  mono: 'monospace'
};

export const ReaderTypingView = ({
  content,
  typingIntervalMs,
  fontScale,
  fontPreset,
  isPlaying,
  restartToken,
  startIndex,
  onCursorChange
}: Props) => {
  const [index, setIndex] = useState(startIndex);
  const normalized = content ?? '';
  const visible = normalized.slice(startIndex, index);
  const delayMs = getReaderDelayMs(typingIntervalMs);

  useEffect(() => {
    setIndex(startIndex);
  }, [normalized, restartToken, startIndex]);

  useEffect(() => {
    if (!isPlaying || index >= normalized.length) {
      return;
    }

    const timer = setTimeout(() => {
      setIndex((prev) => prev + 1);
    }, delayMs);

    return () => clearTimeout(timer);
  }, [delayMs, index, isPlaying, normalized]);

  useEffect(() => {
    onCursorChange?.(index);
  }, [index, onCursorChange]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text
        style={{
          color: '#1f2937',
          fontSize: 17 * fontScale,
          lineHeight: 29 * fontScale,
          fontFamily: FONT_FAMILY_MAP[fontPreset]
        }}
      >
        {visible}
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 20,
    backgroundColor: '#fffdf9'
  },
  content: {
    padding: 20
  }
});
