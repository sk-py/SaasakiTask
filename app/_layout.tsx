import { useOnboardingState } from "@/hooks/useOnboardingState";
import store from "@/src/store";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { useColorScheme } from "react-native";
import "react-native-reanimated";
import { Provider } from "react-redux";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

type RootLayoutNavProps = {
  isOnboarded: boolean | null; // 'null' accounts for the initialization state
};

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    SFBold: require("../assets/fonts/SF-Pro-Display-Bold.otf"),
    SFMed: require("../assets/fonts/SF-Pro-Text-Medium.otf"),
    ...FontAwesome.font,
  });

  const isOnboarded = useOnboardingState(); // Fetch onboarding state

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    const hideSplashScreen = async () => {
      if (loaded && isOnboarded !== null) {
        await SplashScreen.hideAsync();
      }
    };

    hideSplashScreen();
  }, [loaded]);

  if (!loaded || isOnboarded === null) {
    return null; // Keep splash screen visible until the app is ready
  }

  return <RootLayoutNav isOnboarded={isOnboarded} />;
}

function RootLayoutNav({ isOnboarded }: RootLayoutNavProps) {
  const colorScheme = useColorScheme();

  return (
    <Provider store={store}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
        <Stack initialRouteName={isOnboarded ? "(home)" : "onBoardingScreen"}>
          <Stack.Screen
            redirect={isOnboarded ? true : false}
            name="onBoardingScreen"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="(home)"
            redirect={isOnboarded ? false : true}
            options={{ headerShown: false }}
          />
        </Stack>
      </ThemeProvider>
    </Provider>
  );
}
