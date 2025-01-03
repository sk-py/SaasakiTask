import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const useOnboardingState = (): boolean | null => {
  const [isOnboarded, setIsOnboarded] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchOnboardingState = async () => {
      try {
        const value = await AsyncStorage.getItem("@onboarded");
        setIsOnboarded(value === "1"); // '1' means onboarded
      } catch (e) {
        console.error("Error fetching onboarding state:", e);
        setIsOnboarded(false); // Default to false on error
      }
    };

    fetchOnboardingState();
  }, []);

  return isOnboarded;
};

