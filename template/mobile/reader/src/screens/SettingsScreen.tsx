import { StyleSheet, Text, View } from 'react-native';
import { useAppStore } from '../store/useAppStore';

export const SettingsScreen = () => {
  const readerSettings = useAppStore((state) => state.readerSettings);
  const subjects = useAppStore((state) => state.subjects);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>설정</Text>
      <View style={styles.row}>
        <Text style={styles.label}>Typing Interval</Text>
        <Text style={styles.value}>{readerSettings.typingIntervalMs}ms</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>등록 파일 수</Text>
        <Text style={styles.value}>{subjects.length}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 16
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 18
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb'
  },
  label: {
    color: '#374151',
    fontSize: 16
  },
  value: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '600'
  }
});
