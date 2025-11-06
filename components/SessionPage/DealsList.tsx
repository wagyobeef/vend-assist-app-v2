import { getDatabase } from "@/lib/database";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface Deal {
  id: number;
  name: string;
  created_at: string;
}

export default function DealsList() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDeals();
  }, []);

  const loadDeals = async () => {
    try {
      const db = getDatabase();
      const result = await db.getAllAsync<Deal>(
        "SELECT * FROM deals ORDER BY created_at DESC"
      );
      setDeals(result);
    } catch (error) {
      console.error("Failed to load deals:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderDeal = ({ item }: { item: Deal }) => (
    <TouchableOpacity
      style={styles.dealRow}
      onPress={() => router.push(`/deal/${item.id}`)}
    >
      <View style={styles.dealInfo}>
        <Text style={styles.dealName}>{item.name}</Text>
        <Text style={styles.dealDate}>
          {new Date(item.created_at).toLocaleDateString()}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#999999" />
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No deals yet</Text>
      <Text style={styles.emptySubtext}>Create a new deal to get started</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading deals...</Text>
      </View>
    );
  }

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Deals</Text>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          // TODO: Add functionality later
        }}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <FlatList
      data={deals}
      renderItem={renderDeal}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.listContainer}
      ListEmptyComponent={renderEmptyState}
      ListHeaderComponent={deals.length > 0 ? renderHeader : null}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
    />
  );
}

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexGrow: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000000",
  },
  addButton: {
    padding: 4,
  },
  addButtonText: {
    color: "rgb(59, 130, 246)",
    fontSize: 32,
    fontWeight: "300",
    lineHeight: 32,
  },
  dealRow: {
    backgroundColor: "#ffffff",
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 8,
  },
  dealInfo: {
    flex: 1,
  },
  separator: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginHorizontal: 8,
  },
  dealName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 4,
  },
  dealDate: {
    fontSize: 14,
    color: "#666666",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 64,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#666666",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#999999",
    marginBottom: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
