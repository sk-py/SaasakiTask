import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import PagerView from "react-native-pager-view";
import { DarkTheme, useTheme } from "@react-navigation/native";
import { dark, light } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";

import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  saveUsername,
  saveUserPreferences,
  selectUserData,
} from "@/src/userSlice";
import { AppDispatch } from "@/src/store";
import { GitHubTopics } from "@/utils/data";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { height, width } = Dimensions.get("window");

const OnBoarding = () => {
  const theme = useTheme();
  const isDarkTheme = theme.dark;

  const [error, setError] = useState(false);

  const pagerRef = useRef<PagerView | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const { name, userPrferences } = useSelector(selectUserData);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
    },
  });
  const onSubmit = async (data: { name: string }) => {
    await dispatch(saveUsername(data.name.trim()));
    handleNext(2);
  };

  const handleNext = (pageNo: number) => {
    pagerRef.current?.setPage(pageNo);
  };

  const handleComplete = async () => {
    if (userPrferences?.length < 4) {
      setError(true);
    } else {
      setError(false);
      await AsyncStorage.setItem("@onboarded", "1");
      router.replace("./(home)/");
    }
  };

  const addPreference = (topic: string) => {
    try {
      dispatch(saveUserPreferences(topic));
      setError(false);
    } catch (error) {
      console.log("Error saving preference:", error);
    }
  };

  const FirstPage = () => {
    return (
      <View
        style={[
          styles.pageContainer,
          { backgroundColor: isDarkTheme ? dark.background : light.background },
        ]}
      >
        <Image
          source={require("@/assets/images/icon.png")}
          style={styles.logo}
        />
        <View style={styles.textContainer}>
          <Text
            style={[
              styles.titleText,
              { color: isDarkTheme ? dark.text : light.text },
            ]}
          >
            GitHub Explorer
          </Text>
          <Text
            style={[
              styles.descriptionText,
              { color: isDarkTheme ? dark.text : light.text },
            ]}
          >
            Explore the world of open-source search, discover, and save your
            favorite GitHub repositories right from your pocket!
          </Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.6}
          style={[
            styles.continueButton,
            {
              backgroundColor: isDarkTheme ? dark.text : light.text,
            },
          ]}
          onPress={() => handleNext(1)}
        >
          <Text
            style={[
              styles.continueButtonText,
              { color: !isDarkTheme ? dark.text : light.text },
            ]}
          >
            Continue
          </Text>
          <Ionicons
            name="arrow-forward-circle"
            color={!isDarkTheme ? dark.text : light.text}
            size={18}
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>
    );
  };

  const SecondPage = () => {
    return (
      <View
        style={[
          styles.pageContainer,
          { backgroundColor: isDarkTheme ? dark.background : light.background },
        ]}
      >
        <Text
          style={[
            styles.titleText,
            { color: isDarkTheme ? dark.text : light.text },
          ]}
        >
          What should we call you?
        </Text>

        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              inputMode="text"
              placeholder="Enter your name"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholderTextColor={
                isDarkTheme ? dark.secondaryText : light.secondaryText
              }
              style={[
                styles.input,
                {
                  backgroundColor: isDarkTheme
                    ? dark.secondary
                    : light.secondary,
                  color: isDarkTheme ? dark.text : light.text,
                },
              ]}
            />
          )}
          name="name"
        />
        {errors.name && (
          <Text style={{ color: "red", textAlign: "center" }}>
            Please enter your name to personalize your experience
          </Text>
        )}
        <TouchableOpacity
          onPress={handleSubmit(onSubmit)}
          activeOpacity={0.6}
          style={[
            styles.continueButton,
            {
              backgroundColor: isDarkTheme ? dark.text : light.text,
            },
          ]}
        >
          <Text
            style={[
              styles.submitButtonText,
              { color: !isDarkTheme ? dark.text : light.text },
            ]}
          >
            Next
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const ThirdPage = () => {
    return (
      <View
        style={[
          styles.pageContainer2,
          { backgroundColor: isDarkTheme ? dark.background : light.background },
        ]}
      >
        <Ionicons
          name="person-circle"
          color={isDarkTheme ? light.secondary : dark.secondary}
          size={width * 0.2}
          // style={{ marginTop: height * 0.1 }}
        />
        <View style={styles.textContainer}>
          <Text
            style={[
              styles.titleText,
              { color: isDarkTheme ? dark.text : light.text },
            ]}
          >
            Hi 👋🏼 {name}!
          </Text>
          <View>
            <Text
              style={[
                styles.descriptionText,
                { color: isDarkTheme ? dark.text : light.text },
              ]}
            >
              Select at least 4-6 topics that interest you.
            </Text>
            <Text
              style={[
                styles.descriptionText,
                { color: isDarkTheme ? dark.text : light.text },
              ]}
            >
              This will help us personalize your experience.
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 6,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {GitHubTopics.map((topic, index) => {
              return (
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={{
                    backgroundColor: isDarkTheme
                      ? dark.secondary
                      : light.secondary,
                    padding: 4,
                    paddingHorizontal: 8,
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: userPrferences?.includes(topic)
                      ? isDarkTheme
                        ? dark.text
                        : "000"
                      : "transparent",
                  }}
                  key={index}
                  onPress={() => addPreference(topic)}
                >
                  <Text style={{ color: isDarkTheme ? dark.text : light.text }}>
                    #{topic}
                  </Text>
                </TouchableOpacity>
              );
            })}
            {error && (
              <Text style={{ color: "red" }}>
                Please select atleast 4 topics
              </Text>
            )}
          </View>
        </View>
        <TouchableOpacity
          activeOpacity={0.6}
          style={[
            styles.continueButton,
            {
              backgroundColor: isDarkTheme ? dark.text : light.text,
            },
          ]}
          onPress={handleComplete}
        >
          <Text
            style={[
              styles.continueButtonText,
              { color: !isDarkTheme ? dark.text : light.text },
            ]}
          >
            Get Started!
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <PagerView
        style={styles.pagerView}
        initialPage={0}
        scrollEnabled={false}
        ref={pagerRef}
      >
        <FirstPage key="1" />
        <SecondPage key="2" />
        <ThirdPage key="3" />
      </PagerView>
    </View>
  );
};

