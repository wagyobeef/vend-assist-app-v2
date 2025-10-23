import { StyleSheet } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import TopBar from "@/components/shared/TopBar";
import BackButton from "@/components/shared/BackButton";

export default function SettingsPage() {
  return (
    <ThemedView style={styles.container}>
      <TopBar title="Settings" left={<BackButton />} />
      <ThemedView style={styles.content}>
        <ThemedText type="title">Settings</ThemedText>
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
