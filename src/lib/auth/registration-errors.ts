export function registrationErrorCode(error: {
  code?: string;
  status?: number;
}) {
  if (
    error.status === 429 ||
    ["over_request_rate_limit", "over_email_send_rate_limit"].includes(
      error.code ?? "",
    )
  )
    return "rate-limit";
  if (error.code === "weak_password") return "password";
  if (error.code === "email_address_invalid") return "email";
  if (["user_already_exists", "email_exists"].includes(error.code ?? ""))
    return "account";
  return "auth";
}

export function registrationErrorMessage(code: string) {
  switch (code) {
    case "validation":
      return "Check the required fields and make sure your passwords match.";
    case "password":
      return "Choose a stronger password with at least 8 characters, including letters and numbers.";
    case "email":
      return "Check your email address and try again.";
    case "rate-limit":
      return "Too many attempts. Please wait a few minutes before trying again.";
    case "account":
      return "We couldn't finish registration with these details. Try signing in or resetting your password.";
    default:
      return "We couldn't finish creating your account. Please try again. If you already submitted this form, try signing in.";
  }
}
