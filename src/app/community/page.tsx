"use client";

import AuthGuard from "@/components/AuthGuard";
import MobileTopNav from "@/components/MobileTopNav";
import SidebarWrapper from "@/components/SidebarWrapper";
import React, { useState } from "react";

const page = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <AuthGuard>
      <div className="min-h-screen bg-white flex">
        {/* Mobile Top Navigation */}
        <MobileTopNav />

        {/* Left Sidebar */}
        <SidebarWrapper onCollapseChange={setIsSidebarCollapsed} />
        <div
          className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${
            isSidebarCollapsed ? "lg:ml-16" : "lg:ml-64"
          }`}
        >
            <div className="flex justify-center align-middle items-centers font-bold min-h-full">

          Coming soon...
            </div>
        </div>
      </div>
    </AuthGuard>
  );
};

export default page;
