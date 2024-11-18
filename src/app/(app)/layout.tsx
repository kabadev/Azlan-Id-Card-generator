"use client";

import * as React from "react";

import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { RiderProvider } from "@/context/riderContext";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const router = useRouter();
  // Initialize `isAuthenticated` only when `window` is defined
  // const [isAuthenticated, setIsAuthenticated] = React.useState<boolean>(() => {
  //   if (typeof window !== "undefined") {
  //     const session = localStorage.getItem("session");
  //     return session ? JSON.parse(session).isLoggedIn : false;
  //   }
  //   return false;
  // });

  // React.useEffect(() => {
  //   // Re-check authentication status on mount
  //   if (typeof window !== "undefined") {
  //     const session = JSON.parse(localStorage.getItem("session") || "{}");
  //     if (session.isLoggedIn) {
  //       setIsAuthenticated(true);
  //     } else {
  //       router.push("/login"); // Redirect to login if not authenticated
  //     }
  //   }
  // }, [router]);

  // if (!isAuthenticated) {
  //   return router.push("/login");
  // }

  return (
    <RiderProvider>
      <div>
        <Sidebar />
        <div className="">
          <Navbar />
          <div className="fixed mt-[70px] md:w-[calc(100%-250px)] md:ml-[250px]">
            {children}
          </div>
        </div>
      </div>
    </RiderProvider>
  );
}
