import { StyleSheet } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import TopBar from "@/components/shared/TopBar";

export default function TrackerPage() {
  return (
    <ThemedView style={styles.container}>
      <TopBar />
      <ThemedView style={styles.content}>
        <ThemedText type="title">Tracker</ThemedText>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
