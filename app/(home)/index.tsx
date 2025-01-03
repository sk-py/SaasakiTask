import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@react-navigation/native";
import { dark, light } from "@/constants/Colors";

const index = () => {
  const theme = useTheme();

  console.log(theme);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          height: "100%",
          backgroundColor: theme.dark ? dark.background : light.background,
        }}
      ></View>
    </SafeAreaView>
  );
};

export default index;

const styles = StyleSheet.create({});
