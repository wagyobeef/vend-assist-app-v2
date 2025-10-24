import EditSessionPage from "@/components/SessionPage/EditSessionPage";
import { Stack } from "expo-router";

export default function EditSession() {
  return (
    <>
      <Stack.Screen
        options={{
          title: "Edit Session",
          headerShown: false,
        }}
      />
      <EditSessionPage />
    </>
  );
}
