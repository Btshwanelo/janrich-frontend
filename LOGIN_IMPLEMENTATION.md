# Login Implementation with Redux Toolkit

## Overview
The login page has been successfully integrated with Redux Toolkit for state management and API calls.

## Key Features Implemented

### 1. **Redux Integration**
- Connected to Redux store using `useAppDispatch` and `useAppSelector`
- Integrated with authentication slice for state management
- Real-time loading states and error handling

### 2. **API Integration**
- Uses `useLoginMutation` hook from RTK Query
- Automatic API call to `https://app-staging.janriches.com/api/method/janriches.api.auth.jan_user_login`
- Proper error handling with user-friendly messages

### 3. **State Management**
- **Loading States**: Button shows "Signing in..." during API call
- **Error Handling**: Displays error messages in a red alert box
- **Authentication**: Automatically redirects to dashboard on successful login
- **Session Management**: Stores user credentials in Redux store

### 4. **User Experience**
- Form validation using Formik and Yup
- Real-time error display
- Loading indicators
- Automatic redirect on successful authentication
- Prevents multiple submissions during loading

## Code Structure

### Redux State
```typescript
// Auth state from Redux store
const { isAuthenticated, isLoading, error } = useAppSelector((state) => state.auth);
const [login, { isLoading: isLoginLoading }] = useLoginMutation();
```

### Login Handler
```typescript
const handleSubmit = async (values, { setSubmitting }) => {
  try {
    dispatch(setLoading(true));
    dispatch(setError(null));
    
    const result = await login({
      email: values.email,
      password: values.password,
    }).unwrap();

    // Store credentials in Redux
    dispatch(setCredentials({
      user: result.message.user,
      sid: result.message.sid,
      fullName: result.full_name,
      homePage: result.home_page,
    }));

    // Redirect to dashboard
    router.push("/dashboard");
  } catch (error) {
    // Handle errors with user-friendly messages
    dispatch(setError(errorMessage));
  } finally {
    dispatch(setLoading(false));
    setSubmitting(false);
  }
};
```

### Error Handling
- **401 Unauthorized**: "Invalid email or password."
- **500 Server Error**: "Server error. Please try again later."
- **API Error Messages**: Displays server-provided error messages
- **Generic Fallback**: "Login failed. Please try again."

## API Endpoint
- **URL**: `https://app-staging.janriches.com/api/method/janriches.api.auth.jan_user_login`
- **Method**: POST
- **Headers**: 
  - Authorization: `token 2980b929194a37f:90f932cf10994d7`
  - Content-Type: `application/json`
- **Body**: `{ email: string, password: string }`

## Expected Response
```json
{
  "message": {
    "success": true,
    "user": "mike@xyz.com",
    "sid": "bc296728993527dc9ee1f3eb36904be273f9232a5cfd1c02d86ce2e6"
  },
  "home_page": "/me",
  "full_name": "Mike Bucibo"
}
```

## Testing
To test the login functionality:

1. Start the development server: `npm run dev`
2. Navigate to `/login`
3. Enter valid credentials:
   - Email: `mike@xyz.com`
   - Password: `Tshw@nelo`
4. Click "Sign in"
5. Should redirect to `/dashboard` on success

## Error Scenarios
- Invalid credentials will show "Invalid email or password."
- Network errors will show "Login failed. Please try again."
- Server errors will show "Server error. Please try again later."

## Next Steps
- Implement logout functionality
- Add session persistence
- Implement register page with Redux
- Add onboarding flow integration
