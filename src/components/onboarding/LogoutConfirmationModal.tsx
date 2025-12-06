"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/lib/hooks";
import { clearCredentials, clearAuthCookie } from "@/lib/slices/authSlice";
import { clearOnboardingData } from "@/lib/slices/onboardingSlice";
import { Button } from "@/components/base/buttons/button";
import {
  ModalOverlay,
  Modal,
  Dialog,
} from "@/components/application/modals/modal";
import { X, CheckCircle } from "lucide-react";

interface LogoutConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LogoutConfirmationModal: React.FC<
  LogoutConfirmationModalProps
> = ({ isOpen, onClose }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleConfirm = () => {
    // Clear credentials and onboarding data
    dispatch(clearCredentials());
    dispatch(clearOnboardingData());
    clearAuthCookie();

    // Redirect to login
    router.push("/login");
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay isOpen={isOpen} onOpenChange={onClose} isDismissable>
      <Modal>
        <Dialog>
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-xl">
            <div className="relative">
              {/* Close button */}
              <div className="absolute top-0 right-0">
                <Button
                  color="tertiary"
                  size="sm"
                  onClick={onClose}
                  className="p-1"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Success Icon */}
              <div className="flex justify-start mb-4 pt-2">
                <div className="relative">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <img src={"/check-icon.svg"} />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center -z-10">
                    <div className="w-16 h-16 rounded-full bg-green-100/30 animate-ping"></div>
                  </div>
                </div>
              </div>

              {/* Title */}
              <h2 className="text-base font-semibold text-[#v] text-left mb-2">
                Logout and complete later?
              </h2>

              {/* Message */}
              <p className="text-[#535862] text-left mb-6">
                You can logout now and complete your onboarding process later.
                Your progress will be saved.
              </p>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button color="secondary" onClick={onClose} className="flex-1">
                  Cancel
                </Button>
                <Button
                  color="primary"
                  onClick={handleConfirm}
                  className="flex-1 bg-[#1F235B] hover:bg-[#1F235B]/90"
                >
                  Confirm
                </Button>
              </div>
            </div>
          </div>
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
};
