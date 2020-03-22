import React, { useState } from 'react';
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
  View,
  ActivityIndicator
} from 'react-native';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import MoviePoster from '../components/MoviePoster';
import Tag from '../components/Tag';

const FEED_QUERY = gql`
  query Feed($categoryId: ID) {
    feed(categoryId: $categoryId) {
      id
      title
      description
      imageUrl
      category {
        title
      }
    }
  }
`;

const CATEGORY_QUERY = gql`
  query {
    categories {
      id
      title
    }
  }
`;

export default function HomeScreen(props) {
  const [categoryId, setCategoryId] = useState(0);
  const { data, refetch, error, loading } = useQuery(FEED_QUERY, {
    variables: categoryId ? { categoryId } : {},
    fetchPolicy: 'cache-and-network'
  });
  const { data: genres } = useQuery(CATEGORY_QUERY);
  const { navigation } = props;
  if (loading || !data || !data.feed) {
    console.log(error);
    return <ActivityIndicator style={{ ...StyleSheet.absoluteFillObject }} />;
  }
  return (
    <View style={styles.container}>
      {genres ? (
        <FlatList
          data={genres.categories}
          horizontal
          keyExtractor={(item, index) => index.toString()}
          extraData={categoryId}
          style={styles.bottomBorder}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item, index }) => {
            const selected = categoryId == item.id;
            return (
              <Tag key={index} selected={selected} title={item.title}
                  onPress={() => {
                    if (selected) {
                      setCategoryId(0);
                      refetch();
                    } else {
                      setCategoryId(parseInt(item.id))
                      refetch()
                    }
                  }} />
            );
          }}
        />
      ) : null}
      <FlatList
        data={data.feed}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2}
        contentContainerStyle={styles.scrollContent}
        renderItem={({ item, index }) => (
          <MoviePoster
            movie={item}
            onPress={() => navigation.navigate('Detail', { movie: item })}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  scrollContent: {
    paddingTop: 10
  }
});
