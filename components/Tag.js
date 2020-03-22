import React from 'react';
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';

export default function Tag(props) {
  const { title, onPress, selected } = props;
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.tag,
          { backgroundColor: selected ? 'rgba(75,148,214,1)' : '#fff' }
        ]}
        onPress={() => onPress && onPress()}
      >
        <Text style={[styles.title, { color: selected ? '#fff' : '#161616' }]}>
          {title}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 6,
    height: 30
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: 'gray',
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 10,
    paddingVertical: 3
  },
  title: {
    color: '#161616',
    fontSize: 18,
    fontWeight: 'normal'
  }
});
