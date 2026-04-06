import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Card, Chip, Text } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import { TAB_ROUTES } from '../navigation/routes';
import { useAppStore } from '../store/useAppStore';

const getPreviewText = (content: string): string => {
  return content.replace(/[#>*`-]/g, '').replace(/\n{2,}/g, '\n').trim().slice(0, 220);
};

export const DocumentIntroScreen = () => {
  const navigation = useNavigation();
  const currentSubject = useAppStore((state) => state.currentSubject);
  const subjects = useAppStore((state) => state.subjects);

  if (!currentSubject) {
    return (
      <View style={styles.emptyContainer}>
        <Card containerStyle={styles.emptyCard}>
          <Text h4>선택된 문서가 없습니다</Text>
          <Text style={styles.emptyDescription}>목록 탭에서 md 문서를 선택하면 소개 화면이 채워집니다.</Text>
        </Card>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Card containerStyle={styles.heroCard}>
        <Text h3>{currentSubject.title}</Text>
        <Text style={styles.fileName}>{currentSubject.fileName}</Text>
        <Text style={styles.description}>{currentSubject.description}</Text>
        <View style={styles.tagRow}>
          {currentSubject.tags.map((tag) => (
            <Chip key={tag} title={tag} size="sm" type="outline" containerStyle={styles.chip} />
          ))}
        </View>
        <Button
          title="리더 시작하기"
          onPress={() => navigation.navigate(TAB_ROUTES.reader as never)}
          buttonStyle={styles.primaryButton}
        />
      </Card>

      <Card containerStyle={styles.infoCard}>
        <Text h4>문서 소개</Text>
        <Text style={styles.infoText}>
          {currentSubject.description}
        </Text>
        <Text style={styles.metaLabel}>등록된 문서 수</Text>
        <Text style={styles.metaValue}>{subjects.length}개</Text>
        <Text style={styles.metaLabel}>미리보기</Text>
        <Text style={styles.preview}>{getPreviewText(currentSubject.content)}</Text>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4efe6'
  },
  content: {
    padding: 12,
    paddingBottom: 24
  },
  heroCard: {
    borderRadius: 24,
    borderWidth: 0,
    backgroundColor: '#fff8ef'
  },
  fileName: {
    marginTop: 10,
    color: '#8a5a2b',
    fontWeight: '600'
  },
  description: {
    marginTop: 12,
    lineHeight: 22,
    color: '#3d3328'
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 14
  },
  chip: {
    marginRight: 8,
    marginBottom: 8
  },
  primaryButton: {
    marginTop: 16,
    backgroundColor: '#b45309'
  },
  infoCard: {
    borderRadius: 20,
    borderWidth: 0,
    backgroundColor: '#ffffff'
  },
  infoText: {
    marginTop: 12,
    lineHeight: 22,
    color: '#374151'
  },
  metaLabel: {
    marginTop: 16,
    color: '#9a3412',
    fontWeight: '700'
  },
  metaValue: {
    marginTop: 4,
    color: '#111827'
  },
  preview: {
    marginTop: 8,
    lineHeight: 22,
    color: '#4b5563'
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#f4efe6'
  },
  emptyCard: {
    borderRadius: 24,
    borderWidth: 0
  },
  emptyDescription: {
    marginTop: 10,
    lineHeight: 22,
    color: '#4b5563'
  }
});
