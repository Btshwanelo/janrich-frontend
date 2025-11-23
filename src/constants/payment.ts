export const PAYMENT_PLANS = {
  subscription: {
    id: "subscription",
    label: "Subscription",
    amount: "200",
    displayAmount: "R200.00/year",
    item_name: "subscription",
    item_description:
      "Join the community, save and start paying yourself first.",
    subscription_type: "1", // Monthly
    frequency: "3", // Annual
    cycles: "0", // Indefinite
  },
  "once-off": {
    id: "once-off",
    label: "Once Off",
    amount: "349.99",
    displayAmount: "R349.99 once-off",
    item_name: "JanRiches Once-off Payment",
    item_description: "Be a part of the community on your own terms.",
  },
} as const;

export const PAYFAST_CONFIG = {
  merchant_id: "10038198",
  merchant_key: "8yshtxb2mu1oa",
  return_url: "/payment-success",
  cancel_url: "/payment-cancelled",
  notify_url: "/api/payfast-notify",
  sandbox: true, // Sandbox mode for testing
  sandbox_url: "https://sandbox.payfast.co.za/eng/process",
  production_url: "https://www.payfast.co.za/eng/process",
} as const;

export type PaymentPlanType = keyof typeof PAYMENT_PLANS;

