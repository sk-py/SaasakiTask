import React, { useEffect } from "react";
import { View, Image, StyleSheet, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { useOnboardingState } from "@/hooks/useOnboardingState";

export default function InitialScreen() {
  const isOnboarded = useOnboardingState();

  useEffect(() => {
    if (isOnboarded === null) {
      return;
    }

    if (isOnboarded) {
      router.replace("/(home)");
    } else {
      router.replace("/onBoarding");
    }
  }, [isOnboarded]);

  return (
    <View style={[styles.container]}>
      <Image
        source={require("@/assets/images/icon.png")}
        style={styles.image}
        resizeMode="contain"
      />
      <ActivityIndicator color={"#000"} size={30} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    gap: 12,
  },
  image: {
    width: 200,
    height: 200,
  },
});
