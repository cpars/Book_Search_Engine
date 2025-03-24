import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { typeDefs, resolvers } from './schemas/index.js';
import { authenticateToken } from './services/auth.js';
import express, { Request } from 'express';
import path from 'node:path';
import db from './config/connection.js';
import { fileURLToPath } from 'node:url';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Initialize Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

async function startServer() {
  try {
    await server.start();

    app.use(
      '/graphql',
      expressMiddleware(server, {
        context: async ({ req }: { req: Request }) => {
          try {
            const user = authenticateToken(req); // Get authenticated user
            return { user }; // Attach user to context
          } catch (error) {
            console.error('Error in authentication:', error);
            return { user: null }; // Allow requests to proceed even if user is not authenticated
          }
        },
      })
    );

    // Serve static assets in production
    if (process.env.NODE_ENV === 'production') {
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = path.dirname(__filename);

      app.use(express.static(path.join(__dirname, '../client/dist')));

      app.get('*', (_req, res) => {
        res.sendFile(path.join(__dirname, '../client/dist/index.html'));
      });
    }

    // Handle MongoDB connection errors
    db.on('error', (err) => {
      console.error('MongoDB connection error:', err);
      process.exit(1); // Exit process if DB fails to connect
    });

    db.once('open', () => {
      console.log('Connected to MongoDB');

      app.listen(PORT, () => {
        console.log(`API server running on port ${PORT}!`);
        console.log(`🚀 Use GraphQL at http://localhost:${PORT}/graphql`);
      });
    });
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1); // Exit if the server fails to start
  }
}

startServer();
