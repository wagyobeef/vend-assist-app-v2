import { StyleSheet, TouchableOpacity } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import TopBar from "@/components/shared/TopBar";
import TopBarTitle from "@/components/shared/TopBarTitle";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { router } from "expo-router";

export default function TrackerPage() {
  return (
    <ThemedView style={styles.container}>
      <TopBar
        title={<TopBarTitle />}
        right={
          <TouchableOpacity onPress={() => router.push("/settings")}>
            <IconSymbol name="gearshape" size={24} color="#000" />
          </TouchableOpacity>
        }
      />
      <ThemedView style={styles.content}>
        <ThemedText type="title">Tracker</ThemedText>
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
