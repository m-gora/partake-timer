import EventWidget from './components/EventWidget';
import { ApolloProvider, ApolloClient, InMemoryCache, ApolloClientOptions } from '@apollo/client';

let gqlClient = new ApolloClient({
  uri: 'https://api.partake.gg',
  cache: new InMemoryCache()
});

function App() {
  return (
    <ApolloProvider client={ gqlClient }>
      <EventWidget />
    </ApolloProvider>
  );
}

export default App;
