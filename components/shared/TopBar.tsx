import { ThemedView } from "@/components/themed-view";
import { ReactNode } from "react";
import { StyleSheet, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface TopBarProps {
  title?: string | ReactNode;
  left?: ReactNode;
  right?: ReactNode;
}

export default function TopBar({ title, left, right }: TopBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      <ThemedView style={styles.content}>
        {left && <ThemedView style={styles.leftContainer}>{left}</ThemedView>}
        <ThemedView style={styles.centerContainer}>
          {typeof title === "string" ? (
            <Text style={styles.title}>{title}</Text>
          ) : (
            title
          )}
        </ThemedView>
        {right && <ThemedView style={styles.rightContainer}>{right}</ThemedView>}
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  content: {
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  leftContainer: {
    flex: 0,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  rightContainer: {
    flex: 0,
    justifyContent: "center",
    alignItems: "flex-end",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
  },
});
