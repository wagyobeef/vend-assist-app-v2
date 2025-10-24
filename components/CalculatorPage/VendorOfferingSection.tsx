import { Picker } from "@react-native-picker/picker";
import { useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import ReanimatedSwipeable from "react-native-gesture-handler/ReanimatedSwipeable";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { PERCENTAGE_OPTIONS } from "@/utils/percentages";

interface VendorOfferingSectionProps {
  vendorItems: {
    id: number;
    name: string;
    value: number;
    percentage: number;
  }[];
  setVendorItems: React.Dispatch<
    React.SetStateAction<
      { id: number; name: string; value: number; percentage: number }[]
    >
  >;
  nextId: number;
  setNextId: React.Dispatch<React.SetStateAction<number>>;
}

export default function VendorOfferingSection({
  vendorItems,
  setVendorItems,
  nextId,
  setNextId,
}: VendorOfferingSectionProps) {
  const [openPickerId, setOpenPickerId] = useState<number | null>(null);
  const [tempPickerValue, setTempPickerValue] = useState<number>(100);

  const addVendorItem = () => {
    setVendorItems([
      ...vendorItems,
      {
        id: nextId,
        name: "",
        value: 0,
        percentage: 100,
      },
    ]);
    setNextId(nextId + 1);
  };

  const deleteVendorItem = (id: number) => {
    setVendorItems(vendorItems.filter((item) => item.id !== id));
  };

  const updateVendorItem = (
    id: number,
    field: "name" | "value" | "percentage",
    value: string | number
  ) => {
    setVendorItems(
      vendorItems.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const openPicker = (id: number) => {
    const item = vendorItems.find((item) => item.id === id);
    setTempPickerValue(item?.percentage || 100);
    setOpenPickerId(id);
  };

  const closePicker = () => {
    setOpenPickerId(null);
  };

  const handleDone = () => {
    if (openPickerId) {
      updateVendorItem(openPickerId, "percentage", tempPickerValue);
    }
    closePicker();
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="subtitle" style={styles.headerText}>
        Vendor is offering
      </ThemedText>
      <ThemedView style={styles.listContainer}>
        {vendorItems.map((item, index) => (
          <ItemRow
            key={item.id}
            item={item}
            isFirst={index === 0}
            onDelete={() => deleteVendorItem(item.id)}
            onUpdate={(field, value) => updateVendorItem(item.id, field, value)}
            itemNumber={index + 1}
            onOpenPicker={() => openPicker(item.id)}
          />
        ))}
      </ThemedView>
      <TouchableOpacity style={styles.addItemButton} onPress={addVendorItem}>
        <ThemedText style={styles.addItemText}>Add Item</ThemedText>
      </TouchableOpacity>

      {/* Modal Picker */}
      <Modal
        visible={openPickerId !== null}
        transparent={true}
        animationType="slide"
        onRequestClose={closePicker}
      >
        <Pressable style={styles.modalOverlay} onPress={closePicker}>
          <Pressable
            style={styles.modalContent}
            onPress={(e) => e.stopPropagation()}
          >
            <ThemedView style={styles.modalHeader}>
              <TouchableOpacity onPress={closePicker}>
                <ThemedText style={styles.cancelButton}>Cancel</ThemedText>
              </TouchableOpacity>
              <ThemedText type="subtitle">Select Percentage</ThemedText>
              <TouchableOpacity onPress={handleDone}>
                <ThemedText style={styles.doneButton}>Done</ThemedText>
              </TouchableOpacity>
            </ThemedView>
            <Picker
              selectedValue={tempPickerValue}
              onValueChange={(value) => {
                setTempPickerValue(value);
              }}
              style={styles.modalPicker}
            >
              {PERCENTAGE_OPTIONS.map((percentage) => (
                <Picker.Item
                  key={percentage}
                  label={`${percentage}%`}
                  value={percentage}
                />
              ))}
            </Picker>
          </Pressable>
        </Pressable>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    marginBottom: 24,
  },
  listContainer: {
    flexDirection: "column",
    marginBottom: 8,
  },
  headerText: {
    fontWeight: "600",
    marginBottom: 8,
  },
  addItemButton: {
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "rgb(59, 130, 246)",
    borderTopWidth: 0,
    backgroundColor: "rgb(59, 130, 246)",
  },
  addItemText: {
    textAlign: "center",
    fontWeight: "600",
    color: "white",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 10,
    maxHeight: "40%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  cancelButton: {
    color: "#007AFF",
    fontSize: 16,
  },
  doneButton: {
    color: "#007AFF",
    fontSize: 16,
  },
  modalPicker: {
    height: "100%",
  },
});

function ItemRow({
  item,
  isFirst,
  onDelete,
  onUpdate,
  itemNumber,
  onOpenPicker,
}: {
  item: { id: number; name: string; value: number; percentage: number };
  isFirst: boolean;
  onDelete: () => void;
  onUpdate: (
    field: "name" | "value" | "percentage",
    value: string | number
  ) => void;
  itemNumber: number;
  onOpenPicker: () => void;
}) {
  const [displayValue, setDisplayValue] = useState(
    item.value > 0 ? item.value.toString() : ""
  );

  const renderRightActions = () => {
    return (
      <TouchableOpacity style={itemRowStyles.deleteButton} onPress={onDelete}>
        <IconSymbol name="trash" size={24} color="white" />
      </TouchableOpacity>
    );
  };

  return (
    <ThemedView
      style={[itemRowStyles.outerContainer, !isFirst && { borderTopWidth: 0 }]}
    >
      <ReanimatedSwipeable renderRightActions={renderRightActions}>
        <ThemedView style={itemRowStyles.container}>
          <ThemedView style={itemRowStyles.inputRow}>
            <TextInput
              style={itemRowStyles.nameInput}
              value={item.name}
              onChangeText={(text) => onUpdate("name", text)}
              placeholder={`Item ${itemNumber}`}
              placeholderTextColor="#A9A9A9"
              autoCorrect={false}
              returnKeyType="done"
            />
            <ThemedView style={itemRowStyles.valueInputContainer}>
              <TextInput
                style={itemRowStyles.valueInput}
                value={displayValue}
                onChangeText={(text) => {
                  // Only allow valid numeric input with optional decimal
                  if (text === "" || /^\d*\.?\d*$/.test(text)) {
                    setDisplayValue(text);
                    const numericValue = parseFloat(text);
                    if (!isNaN(numericValue)) {
                      onUpdate("value", numericValue);
                    } else {
                      onUpdate("value", 0);
                    }
                  }
                }}
                placeholder="Value"
                placeholderTextColor="#A9A9A9"
                keyboardType="numeric"
                returnKeyType="done"
              />
            </ThemedView>
          </ThemedView>
          <TouchableOpacity
            style={itemRowStyles.percentageDropdown}
            onPress={onOpenPicker}
          >
            <ThemedText style={itemRowStyles.percentageText}>
              {item.percentage === 100 ? "" : `At: ${item.percentage}%`}
            </ThemedText>
            <IconSymbol name="chevron.down" size={16} color="#666" />
          </TouchableOpacity>
        </ThemedView>
      </ReanimatedSwipeable>
    </ThemedView>
  );
}

const itemRowStyles = StyleSheet.create({
  outerContainer: {
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: "#e0e0e0",
  },
  container: {
    padding: 8,
    backgroundColor: "white",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  nameInput: {
    flex: 1,
    fontSize: 16,
    padding: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 4,
  },
  valueInputContainer: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    flexDirection: "row",
    padding: 8,
    borderRadius: 4,
    alignItems: "center",
  },
  valueInput: {
    width: 90,
    fontSize: 16,
    padding: 0,
  },
  dollarLabel: {
    fontSize: 16,
    color: "#333",
    marginRight: 2,
    lineHeight: 19,
  },
  deleteButton: {
    backgroundColor: "#ff4444",
    justifyContent: "center",
    alignItems: "center",
    width: 64,
    height: "100%",
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },
  deleteText: {
    color: "white",
    fontWeight: "600",
  },
  percentageRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    gap: 8,
  },
  percentageLabel: {
    fontSize: 14,
    color: "#666",
  },
  pickerContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 4,
    overflow: "hidden",
  },
  picker: {
    height: 40,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 4,
    backgroundColor: "white",
  },
  percentageDropdown: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 4,
    flex: 1,
    marginTop: 8,
  },
  percentageText: {
    fontSize: 16,
    color: "#333",
  },
});
