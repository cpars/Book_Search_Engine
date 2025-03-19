import { GraphQLError } from 'graphql';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

interface JwtPayload {
  _id: string;
  username: string;
  email: string;
}

// Function to authenticate JWT and return user or null
export const authenticateToken = (req: { headers: { authorization?: string | undefined } }) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return null; // No token provided, return null (allows public queries)
  }

  const tokenParts = authHeader.split(' ');

  // Ensure token is properly formatted as "Bearer <token>"
  if (tokenParts.length !== 2) {
    throw new GraphQLError('Invalid authorization header format', {
      extensions: { code: 'UNAUTHENTICATED' },
    });
  }

  const token = tokenParts[1]; // Extract the actual token
  const secretKey = process.env.JWT_SECRET_KEY || '';

  try {
    const user = jwt.verify(token, secretKey) as JwtPayload;
    return user; // Return decoded user object
  } catch (err) {
    throw new GraphQLError('Invalid or expired token', {
      extensions: { code: 'UNAUTHENTICATED' },
    });
  }
};
