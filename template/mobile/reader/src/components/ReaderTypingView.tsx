import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

type Props = {
  content: string;
  typingIntervalMs: number;
};

export const ReaderTypingView = ({ content, typingIntervalMs }: Props) => {
  const [index, setIndex] = useState(0);
  const normalized = useMemo(() => content ?? '', [content]);

  useEffect(() => {
    setIndex(0);
  }, [normalized]);

  useEffect(() => {
    if (index >= normalized.length) {
      return;
    }

    const timer = setTimeout(() => {
      setIndex((prev) => prev + 1);
    }, typingIntervalMs);

    return () => clearTimeout(timer);
  }, [index, normalized, typingIntervalMs]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{normalized.slice(0, index)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 12,
    backgroundColor: '#f5f7f9',
    padding: 16
  },
  text: {
    fontSize: 18,
    lineHeight: 28,
    color: '#111827'
  }
});
