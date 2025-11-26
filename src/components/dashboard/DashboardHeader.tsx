"use client";
import React, { memo, useMemo } from "react";
import { Search, ChartPie } from "lucide-react";
import { Button } from "@/components/base/buttons/button";
import { useRouter } from "next/navigation";

interface DashboardHeaderProps {
  fullName: string;
  user: any;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = memo(
  ({ fullName, user }) => {
    const router = useRouter();

    const displayName = useMemo(() => {
      return (
        fullName ||
        (typeof user === "string"
          ? user.split(" ")[0]
          : user?.name?.split(" ")[0])
      );
    }, [fullName, user]);

    return (
      <header className="bg-white border-b border-gray-200 px-4 lg:px-8 py-4 lg:py-5 mt-16 lg:mt-0">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <h1 className="text-base lg:text-2xl font-cinzel text-[#181D27]">
            Welcome back, {displayName}
          </h1>
          <div className="flex items-center gap-2 lg:gap-3">
            {/* <Button
            color="link-gray"
            size="md"
            className="gap-2"
            iconLeading={<Search data-icon />}
            aria-label="Search"
          /> */}
            <Button
              color="secondary"
              size="md"
              onClick={() => router.push("/community")}
              className="gap-2 hidden sm:flex"
              iconLeading={<ChartPie className="w-4 h-4" />}
            >
              <span className="hidden sm:inline">
                View Group Savings Dashboard
              </span>
              <span className="sm:hidden">Group Dashboard</span>
            </Button>
          </div>
        </div>
      </header>
    );
  }
);
