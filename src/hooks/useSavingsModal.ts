import { useState, useEffect } from "react";

interface UseSavingsModalProps {
  savingsGoal: number | null | undefined;
  refetch: () => Promise<any>;
}

interface UseSavingsModalReturn {
  isModalOpen: boolean;
  hasUserDismissedModal: boolean;
  setIsModalOpen: (open: boolean) => void;
  setHasUserDismissedModal: (dismissed: boolean) => void;
  handleModalClose: () => void;
  handleModalSave: (amount: number) => Promise<void>;
}

export const useSavingsModal = ({
  savingsGoal,
  refetch,
}: UseSavingsModalProps): UseSavingsModalReturn => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasUserDismissedModal, setHasUserDismissedModal] = useState(false);

  useEffect(() => {
    // Check if savings goal hasn't been set (0, null, undefined, or missing)
    if (savingsGoal === 0) {
      setIsModalOpen(true);
    } else if (savingsGoal && savingsGoal > 0) {
      setIsModalOpen(false);
      setHasUserDismissedModal(false); // Reset dismissal flag when goal is set
    }
  }, [savingsGoal, hasUserDismissedModal]);

  const handleModalClose = () => {
    setIsModalOpen(false);
    setHasUserDismissedModal(true);
  };

  const handleModalSave = async (amount: number) => {
    // Refetch profile data to get updated savings goal
    await refetch();
    setIsModalOpen(false);
  };

  return {
    isModalOpen,
    hasUserDismissedModal,
    setIsModalOpen,
    setHasUserDismissedModal,
    handleModalClose,
    handleModalSave,
  };
};
