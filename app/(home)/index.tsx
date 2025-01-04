import React, { useEffect, useState, useCallback } from "react";
import {
  Dimensions,
  FlatList,
  ListRenderItemInfo,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@react-navigation/native";
import { dark, light } from "@/constants/Colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import RepositoryCard from "@/components/RepoCard";
import SkeletonLoader from "@/components/SkeletonLoader";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchRecommendedRepos,
  searchRepos,
  Repository,
} from "@/src/repoSlice";
import { RootState } from "@/src/store"; // Assuming you have a store.ts file
import { router } from "expo-router";

const { height, width, fontScale } = Dimensions.get("window");

const Index = () => {
  const theme = useTheme();
  const isDarkTheme = theme.dark;
  const dispatch = useDispatch();

  const [username, setUsername] = useState<string | null>(null);
  const [userPreference, setUserPreference] = useState<string[]>([]);
  const [searchText, setSearchText] = useState<string>("");

  const {
    data: repositories,
    loading,
    error,
    favourites,
  } = useSelector((state: RootState) => state.repos);

  const fetchUserData = useCallback(async () => {
    try {
      const data = await AsyncStorage.multiGet([
        "@username",
        "@userPreferences",
      ]);
      const name = data[0][1];
      const preferences = data[1][1] ? JSON.parse(data[1][1]) : [];
      setUsername(name);
      setUserPreference(preferences);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }, []);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  useEffect(() => {
    if (userPreference.length > 0) {
      dispatch(fetchRecommendedRepos(userPreference) as any);
    }
  }, [userPreference, dispatch]);

  const handleSearch = (text: string) => {
    setSearchText(text);
  };

  const handleSearchSubmit = () => {
    if (searchText.trim()) {
      dispatch(searchRepos(searchText) as any);
    }
  };

  const renderItem = ({ item }: ListRenderItemInfo<Repository>) => (
    <RepositoryCard
      repository={item}
      isFavorite={favourites.includes(item.id.toString())}
    />
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          height: "100%",
          width: width,
          backgroundColor: isDarkTheme ? dark.background : light.background,
        }}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Image
              source={require("@/assets/images/icon.png")}
              style={styles.headerIcon}
            />
            <View>
              <Text
                style={[
                  styles.headerTitle,
                  { color: isDarkTheme ? dark.text : light.text },
                ]}
              >
                GitHub Explorer
              </Text>
              <Text
                style={[
                  styles.headerSubTitle,
                  { color: isDarkTheme ? dark.text : light.text },
                ]}
              >
                Explore GitHub repositories and more!
              </Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity
              onPress={()=>router.push("/favourites")}
            >
              <FontAwesome6 name="heart-circle-check" size={30} color="#fd5c63" />
              {/* <Ionicons name="heart-outline"  /> */}
            </TouchableOpacity>
            <TouchableOpacity>
              <Ionicons
                name={isDarkTheme ? "moon" : "sunny"}
                size={30}
                color="orange"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.container}>
          <View style={styles.searchContainer}>
            <Ionicons
              name="search"
              size={20}
              color="#6e7781"
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Search repositories"
              placeholderTextColor="#6e7781"
              value={searchText}
              onChangeText={handleSearch}
              inputMode="search"
              onSubmitEditing={handleSearchSubmit}
              returnKeyType="search"
            />
          </View>
        </View>

        {/* Repositories List */}
        <View style={styles.recommendedSection}>
          <Text
            style={[
              styles.recommendedTitle,
              { color: isDarkTheme ? dark.secondaryText : light.secondaryText },
            ]}
          >
            {searchText ? "Search Results" : "Recommended Repositories"}
          </Text>
        </View>

        {loading ? (
          <FlatList
            data={[1, 2, 3, 4]}
            renderItem={({ item }) => <SkeletonLoader key={item} />}
            keyExtractor={(item) => item.toString()}
          />
        ) : (
          <FlatList
            data={repositories}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            ListEmptyComponent={
              <Text style={styles.emptyText}>
                {error || "No repositories found."}
              </Text>
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 8,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "center",
    gap: 8,
  },
  headerIcon: {
    height: width * 0.1,
    width: width * 0.1,
  },
  headerTitle: {
    fontSize: fontScale > 1.24 ? 18 : 20,
  },
  headerSubTitle: {
    fontSize: fontScale > 1.24 ? 10 : 14,
    color: "grey",
    fontWeight: "600",
    fontFamily: "Raleway-bold",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  container: {
    paddingHorizontal: 16,
    marginTop: "4%",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f6f8fa",
    borderRadius: 24,
    paddingHorizontal: 16,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#24292e",
    height: "100%",
  },
  recommendedSection: {
    margin: "2%",
    marginTop:"6%",
  },
  recommendedTitle: {
    paddingLeft: "2%",
    fontSize: fontScale > 1.24 ? 10 : 14,
    fontWeight: "600",
    fontFamily: "Raleway-bold",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#6e7781",
  },
});

export default Index;
