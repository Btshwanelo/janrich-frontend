"use client";

import React, { useState, useEffect } from "react";
import { X, Wallet, Plus } from "lucide-react";
import { Button } from "@/components/base/buttons/button";
import {
  ModalOverlay,
  Modal,
  Dialog,
} from "@/components/application/modals/modal";
import { Input } from "@/components/base/input/input";
import { Select } from "@/components/base/select/select";
import { Checkbox } from "@/components/base/checkbox/checkbox";
import { amountConversion } from "@/utils/amountConversion";
import {
  useGetBalanceQuery,
  useGetProfileQuery,
  useRequestPayoutMutation,
} from "@/lib/slices/authSlice";
import { useAppSelector } from "@/lib/hooks";

interface PayoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalSaved?: number;
  payoutAccounts?: Array<{
    id: string;
    label: string;
    accountNumber?: string;
  }>;
}

type PayoutType = "partial" | "full";

export const PayoutModal: React.FC<PayoutModalProps> = ({
  isOpen,
  onClose,
  totalSaved = 0,
  payoutAccounts = [
    { id: "1", label: "Capitec Acc", accountNumber: "1412614242" },
  ],
}) => {
  const [payoutType, setPayoutType] = useState<PayoutType>("full");
  const [amount, setAmount] = useState<string>("");
  const [selectedBankingOption, setSelectedBankingOption] = useState<string>("existing");
  const [bank, setBank] = useState<string>("");
  const [bankCode, setBankCode] = useState<string>("");
  const [bankAccount, setBankAccount] = useState<string>("");
  const [accountHolder, setAccountHolder] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [fieldErrors, setFieldErrors] = useState<{
    amount?: string;
    bank?: string;
    bankCode?: string;
    bankAccount?: string;
    accountHolder?: string;
  }>({});

  const { user, customer } = useAppSelector((state) => state.auth);
  const {
    data: balanceData,
    isLoading: isBalanceLoading,
    error: balanceError,
  } = useGetBalanceQuery(customer, { skip: !isOpen || !customer });
  const [requestPayout, { isLoading: isPayoutLoading, isSuccess }] =
    useRequestPayoutMutation();
  const {
    data: profileData,
    isLoading: isProfileLoading,
    error: profileError,
  } = useGetProfileQuery(customer, { skip: !isOpen || !customer });
  const financials = profileData?.message?.data?.financials;
  const totalBalance = balanceData?.message?.total_balance || 0;

  // Initialize form with existing banking details when profile data loads
  useEffect(() => {
    if (financials && selectedBankingOption === "existing") {
      setBank(financials.customer_bank || "");
      setBankCode(financials.branch_code || "");
      setBankAccount(financials.iban_account || "");
      setAccountHolder(financials.account_holder || "");
    } else if (selectedBankingOption === "new") {
      // Clear form when switching to new account
      setBank("");
      setBankCode("");
      setBankAccount("");
      setAccountHolder("");
    }
    setErrorMessage(""); // Clear error when changing banking option
    setFieldErrors({}); // Clear field errors when changing banking option
  }, [financials, selectedBankingOption]);

  // Update amount when balance loads and full withdrawal is selected
  useEffect(() => {
    if (payoutType === "full" && totalBalance > 0) {
      setAmount(totalBalance.toString());
    }
  }, [totalBalance, payoutType]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setPayoutType("full");
      setAmount("");
      setSelectedBankingOption("existing");
      setBank("");
      setBankCode("");
      setBankAccount("");
      setAccountHolder("");
      setErrorMessage("");
      setSuccessMessage("");
      setFieldErrors({});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePayoutTypeChange = (type: PayoutType) => {
    setPayoutType(type);
    setErrorMessage(""); // Clear error when changing payout type
    setFieldErrors({}); // Clear field errors
    if (type === "full") {
      setAmount(totalBalance.toString());
    } else {
      setAmount("");
    }
  };

  const handleAmountChange = (value: string) => {
    // Only allow numbers and decimal point
    const numericValue = value.replace(/[^0-9.]/g, "");
    setAmount(numericValue);
    setErrorMessage(""); // Clear error when user types
    // Clear field error when user types
    if (fieldErrors.amount) {
      setFieldErrors((prev) => ({ ...prev, amount: undefined }));
    }
  };

  const handleRequestPayout = async () => {
    // Clear previous messages and errors
    setErrorMessage("");
    setSuccessMessage("");
    const errors: { amount?: string; bank?: string; bankCode?: string; bankAccount?: string; accountHolder?: string } = {};

    // Validate balance is available
    if (totalBalance <= 0) {
      setErrorMessage("You have no available balance to withdraw.");
      return;
    }

    // Validate amount based on payout type
    let payoutAmount: number = 0;
    if (payoutType === "full") {
      payoutAmount = totalBalance;
    } else {
      // Partial withdrawal validation
      if (!amount || amount.trim() === "") {
        errors.amount = "Please enter a withdrawal amount.";
      } else {
        const parsedAmount = parseFloat(amount);
        
        // Check for invalid number
        if (isNaN(parsedAmount)) {
          errors.amount = "Please enter a valid withdrawal amount.";
        }
        // Check for zero or negative amounts
        else if (parsedAmount <= 0) {
          errors.amount = "Withdrawal amount must be greater than zero.";
        }
        // Check if amount exceeds balance
        else if (parsedAmount > totalBalance) {
          errors.amount = `You cannot withdraw more than your available balance of ${amountConversion(totalBalance)}.`;
        } else {
          payoutAmount = parsedAmount;
        }
      }
    }

    // Validate required fields for new banking option
    if (selectedBankingOption === "new") {
      if (!bank || bank.trim() === "") {
        errors.bank = "Bank name is required.";
      }
      
      if (!bankCode || bankCode.trim() === "") {
        errors.bankCode = "Branch code is required.";
      }
      
      if (!bankAccount || bankAccount.trim() === "") {
        errors.bankAccount = "Account number is required.";
      }

      if (!accountHolder || accountHolder.trim() === "") {
        errors.accountHolder = "Account holder name is required.";
      }
    }

    // If there are any field errors, show them and stop
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    // If using existing banking, ensure we have the data
    if (selectedBankingOption === "existing" && (!financials?.customer_bank || !financials?.iban_account)) {
      setErrorMessage("Existing banking details are incomplete. Please add new banking details.");
      return;
    }

    // Get current date in YYYY-MM-DD format
    const today = new Date();
    const dateString = today.toISOString().split("T")[0];

    // Generate remarks based on payout type
    const defaultRemarks =
      payoutType === "full"
        ? "Full withdrawal request"
        : `Partial withdrawal request of ${amountConversion(payoutAmount)}`;

    // Determine which banking details to use
    const finalBank = selectedBankingOption === "existing" 
      ? (financials?.customer_bank || "") 
      : bank;
    const finalBankCode = selectedBankingOption === "existing"
      ? (financials?.branch_code || "")
      : bankCode;
    const finalBankAccount = selectedBankingOption === "existing"
      ? (financials?.iban_account || "")
      : bankAccount;
    const finalAccountHolder = selectedBankingOption === "existing"
      ? (financials?.account_holder || "")
      : accountHolder;

    try {
      await requestPayout({
        customer: customer || "",
        date: dateString,
        amount: payoutAmount,
        remarks: defaultRemarks,
        bank: finalBank,
        bank_code: finalBankCode,
        bank_account: finalBankAccount,
        account_holder: finalAccountHolder,
      }).unwrap();

      setSuccessMessage(
        `Your ${payoutType} withdrawal request of ${amountConversion(payoutAmount)} has been submitted successfully.`
      );
    } catch (error: any) {
      console.log("err:", error);
      const errorMsg =
        error?.data?.message ||
        error?.message ||
        (typeof error === "string" ? error : "Unable to submit payout request. Please try again.");
      setErrorMessage(errorMsg);
    }
  };

  const handleCloseSuccess = () => {
    setSuccessMessage("");
    onClose();
  };

  return (
    <ModalOverlay isOpen={isOpen} onOpenChange={onClose}>
      <Modal>
        <Dialog className="!flex !flex-col !items-stretch bg-white rounded-2xl w-full max-w-lg mx-auto relative overflow-hidden shadow-xl">
          {/* Header */}
          <div className="flex items-start justify-between p-6 pb-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                <Wallet className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Payout Request
                </h2>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-4">
            {/* Description */}
            {!successMessage &&<p className="text-sm text-gray-600 mb-6 leading-relaxed">
              It's January for you but janu-worry for others, you have options,
              you can request all or some of the money you've saved.
            </p>}

            {/* Error Alert */}
            {errorMessage && (
              <div className="mb-6">
                <div className="bg-error-50 border border-error-200 rounded-lg p-3 flex items-start justify-between gap-3">
                  <p className="text-error-600 text-sm flex-1">{errorMessage}</p>
                  <button
                    type="button"
                    onClick={() => setErrorMessage("")}
                    className="text-error-400 hover:text-error-600 focus:outline-none transition-colors flex-shrink-0"
                    aria-label="Dismiss error"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Success Message */}
            {successMessage ? (
              <div className="mb-6">
                <div className="">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold  mb-1">
                        Payout Request Submitted
                      </h3>
                      <p className="text-sm ">
                        {successMessage}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <Button
                      color="primary"
                      size="md"
                      onClick={handleCloseSuccess}
                      className="min-w-[100px]"
                    >
                      Close
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {/* Payout Options */}
            <div className="space-y-3 mb-6">
              {/* Partial Withdrawal Option */}
              <div
                onClick={() => handlePayoutTypeChange("partial")}
                className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  payoutType === "partial"
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <Wallet className="w-5 h-5 text-gray-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">
                    Make it rain but safe Withdraw Some your money
                  </h3>
                  <p className="text-xs text-gray-600">
                    A partial payout sets you up to not start from zero this
                    year.
                  </p>
                </div>
                <Checkbox
                  isSelected={payoutType === "partial"}
                  onChange={() => handlePayoutTypeChange("partial")}
                  size="md"
                />
              </div>

              {/* Full Withdrawal Option */}
              <div
                onClick={() => handlePayoutTypeChange("full")}
                className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  payoutType === "full"
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <Wallet className="w-5 h-5 text-gray-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">
                    Make it rain withdraw all your money
                  </h3>
                  <p className="text-xs text-gray-600">
                    Withdraw it all, start afresh - 'money will come'
                  </p>
                </div>
                <Checkbox
                  isSelected={payoutType === "full"}
                  onChange={() => handlePayoutTypeChange("full")}
                  size="md"
                />
              </div>
            </div>

            {/* Amount Input */}
            <div className="mb-6">
              <Input
                label="Amount"
                value={amount}
                onChange={(value) => handleAmountChange(value)}
                placeholder="Enter payout amount"
                type="text"
                inputMode="decimal"
                isDisabled={payoutType === "full" || isBalanceLoading}
                isRequired={payoutType === "partial"}
                isInvalid={!!fieldErrors.amount}
                hint={fieldErrors.amount}
                size="md"
                className="w-full"
              />
              {!fieldErrors.amount && isBalanceLoading ? (
                <p className="mt-2 text-sm text-gray-500">Loading balance...</p>
              ) : !fieldErrors.amount && payoutType === "full" ? (
                <p className="mt-2 text-sm text-gray-600">
                  Full amount: {amountConversion(totalBalance)}
                </p>
              ) : !fieldErrors.amount && payoutType === "partial" ? (
                <p className="mt-2 text-sm text-gray-600">
                  Available balance: {amountConversion(totalBalance)}
                </p>
              ) : null}
            </div>

            {/* Banking Details Section */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Payout Account
              </label>
              <Select
                selectedKey={selectedBankingOption}
                onSelectionChange={(key) => setSelectedBankingOption(key as string)}
                placeholder="Select payout account"
                size="md"
                className="w-full mb-4"
              >
                <Select.Item id="existing">
                  {isProfileLoading ? (
                    "Loading..."
                  ) : financials?.customer_bank && financials?.iban_account ? (
                    `${financials.customer_bank} ${financials.iban_account}`
                  ) : (
                    "Current Account (No details)"
                  )}
                </Select.Item>
                <Select.Item id="new">+ Add new account</Select.Item>
              </Select>

              {selectedBankingOption === "existing" ? (
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  {isProfileLoading ? (
                    <p className="text-sm text-gray-500">Loading banking details...</p>
                  ) : financials ? (
                    <>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Bank:</span>
                        <span className="text-sm font-medium text-gray-900">
                          {financials.customer_bank || "Not provided"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Account Number:</span>
                        <span className="text-sm font-medium text-gray-900">
                          {financials.iban_account || "Not provided"}
                        </span>
                      </div>
                      {financials.branch_code && (
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Branch Code:</span>
                          <span className="text-sm font-medium text-gray-900">
                            {financials.branch_code}
                          </span>
                        </div>
                      )}
                      {financials.account_holder && (
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Account Holder:</span>
                          <span className="text-sm font-medium text-gray-900">
                            {financials.account_holder}
                          </span>
                        </div>
                      )}
                    </>
                  ) : (
                    <p className="text-sm text-gray-500">
                      No banking details found. Please select "Add new account" to enter banking details.
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <Input
                    label="Bank Name"
                    value={bank}
                    onChange={(value) => {
                      setBank(value);
                      if (fieldErrors.bank) {
                        setFieldErrors((prev) => ({ ...prev, bank: undefined }));
                      }
                    }}
                    placeholder="Enter bank name"
                    size="md"
                    className="w-full"
                    isRequired
                    isInvalid={!!fieldErrors.bank}
                    hint={fieldErrors.bank}
                  />
                  <Input
                    label="Branch Code"
                    value={bankCode}
                    onChange={(value) => {
                      setBankCode(value);
                      if (fieldErrors.bankCode) {
                        setFieldErrors((prev) => ({ ...prev, bankCode: undefined }));
                      }
                    }}
                    placeholder="Enter branch code"
                    size="md"
                    className="w-full"
                    isRequired
                    isInvalid={!!fieldErrors.bankCode}
                    hint={fieldErrors.bankCode}
                  />
                  <Input
                    label="Account Number"
                    value={bankAccount}
                    onChange={(value) => {
                      setBankAccount(value);
                      if (fieldErrors.bankAccount) {
                        setFieldErrors((prev) => ({ ...prev, bankAccount: undefined }));
                      }
                    }}
                    placeholder="Enter account number"
                    size="md"
                    className="w-full"
                    isRequired
                    isInvalid={!!fieldErrors.bankAccount}
                    hint={fieldErrors.bankAccount}
                  />
                  <Input
                    label="Account Holder Name"
                    value={accountHolder}
                    onChange={(value) => {
                      setAccountHolder(value);
                      if (fieldErrors.accountHolder) {
                        setFieldErrors((prev) => ({ ...prev, accountHolder: undefined }));
                      }
                    }}
                    placeholder="Enter account holder name"
                    size="md"
                    className="w-full"
                    isRequired
                    isInvalid={!!fieldErrors.accountHolder}
                    hint={fieldErrors.accountHolder}
                  />
                </div>
              )}
            </div>
              </>
            )}
          </div>

          {/* Footer Actions - Only show when not in success state */}
          {!successMessage && (
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3">
              <Button
                color="secondary"
                size="md"
                onClick={onClose}
                className="min-w-[100px]"
              >
                Cancel
              </Button>
              <Button
                color="primary"
                size="md"
                onClick={handleRequestPayout}
                className="min-w-[140px]"
                isDisabled={
                  isPayoutLoading ||
                  isProfileLoading ||
                  isBalanceLoading
                }
              >
                {isPayoutLoading ? "Submitting..." : "Request Payout"}
              </Button>
            </div>
          )}
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
};
