import { NextResponse } from "next/server";

/**
 * Utility function to handle API errors consistently across all routes
 * @param error - The error object caught from the API request
 * @returns NextResponse with proper error JSON and status code
 */
export function handleApiError(error: unknown): NextResponse {
  console.error("API Route Error:", error);

  // Safely extract error information
  const errorFromApi = error instanceof Error ? error.cause : undefined;
  console.error("API Error Details:", errorFromApi);

  // Extract status from error message (e.g., "HTTP error! status: 404")
  let statusFromErrorMessage: number | undefined;
  if (error instanceof Error && error.message) {
    const statusMatch = error.message.match(/status:\s*(\d+)/);
    if (statusMatch) {
      statusFromErrorMessage = parseInt(statusMatch[1], 10);
    }
  }

  // Safely parse the error response
  let errorJson: unknown;
  try {
    if (typeof errorFromApi === "string" && errorFromApi.trim()) {
      errorJson = JSON.parse(errorFromApi);
    } else {
      errorJson = errorFromApi || {};
    }
  } catch (parseError) {
    console.error("Failed to parse error response:", parseError);
    // Use status from error message if available
    const status = statusFromErrorMessage || 500;
    errorJson = {
      error: status === 404 ? "Not Found" : "Internal Server Error",
      message:
        typeof errorFromApi === "string" ? errorFromApi : "An error occurred",
      timestamp: Date.now(),
    };
  }

  const getStatusFrom = (obj: unknown): number | undefined =>
    typeof obj === "object" &&
    obj !== null &&
    "status" in obj &&
    typeof (obj as { status: unknown }).status === "number"
      ? (obj as { status: number }).status
      : undefined;

  // Extract status: prioritize status from error message, then from error objects, default to 500
  const status =
    statusFromErrorMessage ??
    getStatusFrom(error) ??
    getStatusFrom(errorJson) ??
    500;

  // Ensure we have a proper error response
  if (!errorJson || typeof errorJson !== "object") {
    errorJson = {
      error: status === 404 ? "Not Found" : "Internal Server Error",
      message: "An unexpected error occurred",
      status: status,
      timestamp: Date.now(),
    };
  }

  return NextResponse.json(errorJson, { status });
}

/**
 * Higher-order function to wrap API route handlers with consistent error handling
 * @param handler - The API route handler function
 * @returns Wrapped handler with error handling
 */
export function withErrorHandler<T extends unknown[]>(
  handler: (...args: T) => Promise<NextResponse>
) {
  return async (...args: T): Promise<NextResponse> => {
    try {
      return await handler(...args);
    } catch (error) {
      return handleApiError(error);
    }
  };
}
