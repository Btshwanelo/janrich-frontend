/**
 * Extracts error message from various error formats (RTK Query, standard errors, etc.)
 * @param error - The error object or string
 * @param fallback - Default message if error cannot be extracted
 * @returns A user-friendly error message
 */
export const extractErrorMessage = (
  error: unknown,
  fallback: string = "An error occurred"
): string => {
  if (typeof error === "string") {
    return error;
  }

  if (error && typeof error === "object") {
    const err = error as Record<string, any>;
    return (
      err?.data?.message?.message ||
      err?.data?.message ||
      err?.data?.error ||
      err?.message ||
      err?.error ||
      fallback
    );
  }

  return fallback;
};

