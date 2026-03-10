import { StyleSheet, View } from 'react-native';
import { Button, ButtonGroup, Card, Slider, Switch, Text } from '@rneui/themed';
import { useAppStore } from '../store/useAppStore';

const FONT_OPTIONS = ['Sans', 'Serif', 'Mono'];
const FONT_VALUES = ['sans', 'serif', 'mono'] as const;

export const SettingsScreen = () => {
  const readerSettings = useAppStore((state) => state.readerSettings);
  const subjects = useAppStore((state) => state.subjects);
  const currentSubject = useAppStore((state) => state.currentSubject);
  const updateReaderSettings = useAppStore((state) => state.updateReaderSettings);

  return (
    <View style={styles.container}>
      <Card containerStyle={styles.card}>
        <Text h3>옵션</Text>
        <Text style={styles.description}>
          문서 읽기 속도와 글자 크기를 조절하면 리더 탭이 즉시 같은 상태를 사용합니다.
        </Text>

        <View style={styles.row}>
          <Text style={styles.label}>자동 재생</Text>
          <Switch
            value={readerSettings.autoPlay}
            onValueChange={(value) => updateReaderSettings({ autoPlay: value })}
            color="#b45309"
          />
        </View>

        <Text style={styles.sectionLabel}>읽기 속도</Text>
        <Text style={styles.value}>{readerSettings.typingIntervalMs}</Text>
        <Slider
          value={readerSettings.typingIntervalMs}
          onValueChange={(value) => updateReaderSettings({ typingIntervalMs: value })}
          minimumValue={20}
          maximumValue={120}
          step={5}
          thumbStyle={styles.thumb}
          minimumTrackTintColor="#b45309"
        />

        <Text style={styles.sectionLabel}>글자 크기</Text>
        <Text style={styles.value}>{readerSettings.fontScale.toFixed(2)}x</Text>
        <Slider
          value={readerSettings.fontScale}
          onValueChange={(value) => updateReaderSettings({ fontScale: value })}
          minimumValue={0.9}
          maximumValue={1.6}
          step={0.05}
          thumbStyle={styles.thumb}
          minimumTrackTintColor="#7c3aed"
        />

        <Text style={styles.sectionLabel}>폰트 스타일</Text>
        <ButtonGroup
          buttons={FONT_OPTIONS}
          selectedIndex={FONT_VALUES.indexOf(readerSettings.fontPreset)}
          onPress={(index) => updateReaderSettings({ fontPreset: FONT_VALUES[index] })}
        />

        <Button
          title="기본값으로 되돌리기"
          type="outline"
          onPress={() =>
            updateReaderSettings({
              typingIntervalMs: 40,
              autoPlay: true,
              fontScale: 1,
              fontPreset: 'sans'
            })
          }
        />
      </Card>

      <Card containerStyle={styles.card}>
        <Text h4>현재 상태</Text>
        <View style={styles.row}>
          <Text style={styles.label}>선택 문서</Text>
          <Text style={styles.value}>{currentSubject?.title ?? '없음'}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>등록 파일 수</Text>
          <Text style={styles.value}>{subjects.length}</Text>
        </View>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4efe6',
    padding: 16
  },
  card: {
    borderRadius: 24,
    borderWidth: 0,
    backgroundColor: '#fffefb'
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12
  },
  label: {
    color: '#374151',
    fontSize: 16
  },
  value: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '600'
  },
  description: {
    marginTop: 10,
    color: '#4b5563',
    lineHeight: 22
  },
  sectionLabel: {
    marginTop: 12,
    color: '#9a3412',
    fontWeight: '700'
  },
  thumb: {
    height: 22,
    width: 22,
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#b45309'
  }
});
