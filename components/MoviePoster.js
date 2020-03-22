import React from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

const { width, height } = Dimensions.get('window');

const cols = 2,
  rows = 2;

export default function MoviePoster(props) {
  const {
    movie,
    movie: { title, category, imageUrl },
    onPress
  } = props;
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress && onPress()}
    >
      <View style={styles.imageContainer}>
        <Image style={styles.image} source={{ uri: imageUrl }} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.genre}>{category.title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginLeft: 10,
    marginBottom: 10,
    height: (height - 20 - 20) / rows - 10,
    width: (width - 10) / cols - 10
  },
  imageContainer: {
    flex: 1
  },
  image: {
    borderRadius: 10,
    ...StyleSheet.absoluteFillObject
  },
  title: {
    fontSize: 14,
    marginTop: 4
  },
  genre: {
    color: '#BBBBBB',
    fontSize: 12,
    lineHeight: 14
  }
});
