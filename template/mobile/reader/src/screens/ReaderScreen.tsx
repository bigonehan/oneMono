import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Card, Text } from '@rneui/themed';
import { ReaderTypingView } from '../components/ReaderTypingView';
import { useAppStore } from '../store/useAppStore';

export const ReaderScreen = () => {
  const currentSubject = useAppStore((state) => state.currentSubject);
  const readerSettings = useAppStore((state) => state.readerSettings);
  const [restartToken, setRestartToken] = useState(0);
  const [isPlaying, setIsPlaying] = useState(readerSettings.autoPlay);

  useEffect(() => {
    setIsPlaying(readerSettings.autoPlay);
    setRestartToken((prev) => prev + 1);
  }, [currentSubject?.id, readerSettings.autoPlay]);

  if (!currentSubject) {
    return (
      <View style={styles.emptyContainer}>
        <Card containerStyle={styles.emptyCard}>
          <Text h4>리더 준비 중</Text>
          <Text style={styles.emptyText}>목록 탭에서 문서를 고르면 여기에서 리더 화면으로 이어집니다.</Text>
        </Card>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Card containerStyle={styles.headerCard}>
        <Text h4>{currentSubject.title}</Text>
        <Text style={styles.fileName}>{currentSubject.fileName}</Text>
        <Text style={styles.meta}>
          {readerSettings.typingIntervalMs}ms · 폰트 {readerSettings.fontScale.toFixed(2)}x
        </Text>
        <View style={styles.actions}>
          <Button
            title="재생"
            type={isPlaying ? 'solid' : 'outline'}
            onPress={() => setIsPlaying(true)}
            buttonStyle={styles.actionButton}
          />
          <Button
            title="일시정지"
            type={!isPlaying ? 'solid' : 'outline'}
            onPress={() => setIsPlaying(false)}
            buttonStyle={styles.actionButton}
          />
          <Button
            title="처음부터"
            type="clear"
            onPress={() => {
              setRestartToken((prev) => prev + 1);
              setIsPlaying(readerSettings.autoPlay);
            }}
          />
        </View>
      </Card>
      <ReaderTypingView
        content={currentSubject.content}
        typingIntervalMs={readerSettings.typingIntervalMs}
        fontScale={readerSettings.fontScale}
        isPlaying={isPlaying}
        restartToken={restartToken}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f4efe6'
  },
  headerCard: {
    borderRadius: 24,
    borderWidth: 0,
    backgroundColor: '#fff8ef'
  },
  fileName: {
    marginTop: 8,
    color: '#9a3412',
    fontWeight: '600'
  },
  meta: {
    marginTop: 8,
    color: '#6b7280'
  },
  actions: {
    marginTop: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8
  },
  actionButton: {
    backgroundColor: '#b45309'
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#f4efe6',
    padding: 16
  },
  emptyCard: {
    borderRadius: 24,
    borderWidth: 0
  },
  emptyText: {
    marginTop: 10,
    lineHeight: 22,
    color: '#6b7280'
  }
});
