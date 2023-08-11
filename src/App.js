import EventWidget from './components/EventWidget';
import { ApolloProvider, ApolloClient, InMemoryCache, ApolloClientOptions } from '@apollo/client';

let gqlClient = new ApolloClient({
  uri: 'https://api.partake.gg',
  cache: new InMemoryCache()
});

let urlParams = new URLSearchParams(window.location.search);

function App() {
  return (
    <ApolloProvider client={ gqlClient }>
      <EventWidget teamId={ urlParams.get("teamId") } />
    </ApolloProvider>
  );
}

export default App;
