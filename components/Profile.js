import React, { useState } from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

export default function Profile(props) {
  const { currentUser } = props;
  const { username, email, votes } = currentUser;

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.text}>{username}</Text>
        <View style={styles.right}>
          <Text style={styles.text}>{votes.length} Vote(s)</Text>
        </View>
      </View>

      <View style={styles.row}>
        <Text style={[styles.text, styles.name]}>{email}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    height: 60
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  right: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'flex-end'
  },
  text: {
    color: '#161616',
    fontSize: 15
  },
  name: {
    color: 'rgba(0,0,0,0.5)',
    fontSize: 12,
    fontWeight: '300'
  }
});
