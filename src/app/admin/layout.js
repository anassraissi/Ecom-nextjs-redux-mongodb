"use client";
import Loader from "@/components/adminPanel/Loader";
import Login from "@/components/adminPanel/Login";
import Sidebar from "@/components/adminPanel/Sidebar";
import { useAppSelector } from "@/redux/hooks";
import { useSession } from "next-auth/react";

const Layout = ({ children }) => {
  const isLoading = useAppSelector((store) => store.loading);
  const { data: session } = useSession();

  // Render Login component if user is not authenticated
  if (!session?.user) {
    return <Login />;
  }
  console.log('isLoading',isLoading);
  
  // Render layout if user is authenticated
  return (
    <div className="flex">
      <Sidebar />
      <div className="w-full h-full">
        <div className="bg-gray-200 p-4 h-[calc(100vh-64px)]">{children}</div>
        {isLoading && <Loader />} {/* Display loader during loading */}
      </div>
    </div>
  );
};

export default Layout;
