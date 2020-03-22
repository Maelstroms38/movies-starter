import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { ApolloLink, Observable } from 'apollo-link';
import { split } from 'apollo-link';
import { AsyncStorage } from 'react-native';

const BASE_URL = 'http://localhost:4000/graphql';

// Apollo Client will determine whether to send auth token

const httpLink = new HttpLink({
  uri: BASE_URL,
  credentials: 'include'
});

const request = async operation => {
  const token = await AsyncStorage.getItem('token');
  operation.setContext({
    headers: {
      authorization: token ? `Bearer ${token}` : ''
    }
  });
};

// add observer to each request,
// forward operations with existing context
// applies middleware, credentials (express)
const requestLink = new ApolloLink(
  (operation, forward) =>
    new Observable(observer => {
      let handle;
      Promise.resolve(operation)
        .then(oper => request(oper))
        .then(() => {
          handle = forward(operation).subscribe({
            next: observer.next.bind(observer),
            error: observer.error.bind(observer),
            complete: observer.complete.bind(observer)
          });
        })
        .catch(observer.error.bind(observer));
      return () => {
        if (handle) handle.unsubscribe();
      };
    })
);

// ApolloLink allows multiple links
const client = new ApolloClient({
  link: ApolloLink.from([requestLink, httpLink]),
  cache: new InMemoryCache()
});

export default client;
