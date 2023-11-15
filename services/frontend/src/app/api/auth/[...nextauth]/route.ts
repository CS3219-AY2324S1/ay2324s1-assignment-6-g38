import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";

const fetchUserFromUserService = async (email: string) => {
  try {
    const res = await fetch(
      `http://${process.env.NEXT_PUBLIC_SERVICE_USER_URL}/user?email=${email}`,
    );
    const users = await res.json();
    if (users.length === 0) {
      return null;
    }
    return users[0];
  } catch (e) {
    // console.log("Unable to connect to User Service");
    return null;
  }
};

const handler = NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.NEXT_PUBLIC_GITHUB_ClIENT_ID as string,
      clientSecret: process.env.NEXT_PUBLIC_GITHUB_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      try {
        if (user) {
          const userInfo = await fetchUserFromUserService(user.email!);
          token.role = userInfo.role; // eslint-disable-line no-param-reassign
          token.userId = userInfo.id; // eslint-disable-line no-param-reassign
        }
        return token;
      } catch (error) {
        return token;
      }
    },
    async session({ session }) {
      try {
        if (session && session.user) {
          const userInfo = await fetchUserFromUserService(session.user.email!);
          return {
            ...session,
            currentUser: userInfo,
          };
        }
        return session;
      } catch (e) {
        return session;
      }
    },
    async signIn() {
      return true;
    },
  },
});

export { handler as GET, handler as POST };
