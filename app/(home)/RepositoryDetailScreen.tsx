import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Dimensions,
  Linking,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { format } from "date-fns";
import { useSelector, useDispatch } from "react-redux";
import { selectRepos, toggleFavorite } from "@/src/repoSlice";
import { Stack, useGlobalSearchParams } from "expo-router";
import { dark, light } from "@/constants/Colors";

interface Contributor {
  id: number;
  login: string;
  avatar_url: string;
}

interface Repository {
  id: number;
  name: string;
  full_name: string;
  owner: {
    login: string;
    avatar_url: string;
  };
  description: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
  created_at: string;
  updated_at: string;
  html_url: string;
  isFavorite?: boolean;
}

const { height } = Dimensions.get("window");

const RepositoryDetailScreen = () => {
  const [repository, setRepository] = useState<Repository | null>(null);
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const theme = useTheme();
  const isDarkTheme = theme.dark;
  const dispatch = useDispatch();

  const { data, favourites } = useSelector(selectRepos);
  const params = useGlobalSearchParams();

  useEffect(() => {
    const repo = data.find((item) => item.id.toString() === params.id);
    setRepository(repo);
    if (repo) {
      fetchContributors(repo.full_name);
    }
  }, [params, data]);

  const fetchContributors = async (fullName: string) => {
    try {
      const response = await fetch(
        `https://api.github.com/repos/${fullName}/contributors`
      );
      const data = await response.json();
      setContributors(data);
    } catch (error) {
      console.error("Error fetching contributors:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleFavorite = () => {
    if (repository) {
      dispatch(toggleFavorite(repository.id.toString()));
    }
  };

  const handleOpenRepository = () => {
    if (repository) {
      Linking.openURL(repository.html_url);
    }
  };

  if (!repository) {
    return (
      <ActivityIndicator
        size="large"
        color={isDarkTheme ? dark.text : light.text}
      />
    );
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: true, title: repository.name }} />
      <ScrollView
        style={[styles.container, isDarkTheme && styles.containerDark]}
      >
        <View style={styles.header}>
          <Image
            source={{ uri: repository.owner.avatar_url }}
            style={styles.ownerAvatar}
          />
          <View style={styles.headerText}>
            <Text
              style={[styles.repositoryName, isDarkTheme && styles.textDark]}
            >
              {repository.name}
            </Text>
            <Text
              style={[
                styles.ownerName,
                isDarkTheme && styles.textSecondaryDark,
              ]}
            >
              @{repository.owner.login}
            </Text>
          </View>
          <TouchableOpacity
            onPress={handleToggleFavorite}
            style={styles.favoriteButton}
          >
            <Ionicons
              name={
                favourites.includes(repository.id.toString())
                  ? "heart"
                  : "heart-outline"
              }
              size={24}
              color={
                favourites.includes(repository.id.toString()) ? "red" : "grey"
              }
            />
          </TouchableOpacity>
        </View>

        <Text style={[styles.description, isDarkTheme && styles.textDark]}>
          {repository.description}
        </Text>

        <View style={styles.statsContainer}>
          <View style={styles.stat}>
            <Ionicons
              name="star"
              size={16}
              color={isDarkTheme ? dark.text : light.text}
            />
            <Text style={[styles.statText, isDarkTheme && styles.textDark]}>
              {repository.stargazers_count}
            </Text>
          </View>
          <View style={styles.stat}>
            <Ionicons
              name="git-network"
              size={16}
              color={isDarkTheme ? dark.text : light.text}
            />
            <Text style={[styles.statText, isDarkTheme && styles.textDark]}>
              {repository.forks_count}
            </Text>
          </View>
          <View style={styles.stat}>
            <View
              style={[styles.languageDot, { backgroundColor: repository.language.length % 2 == 0 ? "#2b7489" : "orange" }]}
            />
            <Text style={[styles.statText, isDarkTheme && styles.textDark]}>
              {repository.language}
            </Text>
          </View>
        </View>

        <View style={styles.dateContainer}>
          <Text
            style={[styles.dateText, isDarkTheme && styles.textSecondaryDark]}
          >
            Created: {format(new Date(repository.created_at), "PPP")}
          </Text>
          <Text
            style={[styles.dateText, isDarkTheme && styles.textSecondaryDark]}
          >
            Last updated: {format(new Date(repository.updated_at), "PPP")}
          </Text>
        </View>

        <View style={styles.contributorsSection}>
          <Text style={[styles.sectionTitle, isDarkTheme && styles.textDark]}>
            Contributors
          </Text>
          {isLoading ? (
            <ActivityIndicator
              size="small"
              color={isDarkTheme ? dark.text : light.text}
            />
          ) : (
            <FlatList
              data={contributors}
              renderItem={({ item }) => (
                <View style={styles.contributorItem}>
                  <Image
                    source={{ uri: item.avatar_url }}
                    style={styles.contributorAvatar}
                  />
                  <Text
                    style={[
                      styles.contributorName,
                      isDarkTheme && styles.textSecondaryDark,
                    ]}
                  >
                    {item.login}
                  </Text>
                </View>
              )}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
            />
          )}
        </View>
      </ScrollView>
      <TouchableOpacity
        activeOpacity={0.7}
        style={[
          styles.openRepoButton,
          {
            backgroundColor: !isDarkTheme ? dark.background : light.background,
          },
        ]}
        onPress={handleOpenRepository}
      >
        <Text
          style={[
            styles.openRepoButtonText,
            { color: !isDarkTheme ? dark.text : light.text },
          ]}
        >
          Open Repository
        </Text>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: light.background,
  },
  containerDark: {
    backgroundColor: dark.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  ownerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  headerText: {
    flex: 1,
    marginLeft: 16,
  },
  repositoryName: {
    fontSize: 24,
    fontWeight: "bold",
    color: light.text,
  },
  ownerName: {
    fontSize: 16,
    color: light.secondaryText,
  },
  favoriteButton: {
    padding: 8,
  },
  description: {
    fontSize: 16,
    marginBottom: 16,
    color: light.text,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  stat: {
    flexDirection: "row",
    alignItems: "center",
  },
  statText: {
    fontSize: 16,
    marginLeft: 4,
    color: light.text,
  },
  dateContainer: {
    marginBottom: 16,
  },
  dateText: {
    fontSize: 14,
    marginBottom: 4,
    color: light.secondaryText,
  },
  contributorsSection: {
    marginVertical: 36,
    marginBottom: height * 0.2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
    color: light.text,
  },
  contributorItem: {
    alignItems: "center",
    marginRight: 16,
  },
  contributorAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 4,
  },
  contributorName: {
    fontSize: 12,
    textAlign: "center",
    color: light.secondaryText,
  },
  openRepoButton: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  openRepoButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  textDark: {
    color: dark.text,
  },
  textSecondaryDark: {
    color: dark.secondaryText,
  },
  languageDot: {
    width: 10,
    height: 10,
    borderRadius: 12,
    marginRight: 3,
  },
});

export default RepositoryDetailScreen;
