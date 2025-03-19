import { GraphQLError } from 'graphql';
import jwt from 'jsonwebtoken';

import dotenv from 'dotenv';
dotenv.config();

interface JwtPayload {
  _id: string;
  username: string;
  email: string,
}

export const authenticateToken = (context: { req: { headers: { authorization?: string }}}) => {
  const authHeader = context.req.headers.authorization;

  if (!authHeader) {
    throw new GraphQLError('Not authenticated');
  }

    const token = authHeader.split(' ')[1];
    const secretKey = process.env.JWT_SECRET_KEY || '';

    try {
      const user = jwt.verify(token, secretKey) as JwtPayload;
      return user;
    }
    catch (err) {
      throw new GraphQLError('Invalid token');
    }
};
    

export const signToken = (username: string, email: string, _id: string) => {
  const payload = { username, email, _id };
  const secretKey = process.env.JWT_SECRET_KEY || '';

  return jwt.sign(payload, secretKey, { expiresIn: '1h' });
};
