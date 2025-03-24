import "./App.css";
// Import ApolloClient Libraries
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";

const httpLink = createHttpLink({
  uri: "graphql", // This is the URL to the GraphQL server
});

const authLink = setContext((_, { headers }) => {
  // Get the authentication token from local storage if it exists
  const token = localStorage.getItem("id_token");

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

// Create the Apollo Client
const client = new ApolloClient({
  // combine the authLink and httpLink
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

// Define the App component
function App() {
  return (
    <ApolloProvider client={client}>
      <Navbar />
      <Outlet />
    </ApolloProvider>
  );
}

export default App;
