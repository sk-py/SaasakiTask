import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@react-navigation/native";
import { dark, light } from "@/constants/Colors";
import Onboarding from "@/components/OnBoarding";

const OnBoardingScreen = () => {
  const theme = useTheme();
  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: theme.dark ? dark.background : light.background },
      ]}
    >
      <Onboarding />
    </SafeAreaView>
  );
};

export default OnBoardingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
