import { StyleSheet, View } from 'react-native';
import { ButtonGroup, Overlay, Slider, Switch, Text } from '@rneui/themed';
import type { ReaderSettings } from '../domains/reader/reader_port';

type Props = {
  visible: boolean;
  settings: ReaderSettings;
  onClose: () => void;
  onChange: (settings: Partial<ReaderSettings>) => void;
};

const FONT_OPTIONS: ReaderSettings['fontPreset'][] = ['sans', 'serif', 'mono'];

export const ReaderSettingsMenu = ({ visible, settings, onClose, onChange }: Props) => {
  return (
    <Overlay isVisible={visible} onBackdropPress={onClose} overlayStyle={styles.overlay}>
      <Text h4>리더 설정</Text>
      <Text style={styles.description}>현재 리더 안에서 폰트 스타일과 속도를 바로 바꿀 수 있습니다.</Text>

      <View style={styles.row}>
        <Text style={styles.label}>자동 재생</Text>
        <Switch
          value={settings.autoPlay}
          onValueChange={(value) => onChange({ autoPlay: value })}
          color="#b45309"
        />
      </View>

      <Text style={styles.sectionLabel}>폰트 스타일</Text>
      <ButtonGroup
        buttons={['Sans', 'Serif', 'Mono']}
        selectedIndex={FONT_OPTIONS.indexOf(settings.fontPreset)}
        onPress={(index) => onChange({ fontPreset: FONT_OPTIONS[index] })}
      />

      <Text style={styles.sectionLabel}>폰트 크기 {settings.fontScale.toFixed(2)}x</Text>
      <Slider
        value={settings.fontScale}
        onValueChange={(value) => onChange({ fontScale: value })}
        minimumValue={0.9}
        maximumValue={1.6}
        step={0.05}
        thumbStyle={styles.thumb}
        minimumTrackTintColor="#7c3aed"
      />

      <Text style={styles.sectionLabel}>읽기 속도 {settings.typingIntervalMs}</Text>
      <Slider
        value={settings.typingIntervalMs}
        onValueChange={(value) => onChange({ typingIntervalMs: value })}
        minimumValue={20}
        maximumValue={120}
        step={5}
        thumbStyle={styles.thumb}
        minimumTrackTintColor="#b45309"
      />
    </Overlay>
  );
};

const styles = StyleSheet.create({
  overlay: {
    width: '88%',
    borderRadius: 24,
    padding: 20,
    backgroundColor: '#fffefb'
  },
  description: {
    marginTop: 10,
    color: '#4b5563',
    lineHeight: 21
  },
  row: {
    marginTop: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  label: {
    color: '#374151',
    fontSize: 16
  },
  sectionLabel: {
    marginTop: 16,
    color: '#9a3412',
    fontWeight: '700'
  },
  thumb: {
    width: 22,
    height: 22,
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#b45309'
  }
});
