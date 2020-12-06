import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
  concat,
} from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {USER_AUTH_TOKEN} from '../src/consts/asyncStorage';

const httpLink = new HttpLink({
  uri: 'http://192.168.1.32:4000/graphql',
});

//preparamos el token
const authMiddleware = new ApolloLink(async (operation, forward) => {
  //read token
  const token = await AsyncStorage.getItem(USER_AUTH_TOKEN);
  operation.setContext(({headers = {}}) => ({
    headers: {
      ...headers,
      authorization: token ? `${token}` : '',
    },
  }));
  return forward(operation);
});

const client = new ApolloClient({
  cache: new InMemoryCache(),
  uri: 'http://192.168.1.32:4000/graphql',
  link: concat(authMiddleware, httpLink),
});

export default client;
