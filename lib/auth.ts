import { getServerSession, type AuthOptions } from 'next-auth';
import db from './db';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import GoogleProvider from 'next-auth/providers/google';
import CredentialProvider from 'next-auth/providers/credentials';
import { NextResponse } from 'next/server';
import { SignInSchema } from './validators/authValidators';
import bcrypt from 'bcrypt';
import { z } from 'zod';

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(db),
  session: {
    strategy: 'jwt',
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialProvider({
      name: 'email',
      credentials: {
        email: { label: 'Email', type: 'text', placeholder: 'Email' },
        password: {
          label: 'Password',
          type: 'password',
          placeholder: 'Password',
        },
      },
      // @ts-expect-error
      async authorize(credentials) {
        try {
          if (!credentials || !credentials.email || !credentials.password) {
            return new NextResponse('Missing Fields', { status: 422 });
          }

          const { email, password } = SignInSchema.parse(credentials);

          const dbUser = await db.user.findUnique({
            where: {
              email,
            },
          });

          if (!dbUser || !dbUser?.hashedPassword) {
            return new NextResponse(
              'Either username or password is incorrect',
              { status: 401 }
            );
          }

          // compare passwords
          const checkPassword = await bcrypt.compare(
            password,
            dbUser.hashedPassword
          );

          if (!checkPassword) {
            return new NextResponse(
              'Either username or password is incorrect',
              { status: 401 }
            );
          }

          const user = {
            id: dbUser.id,
            name: dbUser.name,
            email: dbUser.email,
          };

          return user;
        } catch (error) {
          if (error instanceof z.ZodError) {
            return new NextResponse(error.message, { status: 422 });
          }

          return new NextResponse('Could not sign in', { status: 500 });
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user!.id = token.id;
      }
      return session;
    },
    redirect() {
      return '/';
    },
  },
};

export const getAuthSession = () => getServerSession(authOptions);
