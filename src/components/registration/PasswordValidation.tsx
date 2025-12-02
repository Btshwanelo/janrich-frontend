import React from "react";

interface PasswordValidationProps {
  password: string;
  confirmPassword: string;
}

export const PasswordValidation: React.FC<PasswordValidationProps> = ({
  password,
  confirmPassword,
}) => {
  const checks = [
    {
      test: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      message: "Password should include at least 1 special character",
    },
    {
      test: password.length >= 8,
      message: "Password should be at least 8 characters",
    },
    {
      test: password === confirmPassword && password.length > 0,
      message: "Password should match",
    },
  ];

  return (
    <div className="space-y-2">
      {checks.map((check, index) => (
        <div key={index} className="flex items-center gap-2">
          {check.test ? (
            <img
              src={check.test ? "/checked.svg" : "/check.svg"}
              alt={check.test ? "Valid" : "Invalid"}
              className="w-4 h-4"
            />
          ) : null}
          <p className="text-xs text-[#535862]">{check.message}</p>
        </div>
      ))}
    </div>
  );
};
