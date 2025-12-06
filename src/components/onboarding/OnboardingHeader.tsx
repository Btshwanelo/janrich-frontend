"use client";

import React, { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/base/buttons/button";
import { LogoutConfirmationModal } from "./LogoutConfirmationModal";

interface OnboardingHeaderProps {
  onClose?: () => void;
}

export const OnboardingHeader: React.FC<OnboardingHeaderProps> = ({
  onClose,
}) => {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleCloseClick = () => {
    if (onClose) {
      onClose();
    } else {
      setIsLogoutModalOpen(true);
    }
  };

  return (
    <>
      <div className="mb-6">
        <div className="border-b border-[#E9EAEB] px-8 py-2 flex bg-white justify-between">
          <img
            src="/jr-logo-black.svg"
            alt="JanRich Logo"
            className="w-[37px] h-auto"
          />
          <Button color="link-gray" onClick={handleCloseClick}>
            <X />
          </Button>
        </div>
      </div>

      <LogoutConfirmationModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
      />
    </>
  );
};

