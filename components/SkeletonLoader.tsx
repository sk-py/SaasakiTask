import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

const AnimatedView = Animated.createAnimatedComponent(View);

export default function SkeletonLoader() {
  const shimmerAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const shimmer = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnimation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(shimmerAnimation, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: false,
        }),
      ])
    );
    shimmer.start();

    return () => shimmer.stop();
  }, []);

  const shimmerTranslate = shimmerAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [-200, 200],
  });

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <View style={styles.avatar} />
          <View style={styles.username} />
        </View>
        <View style={styles.favoriteButton} />
      </View>

      <View style={styles.content}>
        <View style={styles.repoName} />
        <View style={styles.description} />
        <View style={styles.description} />
      </View>

      <View style={styles.footer}>
        <View style={styles.stat} />
        <View style={styles.stat} />
        <View style={styles.language} />
      </View>

      <AnimatedView
        style={[
          styles.shimmer,
          {
            transform: [{ translateX: shimmerTranslate }],
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e0e0e0',
  },
  username: {
    marginLeft: 8,
    width: 100,
    height: 14,
    backgroundColor: '#e0e0e0',
    borderRadius: 7,
  },
  favoriteButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#e0e0e0',
  },
  content: {
    marginBottom: 12,
  },
  repoName: {
    width: '70%',
    height: 18,
    backgroundColor: '#e0e0e0',
    borderRadius: 9,
    marginBottom: 8,
  },
  description: {
    width: '100%',
    height: 14,
    backgroundColor: '#e0e0e0',
    borderRadius: 7,
    marginBottom: 4,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stat: {
    width: 60,
    height: 14,
    backgroundColor: '#e0e0e0',
    borderRadius: 7,
    marginRight: 16,
  },
  language: {
    width: 80,
    height: 14,
    backgroundColor: '#e0e0e0',
    borderRadius: 7,
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
});
