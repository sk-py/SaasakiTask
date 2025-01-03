import { Button, StyleSheet, Text, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@react-navigation/native";
import { dark, light } from "@/constants/Colors";
import AsyncStorage from "@react-native-async-storage/async-storage";

const index = () => {
  const theme = useTheme();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          height: "100%",
          backgroundColor: theme.dark ? dark.background : light.background,
        }}
          >
           <Button title="Delete" onPress={async()=> await AsyncStorage.removeItem("@onboarded")} />   
      </View>
    </SafeAreaView>
  );
};

export default index;

const styles = StyleSheet.create({});
