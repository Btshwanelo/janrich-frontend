import { useCallback } from "react";

/**
 * Hook for managing field navigation (focusing next field on Enter key)
 * @param fieldRefs - Array of refs to form fields in order
 * @returns Object with focusNextField function
 */
export const useFieldNavigation = (
  fieldRefs: React.RefObject<HTMLInputElement | null>[]
) => {
  const focusNextField = useCallback(
    (currentField: React.RefObject<HTMLInputElement | null>) => {
      const currentIndex = fieldRefs.findIndex((ref) => ref === currentField);
      if (currentIndex < fieldRefs.length - 1) {
        fieldRefs[currentIndex + 1].current?.focus();
      }
    },
    [fieldRefs]
  );

  return { focusNextField };
};

