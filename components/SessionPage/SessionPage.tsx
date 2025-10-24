import BackButton from "@/components/shared/BackButton";
import TopBar from "@/components/shared/TopBar";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { getDatabase } from "@/lib/database";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";

interface Session {
  id: number;
  name: string;
  created_at: string;
}

export default function SessionPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  console.log("id", id);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSession = async () => {
      if (!id) return;

      try {
        const db = getDatabase();
        const result = await db.getFirstAsync<Session>(
          "SELECT * FROM sessions WHERE id = ?",
          [id]
        );
        setSession(result || null);
      } catch (error) {
        console.error("Failed to load session:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadSession();
    }
  }, [id]);

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <TopBar title="Loading..." left={<BackButton />} />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <TopBar title={session?.name || "Session"} left={<BackButton />} />
      <ThemedView style={styles.content}>
        <ThemedText type="title">Sessions</ThemedText>
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
