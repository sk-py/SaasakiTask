import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useDispatch } from "react-redux";
import { toggleFavorite } from "@/src/repoSlice";

export default function RepositoryCard({
  repository,
  //   onToggleFavorite,
  isFavorite,
}: any) {
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  const repo = repository;

  const dispatch = useDispatch()

  const onToggleFavorite = () => {
    dispatch(toggleFavorite(repository.id.toString()))
  };

  const handleRepositoryPress = () => {
    router.navigate({
      pathname: "/RepositoryDetailScreen",
      params: { id: repo.id },
    });
  };

  return (
    <TouchableOpacity activeOpacity={0.7} onPress={handleRepositoryPress} style={styles.card}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Image
            source={{ uri: repo.owner.avatar_url }}
            style={styles.avatar}
          />
          <Text style={styles.username}>@{repo.owner.login}</Text>
        </View>
        <TouchableOpacity onPress={onToggleFavorite}>
          <Ionicons
            name={isFavorite ? "heart" : "heart-outline"}
            size={24}
            color={isFavorite ? "#FF3B30" : "#6e7781"}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.repoName}>{repo.name}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {repo.description}
        </Text>
      </View>

      <View style={styles.footer}>
        <View style={styles.stat}>
          <Ionicons name="star" size={16} color="#6e7781" />
          <Text style={styles.statText}>
            {formatNumber(repo.stargazers_count)}
          </Text>
        </View>
        <View style={styles.stat}>
          <Ionicons name="git-branch" size={16} color="#6e7781" />
          <Text style={styles.statText}>{formatNumber(repo.forks_count)}</Text>
        </View>
        <View style={styles.languageContainer}>
          <View style={[styles.languageDot, { backgroundColor: "#2b7489" }]} />
          <Text style={styles.language}>{repo.language}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  username: {
    marginLeft: 8,
    fontSize: 14,
    color: "#6e7781",
  },
  content: {
    marginBottom: 12,
  },
  repoName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#24292f",
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: "#57606a",
    lineHeight: 20,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
  },
  stat: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  statText: {
    marginLeft: 4,
    fontSize: 14,
    color: "#6e7781",
  },
  languageContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  languageDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  language: {
    fontSize: 14,
    color: "#6e7781",
  },
});
