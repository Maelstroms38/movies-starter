import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  View,
  ScrollView,
  Dimensions
} from 'react-native';
import RoundedButton from '../components/RoundedButton';
import { Ionicons } from '@expo/vector-icons';
import { useQuery, useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';

// Queries
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

// Vote Mutations
const ADD_VOTE = gql`
  mutation AddVote($movieId: ID!) {
    addVote(movieId: $movieId)
  }
`;

const REMOVE_VOTE = gql`
  mutation RemoveVote($movieId: ID!) {
    removeVote(movieId: $movieId)
  }
`;

const { width } = Dimensions.get('window');

export default function MovieDetail({ route, navigation }) {
  const { data, refetch } = useQuery(PROFILE_QUERY);
  const [addVote] = useMutation(ADD_VOTE);
  const [removeVote] = useMutation(REMOVE_VOTE);
  const { params } = route;
  const { movie } = params;
  const { id, title, description, imageUrl, category } = movie;
  const isFavorite =
    data &&
    data.currentUser &&
    data.currentUser.votes &&
    data.currentUser.votes.find(vote => vote.movie.id == id);
  const primaryColor = isFavorite ? 'rgba(75, 148, 214, 1)' : '#fff';
  const secondaryColor = isFavorite ? '#fff' : 'rgba(75, 148, 214, 1)';
  const saveString = isFavorite ? 'Remove Vote' : 'Add Vote';

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image style={styles.image} source={{ uri: imageUrl }} />
        <Text numberOfLines={2} styles={[styles.text, { textAlign: 'center' }]}>
          {title}
        </Text>
        <RoundedButton
          text={saveString}
          textColor={primaryColor}
          backgroundColor={secondaryColor}
          onPress={() => {
            if (isFavorite) {
              removeVote({ variables: { movieId: id } })
                .then(() => refetch())
                .catch(err => console.log(err));
            } else {
              addVote({ variables: { movieId: id } })
                .then(() => refetch())
                .catch(err => console.log(err));
            }
          }}
          icon={
            <Ionicons
              name="md-checkmark-circle"
              size={20}
              color={primaryColor}
              style={styles.saveIcon}
            />
          }
        />
        <View style={styles.statRow}>
          <Text style={styles.stat}>Category</Text>
          <Text style={styles.state}>{category.title}</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.stat}>{description}</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10
  },
  text: {
    fontSize: 32,
    color: '#161616',
    paddingBottom: 15
  },
  image: {
    width: width,
    height: width,
    resizeMode: 'center'
  },
  statRow: {
    width: '100%',
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  stat: {
    color: '#161616',
    fontSize: 16,
    fontWeight: '500'
  },
  saveIcon: {
    position: 'relative',
    left: 20,
    zIndex: 8
  },
  contentContainer: {
    paddingTop: 10
  }
});
