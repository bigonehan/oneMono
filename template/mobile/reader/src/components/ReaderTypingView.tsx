import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import Markdown from 'react-native-markdown-display';

type Props = {
  content: string;
  typingIntervalMs: number;
  fontScale: number;
  isPlaying: boolean;
  restartToken: number;
};

const buildMarkdownStyles = (fontScale: number) => ({
  body: {
    color: '#1f2937',
    fontSize: 17 * fontScale,
    lineHeight: 29 * fontScale
  },
  heading1: {
    color: '#7c2d12',
    fontSize: 28 * fontScale,
    marginBottom: 12
  },
  heading2: {
    color: '#9a3412',
    fontSize: 22 * fontScale,
    marginTop: 18,
    marginBottom: 8
  },
  paragraph: {
    marginTop: 0,
    marginBottom: 10
  },
  list_item: {
    marginBottom: 8
  }
});

export const ReaderTypingView = ({
  content,
  typingIntervalMs,
  fontScale,
  isPlaying,
  restartToken
}: Props) => {
  const [index, setIndex] = useState(0);
  const normalized = content ?? '';

  useEffect(() => {
    setIndex(0);
  }, [normalized, restartToken]);

  useEffect(() => {
    if (!isPlaying || index >= normalized.length) {
      return;
    }

    const timer = setTimeout(() => {
      setIndex((prev) => prev + 1);
    }, typingIntervalMs);

    return () => clearTimeout(timer);
  }, [index, isPlaying, normalized, typingIntervalMs]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Markdown style={buildMarkdownStyles(fontScale)}>
        {normalized.slice(0, index)}
      </Markdown>
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
