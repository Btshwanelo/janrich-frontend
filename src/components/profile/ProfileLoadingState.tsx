import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/untitled-card";

export const ProfileLoadingState: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-full mt-16 lg:mt-0">
      <div className="text-center flex flex-col justify-cente align-middle items-center">
        <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4"></div>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  );
};
