import NextAuth, { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { PrismaClient } from '@prisma/client'
import { compare } from 'bcrypt'

const prisma = new PrismaClient()

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // First, try to find the user in the 'User' table
        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        })

        // If found in the User table, verify the password
        if (user && await compare(credentials.password, user.password)) {
          return {
            id: user.id,        // Include the user ID in the session
            email: user.email,
            name: user.name,
            role: user.role     // Either USER or ADMIN from your Role enum
          }
        }

        // If not found in User, try the 'ServiceProvider' table
        const serviceProvider = await prisma.serviceProvider.findUnique({
          where: { email: credentials.email }
        })

        // If found in ServiceProvider, verify the password
        if (serviceProvider && await compare(credentials.password, serviceProvider.password)) {
          return {
            id: serviceProvider.id,  // Include the service provider ID in the session
            email: serviceProvider.email,
            name: serviceProvider.name,
            role: 'SERVICE_PROVIDER' // Explicitly assign the role
          }
        }

        // If neither user nor service provider is found, return null
        return null
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id       // Include user or serviceProvider ID in the token
        token.role = user.role   // Include role in the token (USER, ADMIN, or SERVICE_PROVIDER)
      }
      return token
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id       // Pass the ID to the session (either user or service provider)
        session.user.role = token.role   // Pass the role to the session
      }
      return session
    }
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt', // Use JWT for session management
  },
  secret: process.env.NEXTAUTH_SECRET, // Secret for NextAuth encryption
  debug: process.env.NODE_ENV === 'development', // Enable debug mode in development
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
