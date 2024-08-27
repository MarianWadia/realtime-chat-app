import { User } from './../../types/db.d';
import { UpstashRedisAdapter } from "@next-auth/upstash-redis-adapter";
import { getServerSession, NextAuthOptions } from "next-auth";
import { db } from "./db";
import  GoogleProvider from "next-auth/providers/google"
import { getSession, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { redirect } from 'next/navigation';
import { fetchRedis } from '@/helpers/redis';

function getGoogleCredentials(){
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    if(!clientId || clientId.length === 0){
        throw new Error('GOOGLE_CLIENT_ID not set');
    }
    if(!clientSecret || clientSecret.length === 0){
        throw new Error('GOOGLE_CLIENT_SECRET not set');
    }
    return{ clientId, clientSecret }
}

export const authOptions: NextAuthOptions = {
    adapter: UpstashRedisAdapter(db),
    session: {
        strategy: 'jwt'
    }, 
    pages:{
        signIn: '/login'
    },
    providers: [
        GoogleProvider({
            clientId: getGoogleCredentials().clientId,
            clientSecret: getGoogleCredentials().clientSecret,
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
          // Check if a user is available (typically during sign-in)
          if (user) {
            token.id = user.id; // Initialize the token ID
          } else {
            // If no user, attempt to retrieve user details from the database using token.id
            const dbUserRaw = (await fetchRedis('get', `user:${token.id}`)) as string | null;
            const dbUser = await JSON.parse(dbUserRaw as string) as User;
            if (dbUser) {
              token = {
                ...token,
                id: dbUser.id,
                name: dbUser.name,
                email: dbUser.email,
                picture: dbUser.image,
              };
            }
          }
          return token;
        },
        async session({ session, token }) {
          if (token) {
            // Assign token properties to the session's user object
            session.user = {
              id: token.id as string,
              name: token.name as string,
              email: token.email as string,
              image: token.picture as string,
            };
          }
          return session;
        },
        redirect() {
          return '/dashboard';
        },
      }
      
}