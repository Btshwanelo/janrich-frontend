# Toast Component Usage Guide

## Overview
The Toast component provides a flexible notification system for displaying success, error, warning, and info messages to users.

## Setup
The ToastProvider is already added to your app layout, so you can use toasts anywhere in your application.

## Basic Usage

### Import the hooks
```tsx
import { useSuccessToast, useErrorToast, useWarningToast, useInfoToast } from "@/components/base/toast";
```

### Using Success Toast
```tsx
const MyComponent = () => {
  const showSuccessToast = useSuccessToast();

  const handleSuccess = () => {
    showSuccessToast("Success!", "Your action was completed successfully.");
  };

  return <button onClick={handleSuccess}>Show Success</button>;
};
```

### Using Error Toast
```tsx
const MyComponent = () => {
  const showErrorToast = useErrorToast();

  const handleError = () => {
    showErrorToast("Error occurred", "Something went wrong. Please try again.");
  };

  return <button onClick={handleError}>Show Error</button>;
};
```

### Using Warning Toast
```tsx
const MyComponent = () => {
  const showWarningToast = useWarningToast();

  const handleWarning = () => {
    showWarningToast("Warning", "Please review your information before proceeding.");
  };

  return <button onClick={handleWarning}>Show Warning</button>;
};
```

### Using Info Toast
```tsx
const MyComponent = () => {
  const showInfoToast = useInfoToast();

  const handleInfo = () => {
    showInfoToast("Information", "Here's some helpful information for you.");
  };

  return <button onClick={handleInfo}>Show Info</button>;
};
```

## Advanced Usage

### Toast with Action Button
```tsx
const showSuccessToast = useSuccessToast();

showSuccessToast(
  "File uploaded successfully!",
  "Your document has been processed.",
  {
    action: {
      label: "View File",
      onClick: () => router.push("/files"),
    },
  }
);
```

### Toast with Custom Duration
```tsx
const showErrorToast = useErrorToast();

showErrorToast(
  "Critical Error",
  "This error requires immediate attention.",
  {
    duration: 0, // Don't auto-dismiss (user must close manually)
  }
);
```

### Toast with Short Duration
```tsx
const showSuccessToast = useSuccessToast();

showSuccessToast(
  "Quick Success",
  "Action completed.",
  {
    duration: 2000, // Auto-dismiss after 2 seconds
  }
);
```

## Toast Types and Styling

### Success Toast
- **Icon**: Green checkmark
- **Border**: Green left border
- **Use case**: Successful operations, confirmations

### Error Toast
- **Icon**: Red alert circle
- **Border**: Red left border
- **Use case**: Errors, failures, critical issues

### Warning Toast
- **Icon**: Yellow warning triangle
- **Border**: Yellow left border
- **Use case**: Warnings, important notices

### Info Toast
- **Icon**: Blue info circle
- **Border**: Blue left border
- **Use case**: General information, tips

## Toast Options

```tsx
interface Toast {
  id: string;                    // Auto-generated
  type: "success" | "error" | "warning" | "info";
  title: string;                 // Required: Main message
  description?: string;          // Optional: Additional details
  duration?: number;             // Optional: Auto-dismiss time (default: 5000ms, 0 = no auto-dismiss)
  action?: {                     // Optional: Action button
    label: string;
    onClick: () => void;
  };
}
```

## Real-world Examples

### Form Submission Success
```tsx
const handleSubmit = async (formData) => {
  try {
    await submitForm(formData);
    showSuccessToast(
      "Form submitted successfully!",
      "We'll review your information and get back to you soon.",
      {
        action: {
          label: "View Status",
          onClick: () => router.push("/status"),
        },
      }
    );
  } catch (error) {
    showErrorToast(
      "Submission failed",
      "Please check your information and try again.",
      {
        duration: 0, // Keep visible until user dismisses
      }
    );
  }
};
```

### API Call Success
```tsx
const handleSave = async () => {
  try {
    await saveData();
    showSuccessToast("Saved!", "Your changes have been saved successfully.");
  } catch (error) {
    showErrorToast("Save failed", "Unable to save your changes. Please try again.");
  }
};
```

### File Upload
```tsx
const handleFileUpload = async (file) => {
  try {
    const result = await uploadFile(file);
    showSuccessToast(
      "File uploaded!",
      `${file.name} has been uploaded successfully.`,
      {
        action: {
          label: "View File",
          onClick: () => openFile(result.id),
        },
      }
    );
  } catch (error) {
    showErrorToast(
      "Upload failed",
      "Unable to upload the file. Please try again.",
      {
        duration: 0,
        action: {
          label: "Retry",
          onClick: () => handleFileUpload(file),
        },
      }
    );
  }
};
```

## Best Practices

1. **Keep titles concise** - Use clear, action-oriented titles
2. **Provide helpful descriptions** - Add context when needed
3. **Use appropriate durations** - Critical errors should not auto-dismiss
4. **Include action buttons** - For important toasts that require user action
5. **Don't overuse** - Too many toasts can overwhelm users
6. **Be consistent** - Use the same toast types for similar actions across your app

## Accessibility

- Toasts are positioned in the top-right corner
- They include proper ARIA labels and semantic markup
- Users can dismiss toasts manually with the X button
- Auto-dismiss timing can be customized or disabled
