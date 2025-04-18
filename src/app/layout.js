
import "./globals.css";
import { App } from "./App";
import { Toaster } from "react-hot-toast";
import AuthProvider from "@/components/adminPanel/AuthProvider";
import dbConnect from "@/libs/models/dbConnect"; 
import { initializeDummyData } from "@/libs/models/initializeDummyData";


export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default async function RootLayout({ children }) {
  dbConnect();
  // await initializeDummyData();
  return (
    <html lang="en">
      <body>
        <AuthProvider>
        <App>{children}</App>
        </AuthProvider>
        </body>
    </html>
  );
}
