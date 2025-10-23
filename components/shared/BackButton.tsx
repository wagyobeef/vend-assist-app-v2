import { IconSymbol } from "@/components/ui/icon-symbol";
import { router } from "expo-router";
import { StyleSheet, TouchableOpacity } from "react-native";

export default function BackButton() {
  const handlePress = () => {
    router.back();
  };

  return (
    <TouchableOpacity style={styles.button} onPress={handlePress}>
      <IconSymbol name="chevron.left" size={18} color="#007AFF" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingLeft: 0,
    paddingRight: 8,
    paddingVertical: 8,
  },
});
