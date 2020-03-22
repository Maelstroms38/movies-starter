import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  AsyncStorage,
  Alert,
  TextInput
} from 'react-native';
import { useMutation } from '@apollo/react-hooks';
import RoundedButton from '../components/RoundedButton';
import { Ionicons } from '@expo/vector-icons';
import gql from 'graphql-tag';

const { width } = Dimensions.get('window');

// Mutations
const SIGN_UP_MUTATION = gql`
  mutation SignUp($username: String!, $email: String!, $password: String!) {
    signUp(username: $username, email: $email, password: $password) {
      token
      user {
        id
        username
        email
      }
    }
  }
`;

const SIGN_IN_MUTATION = gql`
  mutation SignIn($username: String, $email: String, $password: String!) {
    signIn(username: $username, email: $email, password: $password) {
      token
      user {
        id
        username
        email
      }
    }
  }
`;

export default function LoginScreen({ navigation, route }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [login, setLogin] = useState(false);

  // Signing In
  const [signIn] = useMutation(SIGN_IN_MUTATION, {
    async onCompleted({ signIn }) {
      const { token } = signIn;
      try {
        await AsyncStorage.setItem('token', token);
        navigation.replace('Profile');
      } catch (err) {
        console.log(err.message);
      }
    }
  });

  // Signing Up
  const [signUp] = useMutation(SIGN_UP_MUTATION, {
    async onCompleted({ signUp }) {
      const { token } = signUp;
      try {
        await AsyncStorage.setItem('token', token);
        navigation.replace('Profile');
      } catch (err) {
        console.log(err.message);
      }
    }
  });

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        {login ? null : (
          <View>
            <Text>Username</Text>
            <TextInput
              onChangeText={text => setUsername(text)}
              value={username}
              placeholder="Username"
              autoCorrect={false}
              autoCapitalize="none"
              style={styles.input}
            />
          </View>
        )}
        <View>
          <Text>{login ? 'Email or Username' : 'Email'}</Text>
          <TextInput
            onChangeText={text => setEmail(text)}
            value={email}
            placeholder={login ? 'Email or Username' : 'Email'}
            autoCorrect={false}
            autoCapitalize="none"
            style={styles.input}
          />
        </View>
        <View>
          <Text>Password</Text>
          <TextInput
            onChangeText={text => setPassword(text)}
            value={password}
            placeholder="Password"
            autoCorrect={false}
            autoCapitalize="none"
            style={styles.input}
            secureTextEntry
          />
        </View>
      </View>
      <RoundedButton
        text={login ? 'Login' : 'Sign Up'}
        textColor="#fff"
        backgroundColor="rgba(75, 148, 214, 1)"
        icon={
          <Ionicons
            name="md-checkmark-circle"
            size={20}
            color={'#fff'}
            style={styles.saveIcon}
          />
        }
        onPress={() => {
          // email validation (is valid email?)
          if (login) {
            const isEmail = email.includes('@');
            const res = isEmail
              ? signIn({ variables: { email, password } })
              : signIn({ variables: { username: email, password } });
          } else {
            signUp({ variables: { username, email, password } });
          }
        }}
      />
      <RoundedButton
        text={login ? 'Need an account? Sign up' : 'Have an account? Log in'}
        textColor="rgba(75, 148, 214, 1)"
        backgroundColor="#fff"
        onPress={() => setLogin(!login)}
        icon={
          <Ionicons
            name="md-information-circle"
            size={20}
            color="rgba(75, 148, 214, 1)"
            style={styles.saveIcon}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 15
  },
  saveIcon: {
    position: 'relative',
    left: 20,
    zIndex: 8
  },
  inputContainer: {
    flex: 0.4,
    justifyContent: 'space-around'
  },
  input: {
    width: width - 40,
    height: 40,
    borderBottomColor: '#FFF',
    borderBottomWidth: 1
  }
});
