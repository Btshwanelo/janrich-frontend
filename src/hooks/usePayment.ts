import { useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { PAYFAST_CONFIG, PAYMENT_PLANS, PaymentPlanType } from "@/constants/payment";
import { extractErrorMessage } from "@/utils/errorHelpers";
import { addPageError } from "@/lib/slices/errorSlice";
import { useAppDispatch } from "@/lib/hooks";

export const usePayment = () => {
  const dispatch = useAppDispatch();
  const { user, fullName } = useSelector((state: RootState) => state.auth);
  const [selectedPlan, setSelectedPlan] = useState<PaymentPlanType>("subscription");
  const [isProcessing, setIsProcessing] = useState(false);

  const getPaymentUrl = useCallback(() => {
    return PAYFAST_CONFIG.sandbox
      ? PAYFAST_CONFIG.sandbox_url
      : PAYFAST_CONFIG.production_url;
  }, []);

  const getReturnUrl = useCallback(() => {
    if (typeof window === "undefined") return PAYFAST_CONFIG.return_url;
    return `${window.location.origin}${PAYFAST_CONFIG.return_url}`;
  }, []);

  const getCancelUrl = useCallback(() => {
    if (typeof window === "undefined") return PAYFAST_CONFIG.cancel_url;
    return `${window.location.origin}${PAYFAST_CONFIG.cancel_url}`;
  }, []);

  const getNotifyUrl = useCallback(() => {
    if (typeof window === "undefined") return PAYFAST_CONFIG.notify_url;
    return `${window.location.origin}${PAYFAST_CONFIG.notify_url}`;
  }, []);

  const parseUserName = useCallback(() => {
    if (!fullName) return { first: "User", last: "Name" };
    const parts = fullName.trim().split(" ");
    return {
      first: parts[0] || "User",
      last: parts.slice(1).join(" ") || "Name",
    };
  }, [fullName]);

  const handlePayment = useCallback(async () => {
    setIsProcessing(true);

    try {
      const selectedPlanData = PAYMENT_PLANS[selectedPlan];
      const userName = parseUserName();

      // PayFast payment data
      const paymentData: Record<string, any> = {
        merchant_id: PAYFAST_CONFIG.merchant_id,
        merchant_key: PAYFAST_CONFIG.merchant_key,
        return_url: getReturnUrl(),
        cancel_url: getCancelUrl(),
        notify_url: getNotifyUrl(),

        // Payment details
        m_payment_id: `JR_${Date.now()}`, // Unique payment ID
        amount: selectedPlanData.amount,
        item_name: selectedPlanData.item_name,
        item_description: selectedPlanData.item_description,

        // Additional fields
        email_address: user || "user@example.com", // Replace with actual user email
        name_first: userName.first,
        name_last: userName.last,

        // Subscription details (if applicable)
        ...(selectedPlan === "subscription" && {
          subscription_type: selectedPlanData.subscription_type,
          billing_date: new Date().toISOString().split("T")[0],
          recurring_amount: selectedPlanData.amount,
          frequency: selectedPlanData.frequency,
          cycles: selectedPlanData.cycles,
        }),
      };

      // Create form and submit to PayFast
      const form = document.createElement("form");
      form.method = "POST";
      form.action = getPaymentUrl();

      // Add form fields
      Object.keys(paymentData).forEach((key) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = String(paymentData[key]);
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
    } catch (error: unknown) {
      const errorMessage = extractErrorMessage(
        error,
        "Payment initiation failed. Please try again."
      );
      dispatch(addPageError({ message: errorMessage }));
      setIsProcessing(false);
    }
  }, [
    selectedPlan,
    user,
    parseUserName,
    getReturnUrl,
    getCancelUrl,
    getNotifyUrl,
    getPaymentUrl,
    dispatch,
  ]);

  return {
    selectedPlan,
    setSelectedPlan,
    handlePayment,
    isProcessing,
  };
};



