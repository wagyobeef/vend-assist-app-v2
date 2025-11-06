import BackButton from "@/components/shared/BackButton";
import TopBar from "@/components/shared/TopBar";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { getDatabase } from "@/lib/database";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import DealsList from "./DealsList";

interface Session {
  id: number;
  name: string;
  created_at: string;
}

export default function SessionPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
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

  const handleEditPress = () => {
    router.push("/edit-session");
  };

  return (
    <ThemedView style={styles.container}>
      <TopBar
        title={session?.name || "Session"}
        titleSize={18}
        left={<BackButton />}
        right={
          <TouchableOpacity onPress={handleEditPress}>
            <Ionicons
              name="create-outline"
              size={24}
              color="rgb(59, 130, 246)"
            />
          </TouchableOpacity>
        }
      />
      <ThemedView style={styles.content}>
        <DealsList />
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
  },
});
