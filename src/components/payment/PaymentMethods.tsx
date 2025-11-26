import React from "react";

export const PaymentMethods: React.FC = () => {
  return (
    <div className="flex items-center justify-center gap-4 my-6">
      <img
        src="/visa.svg"
        alt="Visa"
        className="h-8 w-auto object-contain"
      />
      <img
        src="/mastercard.svg"
        alt="MasterCard"
        className="h-8 w-auto object-contain"
      />
      <img
        src="/blue-mastercard.svg"
        alt="PayPal"
        className="h-8 w-auto object-contain"
      />
    </div>
  );
};