export default OnBoarding;

const styles = StyleSheet.create({
  container: {
    height: "100%",
  },
  pagerView: {
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  pageContainer: {
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    position: "relative",
  },
  pageContainer2: {
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingBottom: height * 0.1,
    position: "relative",
  },
  logo: {
    borderRadius: 100,
    width: width * 0.3,
    height: width * 0.3,
    resizeMode: "contain",
  },
  textContainer: {
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    marginTop: "3%",
  },
  titleText: {
    fontFamily: "SFBold",
    fontSize: 20,
  },
  descriptionText: {
    textAlign: "center",
    paddingHorizontal: width * 0.04,
    fontFamily: "SFMed",
    opacity: 0.9,
    fontSize: 16,
  },
  descriptionText2: {
    textAlign: "center",
    paddingHorizontal: width * 0.04,
    fontFamily: "SFMed",
    opacity: 0.9,
    fontSize: 14,
  },
  continueButton: {
    padding: 10,
    borderRadius: 10,
    width: "80%",
    marginTop: "4%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    position: "absolute",
    bottom: height * 0.06,
  },
  continueButtonText: {
    textAlign: "center",
    fontFamily: "SFBold",
    fontSize: 16,
  },
  icon: {
    marginTop: 2,
  },
  input: {
    width: "80%",
    padding: 12,
    borderRadius: 10,
    fontSize: 16,
    marginVertical: 16,
  },
  submitButton: {
    padding: 10,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
    justifyContent: "center",
  },
  submitButtonText: {
    textAlign: "center",
    fontFamily: "SFBold",
    fontSize: 16,
  },
});
