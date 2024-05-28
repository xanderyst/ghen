import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

import User from '@models/user';
import { connectToDB } from '@utils/database';

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  ],
  callbacks: {
    async session({ session }) {
      // store the user id from MongoDB to session
      const sessionUser = await User.findOne({ email: session.user.email });
      session.user.id = sessionUser._id.toString();

      return session;
    },
    async signIn({ account, profile, user, credentials }) {
      try {
        await connectToDB();

        // check if user already exists
        const existingUser = await User.findOne({ email: profile.email });
        console.log('existingUser', existingUser);
        // if not, create a new document and save user in MongoDB
        if (!existingUser) {
          const res = await User.create({
            email: profile.email,
            username: profile.name.replace(" ", "").toLowerCase(),
            image: profile.picture,
            lastLoggedIn: new Date()
          });
        }
        return true;

        const {lastLoggedIn, today} = existingUser;
        const todayDate = new Date();
        const loggedInToday = lastLoggedIn.setHours(0,0,0,0) === todayDate.setHours(0,0,0,0);
        if (!loggedInToday) {
          existingUser.today = {
            guessHistory: [],
            charactersArray: [],
            characterIndex: 0
          }
        }
        existingUser.lastLoggedIn = new Date();
        await existingUser.save();

        return true
      } catch (error) {
        console.log("Error checking if user exists: ", error.message);
        return false
      }
    },
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }