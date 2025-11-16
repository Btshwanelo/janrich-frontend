"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Download,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/base/buttons/button";
import { BadgeWithIcon } from "@/components/base/badges/badges";
import { Check } from "lucide-react";
import { Avatar } from "@/components/base/avatar/avatar";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/untitled-card";
import AuthGuard from "@/components/AuthGuard";
import SidebarWrapper from "@/components/SidebarWrapper";
import MobileTopNav from "@/components/MobileTopNav";

const TransactionDetailPage = () => {
  const router = useRouter();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const [currentTransactionIndex, setCurrentTransactionIndex] = useState(0);

  // Mock transaction data - in a real app, this would come from props or API
  const transactions = [
    {
      reference: "JRO001",
      status: "Paid",
      date: "Jan 6, 2025",
      amount: "R3500.90",
    },
  ];

  const currentTransaction = transactions[currentTransactionIndex];

  const handlePrevious = () => {
    if (currentTransactionIndex > 0) {
      setCurrentTransactionIndex(currentTransactionIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentTransactionIndex < transactions.length - 1) {
      setCurrentTransactionIndex(currentTransactionIndex + 1);
    }
  };

  const handleDownloadPDF = () => {
    // Handle PDF download
    console.log("Downloading PDF...");
  };

  const handleDisputePayment = () => {
    // Handle dispute payment
    console.log("Disputing payment...");
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50 flex justify-center p-4 md:p-8">
        {/* Mobile Top Navigation */}
        <MobileTopNav />

        {/* Left Sidebar */}
        <SidebarWrapper onCollapseChange={setIsSidebarCollapsed} />
        <div
          className={`flex-1 flex flex-col max-w-2xl justify-start items-start transition-all duration-300 ease-in-out ${
            isSidebarCollapsed ? "lg:ml-16" : "lg:ml-64"
          }`}
        >
          <Button
            color="secondary"
            size="sm"
            iconLeading={ArrowLeft}
            onClick={() => router.push('/dashboard')}
            className="mb-4"
          >
            Back
          </Button>
          <Card variant="elevated" className="w-full rounded-md shadow-none">
            <CardHeader className="pb-4">
              {/* Back Button */}

              {/* Title Section with Navigation */}
              <div className="flex items-center justify-between border-b pb-2">
                <div className="flex-1">
                  <CardTitle className="text-2xl font-semibold text-gray-900 mb-1">
                    Transactions
                  </CardTitle>
                  <CardDescription className="text-sm text-gray-600">
                    Keep track of your transactions.
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Button
                    color="secondary"
                    size="sm"
                    iconLeading={ChevronLeft}
                    isDisabled={currentTransactionIndex === 0}
                    onClick={handlePrevious}
                    className="data-icon-only text-[#A4A7AE]"
                  />
                  <Button
                    color="secondary"
                    size="sm"
                    iconLeading={ChevronRight}
                    isDisabled={
                      currentTransactionIndex === transactions.length - 1
                    }
                    onClick={handleNext}
                    className="data-icon-only text-[#A4A7AE]"
                  />
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Transaction Details */}
              <div className="grid grid-cols-1 px-8 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">
                      Reference
                    </p>
                    <p className="text-base font-semibold text-gray-900">
                      {currentTransaction.reference}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">
                      Status
                    </p>
                    <BadgeWithIcon
                      type="pill-color"
                      color="success"
                      size="md"
                      iconLeading={Check}
                    >
                      {currentTransaction.status}
                    </BadgeWithIcon>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">
                      Date
                    </p>
                    <p className="text-base font-semibold text-gray-900">
                      {currentTransaction.date}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">
                      Amount
                    </p>
                    <p className="text-base font-semibold text-gray-900">
                      {currentTransaction.amount}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col justify-between sm:flex-row gap-3 pt-2 border-t border-gray-200">
                <Button
                  color="secondary"
                  size="md"
                  //   iconLeading={Download}
                  onClick={handleDownloadPDF}
                  className=""
                >
                  Download PDF
                </Button>
                <Button
                  color="link-gray"
                  size="md"
                  //   iconLeading={AlertCircle}
                  onClick={handleDisputePayment}
                  className=""
                >
                  Dispute Payment
                </Button>
              </div>

              {/* Testimonial Section */}
              <div className="!mt-2 border-t border-gray-200">
                <div className="text-center space-y-4 px-10 py-6 mt-6 rounded-2xl bg-[#FAFAFA]">
                  <p className="text-sm font-medium text-blue-600">
                    Financial Services
                  </p>
                  <p className="text-base text-gray-700 max-w-md mx-auto">
                    "Untitled has saved us thousands of hours of work. We're
                    able to spin up projects and features faster."
                  </p>
                  <div className="flex flex-col items-center gap-1">
                    <Avatar
                      size="2xl"
                      src="/profile-pic.png"
                      alt="Fleur Cook"
                      contrastBorder={true}
                    />
                    <div className="text-center">
                      <p className="text-sm font-semibold text-gray-900">
                        Fleur Cook
                      </p>
                      <p className="text-xs text-gray-600">
                        Web Developer, Sisyphus
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthGuard>
  );
};

export default TransactionDetailPage;
