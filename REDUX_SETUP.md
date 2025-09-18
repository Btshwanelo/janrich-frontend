# Redux Toolkit Setup

This project uses Redux Toolkit for state management and API queries.

## Structure

```
src/
├── lib/
│   ├── store.ts                 # Redux store configuration
│   ├── hooks.ts                 # Typed Redux hooks
│   ├── api/
│   │   ├── apiSlice.ts         # Base API slice with authentication
│   │   ├── types.ts            # Common API types
│   │   └── example-usage.tsx   # Usage examples
│   └── slices/
│       ├── authSlice.ts        # Authentication slice
│       └── onboardingSlice.ts  # Onboarding slice
└── components/
    └── ReduxProvider.tsx       # Redux Provider wrapper
```

## Available API Endpoints

### Authentication
- **Login**: `useLoginMutation()` - Login with email and password
- **Register**: `useRegisterMutation()` - Register new user

### Onboarding
- **Complete Onboarding**: `useCompleteOnboardingMutation()` - Complete user profile

## Usage Examples

### Using Authentication Hooks

```tsx
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { useLoginMutation } from '@/lib/slices/authSlice';
import { setCredentials } from '@/lib/slices/authSlice';

function LoginComponent() {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const [login, { isLoading }] = useLoginMutation();

  const handleLogin = async (email: string, password: string) => {
    try {
      const result = await login({ email, password }).unwrap();
      dispatch(setCredentials({
        user: result.message.user,
        sid: result.message.sid,
        fullName: result.full_name,
        homePage: result.home_page,
      }));
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div>
      {isAuthenticated ? (
        <p>Welcome, {user}!</p>
      ) : (
        <button onClick={() => handleLogin('user@example.com', 'password')}>
          Login
        </button>
      )}
    </div>
  );
}
```

### Using Onboarding Hooks

```tsx
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { useCompleteOnboardingMutation } from '@/lib/slices/onboardingSlice';
import { setOnboardingData } from '@/lib/slices/onboardingSlice';

function OnboardingComponent() {
  const dispatch = useAppDispatch();
  const { customerId, isCompleted } = useAppSelector((state) => state.onboarding);
  const [completeOnboarding, { isLoading }] = useCompleteOnboardingMutation();

  const handleCompleteOnboarding = async (data: OnboardingData) => {
    try {
      const result = await completeOnboarding(data).unwrap();
      dispatch(setOnboardingData({
        customerId: result.message.customer_id,
        customer: result.message.customer,
        age: result.message.age,
      }));
    } catch (error) {
      console.error('Onboarding failed:', error);
    }
  };

  return (
    <div>
      {isCompleted ? (
        <p>Onboarding completed for customer: {customerId}</p>
      ) : (
        <button onClick={() => handleCompleteOnboarding(onboardingData)}>
          Complete Onboarding
        </button>
      )}
    </div>
  );
}
```

## State Management

### Auth State
- `user`: Current user email
- `sid`: Session ID
- `fullName`: User's full name
- `homePage`: User's home page
- `isAuthenticated`: Authentication status
- `isLoading`: Loading state
- `error`: Error message

### Onboarding State
- `customerId`: Customer ID
- `customer`: Customer name
- `age`: User's age
- `isCompleted`: Onboarding completion status
- `isLoading`: Loading state
- `error`: Error message

## API Configuration

The base API URL is set to `https://app-staging.janriches.com/api/method` and includes:
- Authorization token in headers
- Content-Type: application/json
- Session cookies when authenticated

## Redux DevTools

Redux DevTools are enabled in development mode for debugging state changes and API calls.
