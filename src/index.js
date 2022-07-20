import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ApolloClient, ApolloProvider, InMemoryCache, createHttpLink, split } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { WebSocketLink }  from "@apollo/client/link/ws"
import { getMainDefinition } from '@apollo/client/utilities';


const httpLink = createHttpLink({
  uri: 'https://graphqlchatcha.herokuapp.com/graphql',
})

const wsLink = () => {
  const token = window.localStorage.getItem('token')
  return new WebSocketLink({
    uri: `wss://graphqlchatcha.herokuapp.com/graphql`,
    options: {
      reconnect: true,
      timeout: 120000,
      connectionParams : {
        Authorization: `Bearer ${token}`,
        authToken: token
      }
    }
  })
}

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('token');

  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? token : "",
    }
  }
});





const splitLink = split(
  ({query}) => {
    const definition =  getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' && definition.operation === 'subscription'
    );
  },
  wsLink(),
  authLink.concat(httpLink)
)

const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache()
})


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ApolloProvider client={client}>
          <App />
        </ApolloProvider>
      </BrowserRouter>
  </React.StrictMode>
);
