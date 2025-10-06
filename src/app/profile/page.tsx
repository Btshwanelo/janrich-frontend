"use client";
import SavingsGoalModal from "@/components/SavingsGoalModal";
import React from "react";

const page = () => {
  const [isOpen, setIsOpen] = React.useState(true);
  return (
    <div>
      <SavingsGoalModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSave={(amount) => console.log("Saved amount:", amount)}
      />
    </div>
  );
};

export default page;
