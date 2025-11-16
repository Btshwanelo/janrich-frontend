import {
  BaseQueryApi,
  createApi,
  FetchArgs,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";

const API_BASE_URL = "https://app-staging.janriches.com/api/method";

const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    // Get auth state from Redux store
    const state = getState() as {
      auth: { sid?: string; fullName?: string; user?: string };
    };
    const authState = state.auth;

    // Set common headers
    headers.set("Authorization", "token 2980b929194a37f:4b19e7f2d5d5441");
    headers.set("Content-Type", "application/json");

    // Add session cookie if available
    if (authState.sid) {
      headers.set(
        "Cookie",
        `full_name=${encodeURIComponent(authState.fullName || "")}; sid=${
          authState.sid
        }; system_user=no; user_id=${authState.user || ""}; user_image=`
      );
    }

    return headers;
  },
});

export const baseQueryWithTransform = async (
  args: string | FetchArgs,
  api: BaseQueryApi,
  extraOptions: {}
) => {
  const result = await baseQuery(args, api, extraOptions);
  // Handle HTTP errors
  if (result.error) {
    return { error: result.error };
  }

  const data: any = result.data;

  console.log("data", data);
  // Handle API-level errors (when isSuccess is false)
  if (data?.message.result === "failed") {
    return {
      error: data?.message.message,
    };
  }

  // Return successful data from outputParameters
  return {
    data,
  };
};
export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithTransform,
  tagTypes: ["Auth", "Onboarding"],
  endpoints: () => ({}),
});
