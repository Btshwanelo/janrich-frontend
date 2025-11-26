"use client";

import React, { useState, useEffect, useMemo } from "react";
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
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { setCurrentTransaction } from "@/lib/slices/ledgerSlice";
import { LedgerEntry } from "@/lib/slices/ledgerSlice";
import { amountConversion } from "@/utils/amountConversion";

const TransactionDetailPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Get transactions and current transaction from Redux
  const { transactions, currentTransaction } = useAppSelector(
    (state) => state.ledger
  );

  // Find current transaction index
  const currentTransactionIndex = useMemo(() => {
    if (!currentTransaction || transactions.length === 0) return 0;
    return transactions.findIndex(
      (t) => t.transaction_ref === currentTransaction.transaction_ref
    );
  }, [currentTransaction, transactions]);

  // Use current transaction from Redux, or fallback to first transaction
  const displayTransaction: LedgerEntry | null = useMemo(() => {
    if (currentTransaction) return currentTransaction;
    if (transactions.length > 0) return transactions[0];
    return null;
  }, [currentTransaction, transactions]);

  // Update current transaction in Redux when navigating
  const handlePrevious = () => {
    if (currentTransactionIndex > 0) {
      const prevTransaction = transactions[currentTransactionIndex - 1];
      dispatch(setCurrentTransaction(prevTransaction));
    }
  };

  const handleNext = () => {
    if (currentTransactionIndex < transactions.length - 1) {
      const nextTransaction = transactions[currentTransactionIndex + 1];
      dispatch(setCurrentTransaction(nextTransaction));
    }
  };

  // Set first transaction as current if none is selected
  useEffect(() => {
    if (!currentTransaction && transactions.length > 0) {
      dispatch(setCurrentTransaction(transactions[0]));
    }
  }, [currentTransaction, transactions, dispatch]);

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
            onClick={() => router.push("/dashboard")}
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
                    isDisabled={
                      currentTransactionIndex === 0 || transactions.length === 0
                    }
                    onClick={handlePrevious}
                    className="data-icon-only text-[#A4A7AE]"
                  />
                  <Button
                    color="secondary"
                    size="sm"
                    iconLeading={ChevronRight}
                    isDisabled={
                      currentTransactionIndex === transactions.length - 1 ||
                      transactions.length === 0
                    }
                    onClick={handleNext}
                    className="data-icon-only text-[#A4A7AE]"
                  />
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {displayTransaction ? (
                <>
                  {/* Transaction Details */}
                  <div className="grid grid-cols-1 px-8 md:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">
                          Reference
                        </p>
                        <p className="text-base font-semibold text-gray-900">
                          {displayTransaction.customer_id || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">
                          Customer ID
                        </p>
                        <p className="text-base font-semibold text-gray-900">
                          {displayTransaction.customer_id || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">
                          Customer Name
                        </p>
                        <p className="text-base font-semibold text-gray-900">
                          {displayTransaction.customer_name || "N/A"}
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
                          {displayTransaction.status || "N/A"}
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
                          {displayTransaction.payment_date
                            ? new Date(
                                displayTransaction.payment_date
                              ).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })
                            : "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">
                          Amount
                        </p>
                        <p className="text-base font-semibold text-gray-900">
                          {typeof displayTransaction.amount === "number"
                            ? amountConversion(
                                displayTransaction.amount,
                                displayTransaction.currency || "R"
                              )
                            : "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">
                          Gateway
                        </p>
                        <p className="text-base font-semibold text-gray-900">
                          {displayTransaction.gateway || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">
                          Payment Type
                        </p>
                        <p className="text-base font-semibold text-gray-900">
                          {displayTransaction.payment_type || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No transaction selected</p>
                </div>
              )}

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
                <div className="text-center space-y-4 px-10 py-6 mt-4 rounded-2xl bg-[#FAFAFA]">
                  <p className="text-lg font-cinzel text-[#004EEB]">
                    Financial Services
                  </p>
                  <p className="text-base text-[#181D27] font-medium max-w-md mx-auto">
                    I have been a part of JanRiches for two years and I wish I
                    joined sooner. In a short space of time, I have managed to
                    use my savings to start my event equipment hiring business.
                    I am looking forward to a beautiful future that involves
                    financial literacy and freedom.
                  </p>
                  <div className="flex flex-col items-center gap-1">
                    <Avatar
                      size="2xl"
                      src="/profile-pic.png"
                      alt="Fleur Cook"
                      contrastBorder={true}
                    />
                    <div className="text-center">
                      <p className="text-sm font-semibold text-[#181D27]">
                        Andi D - Member since 2023
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
