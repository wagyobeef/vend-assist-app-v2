import { useRef, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import CollectorOfferingSection from "@/components/CalculatorPage/CollectorOfferingSection";
import DealStatusSection from "@/components/CalculatorPage/DealStatusSection";
import SummaryModal from "@/components/CalculatorPage/SummaryModal";
import VendorOfferingSection from "@/components/CalculatorPage/VendorOfferingSection";
import TopBar from "@/components/shared/TopBar";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

export default function CalculatorContent() {
  const [vendorItems, setVendorItems] = useState<
    { id: number; name: string; value: number; percentage: number }[]
  >([]);
  const [collectorItems, setCollectorItems] = useState<
    {
      id: number;
      name: string;
      value: number;
      sellPercentage: number;
      tradePercentage: number;
    }[]
  >([]);
  const [vendorNextId, setVendorNextId] = useState(1);
  const [collectorNextId, setCollectorNextId] = useState(1);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleReset = () => {
    Alert.alert(
      "Reset Calculator",
      "Are you sure you want to reset all items? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Reset",
          style: "destructive",
          onPress: () => {
            setVendorItems([]);
            setCollectorItems([]);
            setVendorNextId(1);
            setCollectorNextId(1);
          },
        },
      ]
    );
  };

  return (
    <ThemedView style={styles.container}>
      <TopBar />
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
        >
          <ThemedView style={styles.buttonContainer}>
            <TouchableOpacity onPress={handleReset}>
              <ThemedText style={styles.resetText}>Reset</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowSummaryModal(true)}>
              <ThemedText style={styles.summarizeText}>Summarize</ThemedText>
            </TouchableOpacity>
          </ThemedView>
          <DealStatusSection
            vendorItems={vendorItems}
            collectorItems={collectorItems}
          />
          <VendorOfferingSection
            vendorItems={vendorItems}
            setVendorItems={setVendorItems}
            nextId={vendorNextId}
            setNextId={setVendorNextId}
          />
          <CollectorOfferingSection
            collectorItems={collectorItems}
            setCollectorItems={setCollectorItems}
            nextId={collectorNextId}
            setNextId={setCollectorNextId}
            scrollViewRef={scrollViewRef}
          />
          <SummaryModal
            isVisible={showSummaryModal}
            onClose={() => setShowSummaryModal(false)}
            vendorItems={vendorItems}
            collectorItems={collectorItems}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    backgroundColor: "white",
  },
  scrollContent: {
    paddingBottom: 80,
    padding: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 8,
  },
  resetText: {
    color: "#ff4444",
    fontSize: 16,
    fontWeight: "600",
  },
  summarizeText: {
    color: "#007AFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
