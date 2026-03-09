import { useCallback } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useAppStore } from '../store/useAppStore';

export const FileListScreen = () => {
  const subjects = useAppStore((state) => state.subjects);
  const selectedSubjectId = useAppStore((state) => state.selectedSubjectId);
  const selectSubject = useAppStore((state) => state.selectSubject);

  const onPress = useCallback(
    (id: string) => {
      void selectSubject(id);
    },
    [selectSubject]
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>읽을 파일 목록</Text>
      <FlatList
        data={subjects}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const selected = selectedSubjectId === item.id;
          return (
            <Pressable
              onPress={() => onPress(item.id)}
              style={[styles.card, selected && styles.selectedCard]}
            >
              <Text style={styles.fileName}>{item.fileName}</Text>
              <Text style={styles.caption}>{item.title}</Text>
            </Pressable>
          );
        }}
      />
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
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 12
  },
  card: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    backgroundColor: '#fafafa'
  },
  selectedCard: {
    borderColor: '#2563eb',
    backgroundColor: '#eff6ff'
  },
  fileName: {
    fontSize: 16,
    fontWeight: '600'
  },
  caption: {
    marginTop: 4,
    color: '#4b5563'
  }
});
