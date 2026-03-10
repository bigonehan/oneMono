import { StyleSheet, View } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useNavigation } from '@react-navigation/native';
import { Card, ListItem, Text } from '@rneui/themed';
import type { Subject } from '../domains/subject/subject_port';
import { TAB_ROUTES } from '../navigation/routes';
import { useAppStore } from '../store/useAppStore';

export const FileListScreen = () => {
  const navigation = useNavigation();
  const subjects = useAppStore((state) => state.subjects);
  const selectedSubjectId = useAppStore((state) => state.selectedSubjectId);
  const selectSubject = useAppStore((state) => state.selectSubject);

  return (
    <View style={styles.container}>
      <Card containerStyle={styles.heroCard}>
        <Text h3>문서 라이브러리</Text>
        <Text style={styles.heroCopy}>
          md 문서를 고른 뒤 소개 탭과 리더 탭으로 바로 이어서 읽을 수 있습니다.
        </Text>
      </Card>
      <FlashList
        data={subjects}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyTitle}>표시할 문서가 없습니다.</Text>
            <Text style={styles.emptyCopy}>앱을 새로고침하면 시드 문서를 다시 불러옵니다.</Text>
          </View>
        }
        renderItem={({ item }: { item: Subject }) => {
          const selected = selectedSubjectId === item.id;
          return (
            <ListItem
              bottomDivider
              containerStyle={[styles.card, selected && styles.selectedCard]}
              onPress={() => {
                void selectSubject(item.id);
                navigation.navigate(TAB_ROUTES.intro as never);
              }}
            >
              <ListItem.Content>
                <ListItem.Title style={styles.fileName}>{item.title}</ListItem.Title>
                <ListItem.Subtitle style={styles.caption}>{item.fileName}</ListItem.Subtitle>
                <Text style={styles.description}>{item.description}</Text>
              </ListItem.Content>
              <ListItem.Chevron />
            </ListItem>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4efe6'
  },
  heroCard: {
    borderRadius: 24,
    borderWidth: 0,
    backgroundColor: '#fff8ef',
    marginBottom: 8
  },
  heroCopy: {
    marginTop: 10,
    color: '#4b5563',
    lineHeight: 22
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24
  },
  card: {
    borderRadius: 18,
    borderWidth: 0,
    backgroundColor: '#ffffff',
    marginBottom: 12
  },
  selectedCard: {
    backgroundColor: '#fff2d8'
  },
  fileName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937'
  },
  caption: {
    marginTop: 4,
    color: '#8a5a2b'
  },
  description: {
    marginTop: 8,
    color: '#4b5563',
    lineHeight: 20
  },
  emptyWrap: {
    borderRadius: 16,
    padding: 18,
    backgroundColor: '#fff8ef'
  },
  emptyTitle: {
    fontWeight: '700',
    color: '#7c2d12'
  },
  emptyCopy: {
    marginTop: 8,
    color: '#4b5563',
    lineHeight: 20
  }
});
