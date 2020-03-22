import React, { useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  AsyncStorage,
  ActivityIndicator
} from 'react-native';
import MoviePoster from '../components/MoviePoster';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import Profile from '../components/Profile';

// Current User Query
const PROFILE_QUERY = gql`
  query {
    currentUser {
      id
      username
      email
      votes {
        id
        movie {
          id
          title
          imageUrl
          description
          category {
            id
            title
          }
        }
      }
    }
  }
`;

export default function ProfileScreen({ route, navigation }) {
  const { data, loading, error } = useQuery(PROFILE_QUERY, {
    fetchPolicy: 'network-only'
  });
  if (!data || !data.currentUser) {
    return <ActivityIndicator style={{ ...StyleSheet.absoluteFillObject }} />;
  }
  const { currentUser } = data;
  const { username, email, votes } = currentUser;
  return (
    <View style={styles.container}>
      <Profile currentUser={currentUser} />
      {votes && votes.length ? (
        <FlatList
          data={votes}
          keyExtractor={(item, index) => index.toString()}
          numColumns={2}
          renderItem={({ item: { movie }, index }) => (
            <MoviePoster
              movie={movie}
              onPress={() => navigation.navigate('Detail', { movie: movie })}
            />
          )}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff'
  },
  saveIcon: {
    position: 'relative',
    right: 20,
    zIndex: 8
  }
});
