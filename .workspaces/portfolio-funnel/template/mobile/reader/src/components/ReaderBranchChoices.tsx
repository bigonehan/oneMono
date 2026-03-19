import { StyleSheet, View } from 'react-native';
import { Button, Card, Text } from '@rneui/themed';
import type { ReaderBranch } from '../modules/readerMarkdownParser';

type Props = {
  branch: ReaderBranch;
  onSelect: (targetId: string) => void;
};

export const ReaderBranchChoices = ({ branch, onSelect }: Props) => {
  return (
    <Card containerStyle={styles.card}>
      <Text h4>{branch.prompt}</Text>
      <View style={styles.actions}>
        {branch.options.map((option) => (
          <Button
            key={`${branch.cursor}:${option.targetId}`}
            title={option.label}
            onPress={() => onSelect(option.targetId)}
            buttonStyle={styles.button}
          />
        ))}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 22,
    borderWidth: 0,
    backgroundColor: '#fff7ed',
    marginHorizontal: 0,
    marginBottom: 12
  },
  actions: {
    marginTop: 12,
    gap: 10
  },
  button: {
    backgroundColor: '#b45309'
  }
});
