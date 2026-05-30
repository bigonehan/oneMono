import { StyleSheet, Text, View } from 'react-native';
import { ReaderTypingView } from '../components/ReaderTypingView';
import { useAppStore } from '../store/useAppStore';

export const ReaderScreen = () => {
  const currentSubject = useAppStore((state) => state.currentSubject);
  const typingIntervalMs = useAppStore((state) => state.readerSettings.typingIntervalMs);

  if (!currentSubject) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>파일 목록에서 먼저 항목을 선택해주세요.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{currentSubject.fileName}</Text>
      <ReaderTypingView content={currentSubject.content} typingIntervalMs={typingIntervalMs} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#ffffff'
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    padding: 16
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280'
  }
});
