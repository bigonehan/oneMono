import { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, useWindowDimensions } from 'react-native';
import { Canvas, Text as SkiaText, matchFont } from '@shopify/react-native-skia';
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

const wrapText = (value: string, charsPerLine: number) => {
  if (charsPerLine <= 0) {
    return [value];
  }

  const source = value.split('\n');
  const lines: string[] = [];

  source.forEach((line) => {
    if (line.length === 0) {
      lines.push('');
      return;
    }

    let cursor = 0;
    while (cursor < line.length) {
      lines.push(line.slice(cursor, cursor + charsPerLine));
      cursor += charsPerLine;
    }
  });

  return lines;
};

const FONT_FAMILY_MAP = {
  sans: 'sans-serif',
  serif: 'serif',
  mono: 'monospace'
} as const;

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
  const { width } = useWindowDimensions();
  const normalized = content ?? '';
  const delayMs = getReaderDelayMs(typingIntervalMs);
  const fontSize = 17 * fontScale;
  const lineHeight = 29 * fontScale;
  const horizontalPadding = 20;
  const availableWidth = Math.max(220, width - 48);
  const charsPerLine = Math.max(16, Math.floor((availableWidth - horizontalPadding * 2) / (fontSize * 0.56)));
  const lines = useMemo(
    () => wrapText(normalized.slice(startIndex, index), charsPerLine),
    [charsPerLine, index, normalized, startIndex]
  );
  const canvasHeight = Math.max(320, lines.length * lineHeight + horizontalPadding * 2);
  const font = useMemo(
    () =>
      matchFont({
        fontSize,
        fontFamily: FONT_FAMILY_MAP[fontPreset],
        fontStyle: 'normal',
        fontWeight: 'normal'
      }),
    [fontPreset, fontSize]
  );

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
      <Canvas style={{ width: availableWidth, height: canvasHeight }}>
        {lines.map((line, lineIndex) => (
          <SkiaText
            key={`${lineIndex}:${line}`}
            x={horizontalPadding}
            y={horizontalPadding + lineHeight * (lineIndex + 1)}
            text={line}
            font={font}
            color="#1f2937"
          />
        ))}
      </Canvas>
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
