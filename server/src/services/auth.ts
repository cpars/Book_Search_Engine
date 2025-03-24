import { GraphQLError } from 'graphql';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Function to authenticate JWT and return user or null
export const authenticateToken = ({ req }: any) => {
  let token = req.body.token || req.query.token || req.headers.authorization;

  // Remove 'Bearer' from token string
  if (req.headers.authorization) {
    token = token.split(' ').pop().trim();
  }

  // If no token, return request object
  if (!token) {
    return req;
  }

  // Verify token and attach user data to request object
  try {
    const { data }: any = jwt.verify(token, process.env.JWT_SECRET_KEY || '' );
    req.user = data;
  } catch (err) {
    console.log(err);
  }

  return req;
};

// Function to sign JWT
export const signToken = (username: string, email: string, _id: unknown) => {
  const payload = { username, email, _id };
  const secretKey: any = process.env.JWT_SECRET_KEY;

  return jwt.sign({ data: payload }, secretKey, { expiresIn: '2h' });
};

// Custom error class for authentication errors
export class AuthenticationError extends GraphQLError {
  constructor(message: string) {
    super(message, undefined, undefined, undefined, ['Unauthenticated']);
    Object.defineProperty(this, 'name', { value: 'AuthenticationError' });
  }
}