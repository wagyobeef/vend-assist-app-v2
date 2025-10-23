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
        <ThemedView style={styles.centerContainer}>
          {typeof title === "string" ? (
            <Text style={styles.title}>{title}</Text>
          ) : (
            title
          )}
        </ThemedView>
        {left && <ThemedView style={styles.leftContainer}>{left}</ThemedView>}
        {right && (
          <ThemedView style={styles.rightContainer}>{right}</ThemedView>
        )}
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
    justifyContent: "center",
  },
  leftContainer: {
    position: "absolute",
    left: 16,
    height: 60,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  centerContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  rightContainer: {
    position: "absolute",
    right: 16,
    height: 60,
    justifyContent: "center",
    alignItems: "flex-end",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
  },
});
