import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';

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
}

const RepositoryDetailScreen = ({ route }) => {
  const { repository } = route.params;
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const theme = useTheme();
  const isDarkTheme = theme.dark;

  useEffect(() => {
    fetchContributors();
  }, []);

  const fetchContributors = async () => {
    try {
      const response = await fetch(
        `https://api.github.com/repos/${repository.full_name}/contributors`
      );
      const data = await response.json();
      setContributors(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching contributors:', error);
      setIsLoading(false);
    }
  };

  const renderContributor = ({ item }: { item: Contributor }) => (
    <View style={styles.contributorItem}>
      <Image source={{ uri: item.avatar_url }} style={styles.contributorAvatar} />
      <Text style={[styles.contributorName, { color: isDarkTheme ? '#ffffff' : '#000000' }]}>
        {item.login}
      </Text>
    </View>
  );

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: isDarkTheme ? '#1c1c1c' : '#ffffff' },
      ]}
    >
      <View style={styles.header}>
        <Image
          source={{ uri: repository.owner.avatar_url }}
          style={styles.ownerAvatar}
        />
        <View style={styles.headerText}>
          <Text style={[styles.repositoryName, { color: isDarkTheme ? '#ffffff' : '#000000' }]}>
            {repository.name}
          </Text>
          <Text style={[styles.ownerName, { color: isDarkTheme ? '#cccccc' : '#666666' }]}>
            by {repository.owner.login}
          </Text>
        </View>
      </View>

      <Text style={[styles.description, { color: isDarkTheme ? '#ffffff' : '#000000' }]}>
        {repository.description}
      </Text>

      <View style={styles.statsContainer}>
        <View style={styles.stat}>
          <Ionicons name="star" size={20} color={isDarkTheme ? '#ffffff' : '#000000'} />
          <Text style={[styles.statText, { color: isDarkTheme ? '#ffffff' : '#000000' }]}>
            {repository.stargazers_count}
          </Text>
        </View>
        <View style={styles.stat}>
          <Ionicons name="git-branch" size={20} color={isDarkTheme ? '#ffffff' : '#000000'} />
          <Text style={[styles.statText, { color: isDarkTheme ? '#ffffff' : '#000000' }]}>
            {repository.forks_count}
          </Text>
        </View>
        <View style={styles.stat}>
          <Ionicons name="code-slash" size={20} color={isDarkTheme ? '#ffffff' : '#000000'} />
          <Text style={[styles.statText, { color: isDarkTheme ? '#ffffff' : '#000000' }]}>
            {repository.language}
          </Text>
        </View>
      </View>

      <View style={styles.dateContainer}>
        <Text style={[styles.dateText, { color: isDarkTheme ? '#cccccc' : '#666666' }]}>
          Created: {format(new Date(repository.created_at), 'MMM d, yyyy')}
        </Text>
        <Text style={[styles.dateText, { color: isDarkTheme ? '#cccccc' : '#666666' }]}>
          Last updated: {format(new Date(repository.updated_at), 'MMM d, yyyy')}
        </Text>
      </View>

      <View style={styles.contributorsSection}>
        <Text style={[styles.sectionTitle, { color: isDarkTheme ? '#ffffff' : '#000000' }]}>
          Contributors
        </Text>
        {isLoading ? (
          <ActivityIndicator size="large" color="#0366d6" />
        ) : (
          <FlatList
            data={contributors}
            renderItem={renderContributor}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  ownerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  headerText: {
    marginLeft: 16,
  },
  repositoryName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  ownerName: {
    fontSize: 16,
  },
  description: {
    fontSize: 16,
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 16,
    marginLeft: 4,
  },
  dateContainer: {
    marginBottom: 16,
  },
  dateText: {
    fontSize: 14,
    marginBottom: 4,
  },
  contributorsSection: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  contributorItem: {
    alignItems: 'center',
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
    textAlign: 'center',
  },
});

export default RepositoryDetailScreen;

