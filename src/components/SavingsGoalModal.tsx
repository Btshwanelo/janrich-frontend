"use client";

import React, { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/base/buttons/button";
import { Slider } from "@/components/base/slider/slider";
import {
  ModalOverlay,
  Modal,
  Dialog,
} from "@/components/application/modals/modal";

interface SavingsGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (amount: number) => void;
  title?: string;
  minAmount?: number;
  maxAmount?: number;
  defaultAmount?: number;
  step?: number;
  currency?: string;
  buttonText?: string;
  cardTitle?: string;
  cardImage?: string;
  cardImageAlt?: string;
}

export default function SavingsGoalModal({
  isOpen,
  onClose,
  onSave,
  title = "How much do you want to save?",
  minAmount = 3000,
  maxAmount = 100000,
  defaultAmount = 1000,
  step = 500,
  currency = "R",
  buttonText = "Start Paying yourself first",
  cardTitle = "Great Start! You don't need a million to change your life",
  cardImage = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&h=300&fit=crop",
  cardImageAlt = "Professional woman",
}: SavingsGoalModalProps) {
  const [amount, setAmount] = useState([defaultAmount]);

  const formatCurrency = (value: number) => {
    return `${currency} ${value.toLocaleString()}`;
  };

  const handleSubmit = () => {
    console.log("Selected amount:", amount[0]);
    if (onSave) {
      onSave(amount[0]);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay isOpen={isOpen} onOpenChange={onClose}>
      <Modal>
        <Dialog className="bg-white rounded-2xl p-6 w-full mx-auto max-w-[400px] flex flex-col relative">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-md font-semibold text-gray-900">{title}</h2>
          </div>

          <div className="space-y-6 mx-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-500 mb-6">
                {formatCurrency(amount[0])}
              </div>

              <div className="flex justify-between text-sm text-text mb-4 px-1">
                <span>{formatCurrency(minAmount)}</span>
                <span>{formatCurrency(maxAmount)}</span>
              </div>

              <Slider
                value={amount}
                onChange={(value) =>
                  setAmount(Array.isArray(value) ? value : [value])
                }
                minValue={minAmount}
                maxValue={maxAmount}
                step={step}
                labelFormatter={(value) => formatCurrency(value)}
                className="mb-6 w-full"
              />
            </div>

            <div className=" border border-border-inactive rounded-lg p-4">
              <h3 className="text-base font-semibold text-gray-900 mb-4">
                {cardTitle}
              </h3>

              <div className="w-full">
                <img
                  src={cardImage}
                  alt={cardImageAlt}
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
            </div>

            <Button
              onClick={handleSubmit}
              color="primary"
              size="lg"
              className="w-full"
            >
              {buttonText}
            </Button>
          </div>
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
}
