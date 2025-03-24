import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { typeDefs, resolvers } from './schemas/index.js';
import { authenticateToken } from './services/auth.js';
import express from 'express';
import type { Request, Response } from 'express';
import path from 'node:path';
import db from './config/connection.js';
import { fileURLToPath } from 'node:url';

// Create an ApolloServer instance
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Start the server
const startApolloServer = async () => {
  await server.start();
  await db();

  // Create an express application and use the ApolloServer middleware
  const PORT = process.env.PORT || 3001;
  const app = express();

  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  app.use('/graphql', expressMiddleware(server as any, 
    {
      context: authenticateToken as any,
    }
  ));

  // Check if the environment is production
  if (process.env.NODE_ENV === 'production') {
    // Workaround for __dirname
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    // Serve the static files from the React app
    app.use(express.static(path.join(__dirname, '../../client/dist')));

    // Handle GET requests to /api route
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
    });
  }

  // Start the server
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
    console.log(`🚀 Use GraphQL at http://localhost:${PORT}/graphql`);
  });
};

startApolloServer();