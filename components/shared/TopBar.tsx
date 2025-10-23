import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { StyleSheet, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import TopBarTitle from "./TopBarTitle";

export default function TopBar() {
  const insets = useSafeAreaInsets();

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      <ThemedView style={styles.content}>
        <TopBarTitle />
        <TouchableOpacity style={styles.settingsButton} onPress={() => {}}>
          <IconSymbol name="gearshape" size={24} color="#000" />
        </TouchableOpacity>
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
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  settingsButton: {
    position: "absolute",
    right: 16,
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
  },
  assistText: {
    color: "rgb(197, 32, 24)",
  },
});
