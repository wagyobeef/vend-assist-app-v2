import { useFonts } from "expo-font";
import { StyleSheet, Text } from "react-native";

export default function TopBarTitle() {
  const [fontsLoaded] = useFonts({
    "Montserrat-Regular": require("@/assets/fonts/Montserrat-Regular.ttf"),
    "Montserrat-SemiBold": require("@/assets/fonts/Montserrat-SemiBold.ttf"),
    "Montserrat-Bold": require("@/assets/fonts/Montserrat-Bold.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Text style={styles.title}>
      <Text>Vend</Text>
      <Text style={styles.assistText}>Assist</Text>
    </Text>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontFamily: "Montserrat-Bold",
  },
  assistText: {
    color: "rgb(197, 32, 24)",
  },
});
