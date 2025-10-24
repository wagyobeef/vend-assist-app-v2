import BackButton from "@/components/shared/BackButton";
import TopBar from "@/components/shared/TopBar";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { StyleSheet } from "react-native";

export default function SessionPage() {
  return (
    <ThemedView style={styles.container}>
      <TopBar title="Session" left={<BackButton />} />
      <ThemedView style={styles.content}>
        <ThemedText type="title">Session</ThemedText>
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
