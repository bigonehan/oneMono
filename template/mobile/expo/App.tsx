import { StatusBar } from "expo-status-bar";
import { FlashList } from "@shopify/flash-list";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";

type Item = {
  id: string;
  title: string;
};

const DATA: Item[] = [
  { id: "1", title: "Expo + FlashList template" },
  { id: "2", title: "Edit App.tsx to start building screens" },
  { id: "3", title: "Use FlashList for large collections" },
];

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>React Native Template</Text>
        <Text style={styles.subtitle}>Expo + FlashList</Text>
      </View>
      <FlashList
        data={DATA}
        estimatedItemSize={56}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemText}>{item.title}</Text>
          </View>
        )}
      />
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f7f8",
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  header: {
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
  },
  subtitle: {
    marginTop: 4,
    fontSize: 14,
    color: "#4b5563",
  },
  item: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 14,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  itemText: {
    fontSize: 16,
    color: "#111827",
  },
});
