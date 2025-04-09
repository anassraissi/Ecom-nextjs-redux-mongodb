"use client";
import Loader from "@/components/adminPanel/Loader";
import Login from "@/components/adminPanel/Login";
import Sidebar from "@/components/adminPanel/Sidebar";
import { useAppSelector } from "@/redux/hooks";
import { useSession } from "next-auth/react";

const Layout = ({ children }) => {
  const isLoading = useAppSelector((store) => store.loading);
  const { data: session } = useSession();

  if (!session?.user) {
    return <Login />;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-6">
          {children}
        </div>
      </main>
      {isLoading && <Loader />}
    </div>
  );
};

export default Layout;