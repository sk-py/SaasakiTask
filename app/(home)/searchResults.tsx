import React, { useCallback, useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  ListRenderItemInfo,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import { dark, light } from "@/constants/Colors";
import RepositoryCard from "@/components/RepoCard";
import SkeletonLoader from "@/components/SkeletonLoader";
import { useSelector, useDispatch } from "react-redux";
import { Repository, selectRepos, searchRepos } from "@/src/repoSlice";
import { Stack, useLocalSearchParams } from "expo-router";

const { width } = Dimensions.get("window");

export const searchResults = () => {
  const theme = useTheme();
  const isDarkTheme = theme.dark;
  const dispatch = useDispatch();

  const { searched, favourites, loading, error, currentPage } =
    useSelector(selectRepos);
  const params = useLocalSearchParams();

  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    setRefreshKey((prevKey) => prevKey + 1);
  }, [searched]);

  console.log(searched.length);

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<Repository>) => (
      <RepositoryCard
        repository={item}
        isFavorite={favourites.includes(item.id.toString())}
      />
    ),
    [favourites]
  );

  const loadMore = () => {
    if (!loading) {
      dispatch(
        searchRepos({ query: params.query as string, page: currentPage }) as any
      );
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: `Results for "${params.query}"`,
        }}
      />
      <View
        style={{
          flex: 1,
          width: width,
          backgroundColor: isDarkTheme ? dark.background : light.background,
        }}
      >
        <FlatList
          data={searched}
          renderItem={renderItem}
          keyExtractor={(item) => item?.id.toString()}
          extraData={refreshKey}
          ListEmptyComponent={
            <>
              {!loading && (
                <Text
                  style={{
                    textAlign: "center",
                    marginTop: 20,
                    fontSize: 16,
                    color: "#6e7781",
                  }}
                >
                  {error || `No repositories found for ${params?.query}`}
                </Text>
              )}
            </>
          }
          ListFooterComponent={
            <>
              {loading ? (
                <>
                  <SkeletonLoader />
                  <SkeletonLoader />
                  <SkeletonLoader />
                </>
              ) : (
                searched?.length > 0 && (
                  <TouchableOpacity onPress={loadMore}>
                    <Text
                      style={{
                        textAlign: "center",
                        marginVertical: 20,
                        fontSize: 16,
                        fontWeight: "700",
                        color: "#0D92F4",
                      }}
                    >
                      Load more
                    </Text>
                  </TouchableOpacity>
                )
              )}
            </>
          }
        />
      </View>
    </>
  );
};

export default searchResults;
