import React from "react";
import {
  Dimensions,
  FlatList,
  ListRenderItemInfo,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import { dark, light } from "@/constants/Colors";
import RepositoryCard from "@/components/RepoCard";
import SkeletonLoader from "@/components/SkeletonLoader";
import {  useSelector } from "react-redux";
import {
  Repository,
  selectRepos,
} from "@/src/repoSlice";
import { Stack } from "expo-router";

const {  width, fontScale } = Dimensions.get("window");

export const favourites = () => {
  const theme = useTheme();
  const isDarkTheme = theme.dark;

  const { data, favourites, searched } = useSelector(selectRepos);

  const mergedArray = data.concat(searched);

  const favouriteSet = new Set(favourites.map(String)); // Converting it into set
  const favouriteRepos = mergedArray.filter(({ id }) =>
    favouriteSet.has(String(id))
  );

  //   console.log(favouriteRepos);

  const renderItem = ({ item }: ListRenderItemInfo<Repository>) => (
    <RepositoryCard
      repository={item}
      isFavorite={favourites.includes(item.id.toString())}
    />
  );

  return (
    <>
      <Stack.Screen
        options={{ headerShown: true, headerTitle: "Favourite Repositories" }}
      />
      <View
        style={{
          flex: 1,
          width: width,
          backgroundColor: isDarkTheme ? dark.background : light.background,
        }}
      >
        {favouriteRepos?.length < 0 ? (
          <FlatList
            data={[1, 2, 3, 4]}
            renderItem={({ item }) => <SkeletonLoader key={item} />}
            keyExtractor={(item) => item.toString()}
          />
        ) : (
          <FlatList
            data={favouriteRepos}
            renderItem={renderItem}
            keyExtractor={(item) => item?.id.toString()}
            ListEmptyComponent={
              <Text
                style={{
                  textAlign: "center",
                  marginTop: 20,
                  fontSize: 16,
                  color: "#6e7781",
                }}
              >
                No repositories marked as favourite.
              </Text>
            }
          />
        )}
      </View>
    </>
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

export default favourites;
