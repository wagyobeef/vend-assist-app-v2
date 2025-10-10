import React from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

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

interface SummaryModalProps {
  isVisible: boolean;
  onClose: () => void;
  vendorItems: VendorItem[];
  collectorItems: CollectorItem[];
  sessionId?: string;
  onSaveDeal?: () => void;
}

export default function SummaryModal({
  isVisible,
  onClose,
  vendorItems,
  collectorItems,
  sessionId,
  onSaveDeal,
}: SummaryModalProps) {
  let content: React.ReactNode | null = null;

  if (vendorItems.length === 0) {
    const itemList: React.ReactNode[] = collectorItems.map((item, idx) => {
      const saleValue =
        (item.value ? item.value : 0) * (item.sellPercentage / 100);
      return (
        <ItemRow key={item.id} item={item} idx={idx} saleValue={saleValue} />
      );
    });

    content = (
      <ThemedView>
        <ThemedText style={styles.sectionHeader}>
          Collector is offering
        </ThemedText>
        {itemList}
        <ThemedView style={styles.divider} />
        <ThemedView style={styles.totalRow}>
          <ThemedText>Vendor owes</ThemedText>
          <ThemedText>
            {formatPrice(
              collectorItems.reduce(
                (acc, item) =>
                  acc +
                  (item.value ? item.value : 0) * (item.sellPercentage / 100),
                0
              )
            )}
          </ThemedText>
        </ThemedView>
      </ThemedView>
    );
  } else if (collectorItems.length === 0) {
    const itemList: React.ReactNode[] = vendorItems.map((item, idx) => {
      const saleValue = (item.value ? item.value : 0) * (item.percentage / 100);
      return (
        <ThemedView key={item.id}>
          {item.percentage === 100 ? (
            <ThemedView style={styles.itemRow}>
              <ThemedText style={styles.itemName}>
                {item.name ? item.name : `Item ${idx + 1}`}
              </ThemedText>
              <ThemedText>{formatPrice(item.value)}</ThemedText>
            </ThemedView>
          ) : (
            <ItemRow item={item} idx={idx} saleValue={saleValue} />
          )}
        </ThemedView>
      );
    });

    content = (
      <ThemedView>
        <ThemedText style={styles.sectionHeader}>Vendor is offering</ThemedText>
        {itemList}
        <ThemedView style={styles.divider} />
        <ThemedView style={styles.totalRow}>
          <ThemedText>Collector owes</ThemedText>
          <ThemedText>
            {formatPrice(
              vendorItems.reduce(
                (acc, item) =>
                  acc + (item.value ? item.value : 0) * (item.percentage / 100),
                0
              )
            )}
          </ThemedText>
        </ThemedView>
      </ThemedView>
    );
  } else {
    const buyList: React.ReactNode[] = vendorItems.map((item, idx) => {
      const saleValue = (item.value ? item.value : 0) * (item.percentage / 100);
      return (
        <ThemedView key={item.id}>
          {item.percentage === 100 ? (
            <ThemedView style={styles.itemRow}>
              <ThemedText style={styles.itemName}>
                {item.name ? item.name : `Item ${idx + 1}`}
              </ThemedText>
              <ThemedText>{formatPrice(item.value)}</ThemedText>
            </ThemedView>
          ) : (
            <ItemRow item={item} idx={idx} saleValue={saleValue} />
          )}
        </ThemedView>
      );
    });

    const totalVendorValue = vendorItems.reduce(
      (acc, item) =>
        acc + (item.value ? item.value : 0) * (item.percentage / 100),
      0
    );

    const sortedCollectorItems = [...collectorItems].sort(
      (a, b) => (b.tradePercentage || 0) - (a.tradePercentage || 0)
    );

    let tradeUsed = 0;
    let totalCollectorValue = 0;
    const collectorList: React.ReactNode[] = [];

    for (let i = 0; i < sortedCollectorItems.length; i++) {
      const item = sortedCollectorItems[i];
      const fullValue = item.value || 0;

      const tradePercent = (item.tradePercentage || 0) / 100;
      const sellPercent = (item.sellPercentage || 0) / 100;

      const maxTradeValue = fullValue * tradePercent;
      const remainingTradeNeeded = totalVendorValue - tradeUsed;

      const tradeValueToUse = Math.min(remainingTradeNeeded, maxTradeValue);
      const isSplit = tradeValueToUse > 0 && tradeValueToUse < maxTradeValue;

      // Trade part
      if (tradeValueToUse > 0) {
        totalCollectorValue += tradeValueToUse;
        collectorList.push(
          <ItemRow
            key={`trade-${i}`}
            item={{
              ...item,
              value: tradeValueToUse / tradePercent || 0,
            }}
            idx={i}
            saleValue={tradeValueToUse}
            isTrade={true}
            showType={true}
            isSplit={isSplit}
          />
        );
        tradeUsed += tradeValueToUse;
      }

      // Cash part
      if (sellPercent > 0) {
        const remainingItemValue =
          fullValue - (tradeValueToUse / tradePercent || 0);
        const cashValueToUse = remainingItemValue * sellPercent;

        if (cashValueToUse > 0) {
          totalCollectorValue += cashValueToUse;
          collectorList.push(
            <ItemRow
              key={`cash-${i}`}
              item={{
                ...item,
                value: remainingItemValue,
              }}
              idx={i}
              saleValue={cashValueToUse}
              isTrade={false}
              showType={true}
              isSplit={isSplit}
            />
          );
        }
      }
    }

    content = (
      <ThemedView>
        <ThemedText style={styles.sectionHeader}>Vendor is offering</ThemedText>
        {buyList}
        <ThemedView style={styles.divider} />
        <ThemedView style={styles.totalRowRight}>
          <ThemedText style={styles.bold}>
            {formatPrice(totalVendorValue)}
          </ThemedText>
        </ThemedView>
        <ThemedText style={styles.sectionHeader}>
          Collector is offering
        </ThemedText>
        {collectorList}
        <ThemedView style={styles.divider} />
        <ThemedView style={styles.totalRowRight}>
          <ThemedText style={styles.bold}>
            {formatPrice(totalCollectorValue)}
          </ThemedText>
        </ThemedView>
        <ThemedText style={[styles.bold, styles.finalTotal]}>
          {totalCollectorValue > totalVendorValue ? "Vendor" : "Collector"} owes{" "}
          {formatPrice(Math.abs(totalCollectorValue - totalVendorValue))}
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <>
      <Modal
        visible={isVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={onClose}
      >
        <ThemedView style={styles.modalOverlay}>
          <Pressable style={styles.backdropArea} onPress={onClose} />
          <ThemedView style={styles.modalContainer}>
            <ThemedView style={styles.modalHeader}>
              <TouchableOpacity onPress={onClose}>
                <ThemedText style={styles.closeButton}>Close</ThemedText>
              </TouchableOpacity>
            </ThemedView>
            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={true}
            >
              {content}
            </ScrollView>
            {sessionId && (
              <TouchableOpacity
                style={styles.saveDealButton}
                onPress={onSaveDeal}
              >
                <ThemedText style={styles.saveDealButtonText}>
                  Save Deal
                </ThemedText>
              </TouchableOpacity>
            )}
          </ThemedView>
        </ThemedView>
      </Modal>
    </>
  );
}

const ItemRow = ({
  item,
  idx,
  saleValue,
  isTrade = false,
  isSplit = false,
  showType = false,
}: {
  item: CollectorItem | VendorItem;
  idx: number;
  saleValue: number;
  isTrade?: boolean;
  isSplit?: boolean;
  showType?: boolean;
}) => {
  const percentage =
    isTrade && "tradePercentage" in item
      ? item.tradePercentage
      : "percentage" in item
      ? item.percentage
      : item.sellPercentage;

  return (
    <ThemedView>
      <ThemedText style={styles.itemName}>
        {item.name ? item.name : `Item ${idx + 1}`} {isSplit && "- split"}
      </ThemedText>
      <ThemedView style={styles.itemRow}>
        <ThemedText style={styles.itemDetails}>
          {formatPrice(item.value)} at {percentage}%{" "}
          {showType && (isTrade ? "(trade)" : "(cash)")}
        </ThemedText>
        <ThemedText>{formatPrice(saleValue)}</ThemedText>
      </ThemedView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  backdropArea: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContainer: {
    height: 500,
    backgroundColor: "white",
    borderRadius: 10,
    width: "90%",
    flexDirection: "column",
    overflow: "hidden",
  },
  scrollView: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 10,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  closeButton: {
    color: "#007AFF",
    fontSize: 16,
  },
  saveDealButton: {
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "rgb(59, 130, 246)",
    backgroundColor: "rgb(59, 130, 246)",
    margin: 16,
    marginTop: 0,
  },
  saveDealButtonText: {
    textAlign: "center",
    fontWeight: "600",
    color: "white",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    marginTop: 8,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemName: {
    fontWeight: "600",
  },
  itemDetails: {
    color: "#666",
    fontSize: 14,
  },
  divider: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginVertical: 8,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalRowRight: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  bold: {
    fontWeight: "600",
  },
  finalTotal: {
    marginTop: 16,
    fontSize: 16,
  },
});
