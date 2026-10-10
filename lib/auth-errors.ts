type SignInMethod = "password" | "magic-link";

/** Use documented Auth codes, never provider messages that may contain account details. */
export function authErrorMessage(error: unknown, method: SignInMethod): string {
  const code = error && typeof error === "object" && "code" in error && typeof error.code === "string"
    ? error.code
    : undefined;

  switch (code) {
    case "invalid_credentials":
      return method === "password"
        ? "The email or password is incorrect. Check your existing account credentials and try again."
        : "Check your existing account email, or sign in with your password.";
    case "email_not_confirmed":
      return "Confirm your email address using your account confirmation email before signing in.";
    case "email_address_not_authorized":
      return "Email delivery is restricted for this address. Sign in with your password, or ask the site owner to check the email delivery settings.";
    case "over_email_send_rate_limit":
      return "Too many sign-in emails have been requested. Wait before requesting another link, or sign in with your password.";
    case "over_request_rate_limit":
      return "Too many sign-in attempts. Wait a few minutes before trying again.";
    case "signup_disabled":
      return "Use your existing account email. New accounts cannot be created here; you can also sign in with your password.";
    case "otp_disabled":
      return "Email sign-in links are disabled. Sign in with your password.";
    default:
      return method === "magic-link"
        ? "Unable to send a sign-in link. Try signing in with your password, or try again later."
        : "Sign-in is temporarily unavailable. Please try again later.";
  }
}
