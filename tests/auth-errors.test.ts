import { describe, expect, it } from "vitest";
import { authErrorMessage } from "@/lib/auth-errors";

describe("safe authentication error messages", () => {
  it.each([
    ["invalid_credentials", "Check your existing account email"],
    ["email_not_confirmed", "Confirm your email address"],
    ["email_address_not_authorized", "Email delivery is restricted"],
    ["over_email_send_rate_limit", "Wait before requesting another link"],
    ["over_request_rate_limit", "Wait a few minutes"],
    ["signup_disabled", "New accounts cannot be created here"],
    ["otp_disabled", "Email sign-in links are disabled"],
  ])("gives actionable guidance for %s without exposing provider details", (code, guidance) => {
    const message = authErrorMessage({ code, message: "private account or provider detail" }, "magic-link");
    expect(message).toContain(guidance);
    expect(message).not.toContain("private account or provider detail");
  });

  it("distinguishes password failure from link-delivery failure", () => {
    expect(authErrorMessage({ code: "invalid_credentials" }, "password")).toContain("email or password is incorrect");
    expect(authErrorMessage({ code: "unexpected_failure" }, "password")).toContain("Sign-in is temporarily unavailable");
    expect(authErrorMessage({ code: "unexpected_failure" }, "magic-link")).toContain("Try signing in with your password");
  });

  it.each([null, undefined, "private provider detail", new Error("private provider detail"), { code: 400, message: "private provider detail" }, { code: "unknown_code", message: "private provider detail" }])("keeps unknown error details private", (error) => {
    expect(authErrorMessage(error, "magic-link")).toBe("Unable to send a sign-in link. Try signing in with your password, or try again later.");
  });
});
