import FacebookProvider from "next-auth/providers/facebook"

export const authOptions = {
  secret: process.env.AUTH_SECRET,
  providers: [
    FacebookProvider({
      id: "facebook",
      name: "Facebook",
      clientId: process.env.AUTH_FACEBOOK_ID,
      clientSecret: process.env.AUTH_FACEBOOK_SECRET,
      authorization: {
        params: {
          scope: "email,public_profile",
        },
      },
    }),
    FacebookProvider({
      id: "facebook-pages",
      name: "Facebook Pages",
      clientId: process.env.POSTFLOW2_APP_ID,
      clientSecret: process.env.POSTFLOW2_APP_SECRET,
      authorization: {
        params: {
          scope: "pages_show_list,pages_manage_posts,pages_read_engagement",
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account?.provider === "facebook") {
        token.accessToken = account.access_token
        token.userId = profile?.id
      }
      if (account?.provider === "facebook-pages") {
        const res = await fetch(
          `https://graph.facebook.com/me/accounts?fields=id,name,access_token,category,tasks&access_token=${account.access_token}`
        )
        const data = await res.json()
        token.pages = data.data || []
        token.pagesToken = account.access_token
      }
      return token
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken
      session.pages = token.pages || []
      session.pagesToken = token.pagesToken
      return session
    },
  },
}