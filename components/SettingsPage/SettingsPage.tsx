import BackButton from "@/components/shared/BackButton";
import TopBar from "@/components/shared/TopBar";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { StyleSheet, TouchableOpacity } from "react-native";

export default function SettingsPage() {
  const handleResetDatabase = () => {
    // TODO: Implement database reset functionality
  };

  return (
    <ThemedView style={styles.container}>
      <TopBar title="Settings" left={<BackButton />} />
      <ThemedView style={styles.content}>
        <TouchableOpacity
          style={styles.resetButton}
          onPress={handleResetDatabase}
        >
          <ThemedText style={styles.resetButtonText}>Reset Database</ThemedText>
        </TouchableOpacity>
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
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  resetButton: {
    backgroundColor: "#ff4444",
    paddingVertical: 16,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
  },
  resetButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});
