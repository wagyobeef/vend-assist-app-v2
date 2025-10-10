import { StyleSheet } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import formatPrice from "@/utils/formatPrice";

interface VendorItem {
  id: number;
  name: string;
  value: number;
  percentage: number;
}

interface CollectorItem {
  id: number;
  name: string;
  value: number;
  sellPercentage: number;
  tradePercentage: number;
}

interface DealStatusSectionProps {
  vendorItems: VendorItem[];
  collectorItems: CollectorItem[];
}

export default function DealStatusSection({
  vendorItems,
  collectorItems,
}: DealStatusSectionProps) {
  let content: React.ReactNode = null;

  if (collectorItems.length === 0 && vendorItems.length === 0) {
    content = (
      <ThemedText style={styles.placeholderText}>
        Add items below to start a deal!
      </ThemedText>
    );
  } else if (collectorItems.length !== 0 && vendorItems.length === 0) {
    const saleValue = collectorItems.reduce(
      (acc, item) =>
        acc +
        ((item.value ? item.value : 0) * (item.sellPercentage / 100) || 0),
      0
    );
    const tradeValue = collectorItems.reduce(
      (acc, item) =>
        acc +
        ((item.value ? item.value : 0) * (item.tradePercentage / 100) || 0),
      0
    );
    content = (
      <ThemedView style={styles.contentContainer}>
        <ThemedText style={styles.text}>
          <ThemedText style={styles.boldText}>Collector</ThemedText> receives
        </ThemedText>
        <ThemedText style={styles.text}>
          <ThemedText style={styles.boldText}>
            {formatPrice(saleValue)}
          </ThemedText>{" "}
          in cash OR{" "}
          <ThemedText style={styles.boldText}>
            {formatPrice(tradeValue)}
          </ThemedText>{" "}
          in trade
        </ThemedText>
      </ThemedView>
    );
  } else {
    const vendorTotal = vendorItems.reduce(
      (sum, item) =>
        sum + ((item.value ? item.value : 0) * (item.percentage / 100) || 0),
      0
    );

    const sortedCollectorItems = [...collectorItems].sort(
      (a, b) => b.tradePercentage - a.tradePercentage
    );

    let remainingValueNeeded = vendorTotal;
    let collectorContribution = 0;

    for (const item of sortedCollectorItems) {
      const itemValue = item.value || 0;

      if (remainingValueNeeded <= 0) {
        // All value is cashed out
        collectorContribution += itemValue * (item.sellPercentage / 100);
        continue;
      }

      const maxTradeValue = itemValue * (item.tradePercentage / 100);
      const requiredRawForTrade =
        remainingValueNeeded / (item.tradePercentage / 100);

      if (itemValue <= requiredRawForTrade) {
        // Use full item for trade
        collectorContribution += maxTradeValue;
        remainingValueNeeded -= maxTradeValue;
      } else {
        // Use part of item for trade
        collectorContribution += remainingValueNeeded; // Exactly fills vendor value
        const leftoverRaw = itemValue - requiredRawForTrade;
        collectorContribution += leftoverRaw * (item.sellPercentage / 100);
        remainingValueNeeded = 0;
      }
    }

    const difference = vendorTotal - collectorContribution;

    content =
      difference > 0 ? (
        <ThemedText style={styles.text}>
          <ThemedText style={styles.boldText}>Collector</ThemedText> owes{" "}
          <ThemedText style={styles.boldText}>
            {formatPrice(difference)}
          </ThemedText>
        </ThemedText>
      ) : (
        <ThemedText style={styles.text}>
          <ThemedText style={styles.boldText}>Vendor</ThemedText> owes{" "}
          <ThemedText style={styles.boldText}>
            {formatPrice(Math.abs(difference))}
          </ThemedText>
        </ThemedText>
      );
  }

  return <ThemedView style={styles.container}>{content}</ThemedView>;
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 64,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    position: "relative",
  },
  contentContainer: {
    alignItems: "center",
  },
  text: {
    textAlign: "center",
    fontSize: 16,
    lineHeight: 24,
  },
  boldText: {
    fontWeight: "600",
  },
  placeholderText: {
    color: "#A9A9A9",
    textAlign: "center",
  },
});
