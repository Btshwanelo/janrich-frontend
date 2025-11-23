"use client";

import React, { useState } from "react";
import { X, Trash2, Edit } from "lucide-react";
import { Button } from "@/components/base/buttons/button";
import { Checkbox } from "@/components/base/checkbox/checkbox";
import {
  ModalOverlay,
  Modal,
  Dialog,
} from "@/components/application/modals/modal";
import { Avatar } from "@/components/base/avatar/avatar";
import { amountConversion } from "@/utils/amountConversion";
import { getMonthsRemainingInYear } from "@/utils/dateUtils";

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  profileData?: {
    customer_name?: string;
    customer_id?: string;
    email?: string;
    account_holder?: string;
    branch_code?: string;
    iban_account?: string;
    customer_bank?: string;
  };
  savingsData?: {
    totalSaved: number;
    savingGoal: number;
    paymentsToGo?: number;
  };
}

export const DepositModal: React.FC<DepositModalProps> = ({
  isOpen,
  onClose,
  profileData,
  savingsData,
}) => {
  const [dontShowAgain, setDontShowAgain] = useState(false);
  if (!isOpen) return null;

  const formatCurrency = (value: number): string => {
    return amountConversion(value);
  };

  const customerName = profileData?.customer_name || "Kat Vilane";
  const customerHandle = customerName.toLowerCase().replace(/\s+/g, "");
  const totalPaid = savingsData?.totalSaved;
  const goalAmount = savingsData?.savingGoal;
  const paymentsToGo = getMonthsRemainingInYear();

  // Extract account details
  const accountName = "Ikhwezi Daystar";
  const accountNumber = "1266050434";
  const bank = "Nedbank";
  const branchCode = "198765";
  const reference = profileData?.customer_id;

  const handleSaveDraft = () => {
    console.log("Saved as draft");
  };

  const handlePublishChanges = () => {
    console.log("Publishing changes");
    onClose();
  };

  const handleConfirm = () => {
    console.log("Confirming deposit");
    onClose();
  };

  return (
    <ModalOverlay isOpen={isOpen} onOpenChange={onClose}>
      <Modal>
        <Dialog className="!flex !flex-col !items-stretch bg-white rounded-2xl w-full max-w-2xl mx-auto relative overflow-hidden shadow-xl">
          {/* Header Banner */}
          <div className="h-24 sm:h-40 lg:h-32 relative w-full flex-shrink-0 p-1">
            <img
              src="/Image-bg.png"
              alt="User banner"
              className="w-full h-full object-cover rounded-2xl"
            />
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 text-white hover:text-gray-200 transition-colors bg-black/20 hover:bg-black/30 rounded-full p-1.5"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="px-5 pb-6">
            {/* Profile Section */}
            <div className="flex items-start gap-4 -mt-8 ">
              <Avatar
                size="2xl"
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop"
                alt="Profile"
                verified={true}
                contrastBorder={true}
                className="shadow-lg border-4 border-white w-14 h-14 sm:w-20 sm:h-20"
              />
            </div>
            <div className="flex-col sm:flex-row items-start gap-4 mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-xl font-bold text-gray-900">
                    {customerName}
                  </h2>
                </div>
                <p className="text-sm text-gray-500">@{customerHandle}</p>
              </div>

              {/* Edit/Delete Actions - Repositioned */}
              <div className="grid grid-cols-2 sm:flex gap-2">
                <div className="flex-1 bg-gray-50 rounded-xl p-2 min-w-fit">
                  <p className="text-xs text-gray-500 mb-1">
                    You've Paid yourself
                  </p>
                  <p className="text-base sm:text-lg font-semibold text-gray-900">
                    {formatCurrency(totalPaid || 0)}
                  </p>
                </div>
                <div className="flex-1 bg-gray-50 rounded-xl p-2 min-w-fit">
                  <p className="text-xs text-gray-500 mb-1">Your Goal</p>
                  <p className="text-base sm:text-lg font-bold text-gray-900">
                    {formatCurrency(goalAmount || 0)}
                  </p>
                </div>
                <div className="flex-1 bg-[#D1E9FF] rounded-xl p-2 min-w-fit">
                  <p className="text-xs text-gray-500 mb-1">Payments to go</p>
                  <p className="text-base sm:text-lg font-bold text-gray-900">
                    {paymentsToGo}
                  </p>
                </div>
              </div>
            </div>

            {/* Summary Cards */}
            {/* <div className="flex gap-3 mb-8">
              <div className="flex-1 bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-500 mb-1">
                  You've Paid yourself
                </p>
                <p className="text-lg font-bold text-gray-900">
                  {formatCurrency(totalPaid)}
                </p>
              </div>
              <div className="flex-1 bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-500 mb-1">Your Goal</p>
                <p className="text-lg font-bold text-gray-900">
                  {formatCurrency(goalAmount)}
                </p>
              </div>
              <div className="flex-1 bg-blue-50 rounded-xl p-3">
                <p className="text-xs text-gray-500 mb-1">Payments to go</p>
                <p className="text-lg font-bold text-gray-900">
                  {paymentsToGo}
                </p>
              </div>
            </div> */}

            {/* Divider */}
            <div className="border-t border-dashed border-gray-200 mb-6" />

            {/* Payment Details Section */}
            <div className="">
              <h3 className="text-2xl font-bold text-black mb-4">
                Pay yourself a bit more.
              </h3>
              <div className="space-y-1">
                <div className="flex">
                  <span className="text-base text-[#535862] w-36">
                    Account name:
                  </span>
                  <span className="text-sm text-gray-900">{accountName}</span>
                </div>
                <div className="flex">
                  <span className="text-sm text-[#535862] w-36">
                    Account Number:
                  </span>
                  <span className="text-sm text-gray-900">{accountNumber}</span>
                </div>
                <div className="flex">
                  <span className="text-sm text-[#535862] w-36">Bank:</span>
                  <span className="text-sm text-gray-900">{bank}</span>
                </div>
                <div className="flex">
                  <span className="text-sm text-[#535862] w-36">
                    Branch Code:
                  </span>
                  <span className="text-sm text-gray-900">{branchCode}</span>
                </div>
                <div className="flex">
                  <span className="text-sm text-[#535862] w-36">
                    Reference:
                  </span>
                  <span className="text-sm text-gray-900">{reference}</span>
                </div>
              </div>
            </div>

            {/* Divider */}

            {/* Footer Actions */}
            {/* <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <Checkbox
                  isSelected={dontShowAgain}
                  onChange={setDontShowAgain}
                  label="Don't show again"
                />
                <button
                  onClick={handleSaveDraft}
                  className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                    />
                  </svg>
                  <span className="text-base font-medium text-[#535862]">
                    Save as draft
                  </span>
                </button>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={handlePublishChanges}
                  color="secondary"
                  size="md"
                  // className="border border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Publish changes
                </Button>
                <Button
                  onClick={handleConfirm}
                  color="primary"
                  size="md"
                  // className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Confirm
                </Button>
              </div>
            </div> */}
          </div>
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
};
