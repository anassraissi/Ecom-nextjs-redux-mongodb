import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import dbConnect from "@/libs/models/dbConnect";
import User from "@/libs/models/User";

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
                        password: user.email, // Using email as password for Google login
                    });
                    await newUser.save();
                    console.log("Created new user:", newUser);
                } else {
                    console.log("User already exists:", existingUser);
                }

                return true; // Allow sign in
            } catch (error) {
                console.error("Error in signIn callback:", error);
                return false; // Prevent sign in
            }
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };