import BackButton from "@/components/shared/BackButton";
import TopBar from "@/components/shared/TopBar";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { resetDatabase } from "@/lib/database";
import * as Updates from "expo-updates";
import { Alert, StyleSheet, TouchableOpacity } from "react-native";

export default function SettingsPage() {
  const handleResetDatabase = () => {
    Alert.alert(
      "Reset Database",
      "Are you sure you want to reset the database? This will delete all sessions and deals. This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Reset",
          style: "destructive",
          onPress: async () => {
            try {
              await resetDatabase();

              // Check if we can reload the app
              if (__DEV__) {
                // In development mode, just show a success message
                Alert.alert(
                  "Success",
                  "Database has been reset. Please restart the app manually to see changes."
                );
              } else {
                // In production, reload the app
                await Updates.reloadAsync();
              }
            } catch (error) {
              console.error("Failed to reset database:", error);
              Alert.alert(
                "Error",
                "Failed to reset database. Please try again."
              );
            }
          },
        },
      ]
    );
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
