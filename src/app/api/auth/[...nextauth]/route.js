import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import User from "@/libs/models/User";
import dbConnect from "@/libs/models/dbConnect";

export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
    ],
    callbacks: {
        async signIn({ user, account, profile }) {
            try {
                await dbConnect();
                const existingUser = await User.findOne({ email: user.email });

                if (!existingUser) {
                    const newUser = new User({
                        name: user.name,
                        email: user.email,
                    });
                    await newUser.save();
                    console.log("Created new user:", newUser);
                } else {
                    console.log("User already exists:", existingUser);
                }

                return true;
            } catch (error) {
                console.error("Error in signIn callback:", error);
                return false;
            }
        },
        async session({ session, token }) {
            await dbConnect();
            const user = await User.findOne({ email: session?.user?.email });
            if (user) {
                session.user.id = user._id.toString();
            }
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };