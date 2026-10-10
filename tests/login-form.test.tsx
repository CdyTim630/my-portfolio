import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import LoginForm from "@/components/LoginForm";

const { push, refresh, signInWithPassword, signInWithOtp } = vi.hoisted(() => ({
  push: vi.fn(), refresh: vi.fn(), signInWithPassword: vi.fn(), signInWithOtp: vi.fn(),
}));
vi.mock("next/navigation", () => ({ useRouter: () => ({ push, refresh }) }));
vi.mock("@/lib/supabase/client", () => ({ createClient: () => ({ auth: { signInWithPassword, signInWithOtp } }) }));

beforeEach(() => { localStorage.clear(); vi.resetAllMocks(); });

describe("administrator login choices", () => {
  it("offers a native local-session form without collecting unused credentials", () => {
    render(<LoginForm configured={false} localAvailable initialMessage="" />);
    const entry = screen.getByRole("button", { name: "進入本機後台" });
    expect(entry.closest("form")).toHaveAttribute("action", "/api/local-admin/session");
    expect(entry.closest("form")).toHaveAttribute("method", "post");
    expect(screen.getByText(/修改儲存在這台電腦/)).toBeVisible();
    expect(screen.queryByLabelText("Email")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Password")).not.toBeInTheDocument();
    expect(screen.queryByText(/Sign-in is unavailable/)).not.toBeInTheDocument();
  });

  it("does not invent a local entry when it is unavailable", () => {
    render(<LoginForm configured={false} initialMessage="" />);
    expect(screen.queryByRole("button", { name: "進入本機後台" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sign in" })).toBeDisabled();
    expect(screen.getByRole("status")).toHaveTextContent("Sign-in is unavailable");
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "owner@example.com" } });
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "test-password" } });
    fireEvent.submit(screen.getByRole("button", { name: "Sign in" }).closest("form")!);
    expect(signInWithPassword).not.toHaveBeenCalled();
  });

  it("preserves Supabase password login for a configured site", async () => {
    signInWithPassword.mockResolvedValue({ error: null });
    render(<LoginForm configured initialMessage="" />);
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: " owner@example.com " } });
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: " test-password " } });
    fireEvent.submit(screen.getByRole("button", { name: "Sign in" }).closest("form")!);
    await waitFor(() => expect(push).toHaveBeenCalledWith("/admin"));
    expect(signInWithPassword).toHaveBeenCalledWith({ email: "owner@example.com", password: " test-password " });
    expect(refresh).toHaveBeenCalledOnce();
    expect(screen.queryByRole("button", { name: "進入本機後台" })).not.toBeInTheDocument();
  });

  it("sends an existing-account link with the callback URL and same-browser guidance", async () => {
    signInWithOtp.mockResolvedValue({ error: null });
    render(<LoginForm configured initialMessage="" />);
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: " owner@example.com " } });
    fireEvent.click(screen.getByRole("button", { name: "Email a sign-in link" }));
    await waitFor(() => expect(screen.getByRole("status")).toHaveTextContent("Open it in this browser"));
    expect(signInWithOtp).toHaveBeenCalledWith({
      email: "owner@example.com",
      options: { shouldCreateUser: false, emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
    expect(push).not.toHaveBeenCalled();
  });

  it("explains restricted email delivery without revealing the provider message", async () => {
    signInWithOtp.mockResolvedValue({ error: { code: "email_address_not_authorized", message: "private provider detail" } });
    render(<LoginForm configured initialMessage="" />);
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "owner@example.com" } });
    fireEvent.click(screen.getByRole("button", { name: "Email a sign-in link" }));
    await waitFor(() => expect(screen.getByRole("status")).toHaveTextContent("Email delivery is restricted"));
    expect(screen.getByRole("status")).toHaveTextContent("Sign in with your password");
    expect(screen.queryByText(/private provider detail/)).not.toBeInTheDocument();
    expect(push).not.toHaveBeenCalled();
  });

  it("blocks repeated and competing actions while a link is being sent, then allows retry", async () => {
    let finish!: (result: { error: { code: string } }) => void;
    signInWithOtp.mockReturnValueOnce(new Promise((resolve) => { finish = resolve; }));
    render(<LoginForm configured initialMessage="" />);
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "owner@example.com" } });
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "test-password" } });
    const linkButton = screen.getByRole("button", { name: "Email a sign-in link" });
    const form = screen.getByRole("button", { name: "Sign in" }).closest("form")!;
    act(() => {
      fireEvent.click(linkButton);
      fireEvent.click(linkButton);
      fireEvent.submit(form);
    });
    expect(signInWithOtp).toHaveBeenCalledOnce();
    expect(signInWithPassword).not.toHaveBeenCalled();
    expect(linkButton).toBeDisabled();
    await act(async () => { finish({ error: { code: "over_email_send_rate_limit" } }); });
    expect(screen.getByRole("status")).toHaveTextContent("Wait before requesting another link");
    expect(linkButton).toBeEnabled();
    signInWithOtp.mockResolvedValueOnce({ error: null });
    fireEvent.click(linkButton);
    await waitFor(() => expect(screen.getByRole("status")).toHaveTextContent("check your email"));
    expect(signInWithOtp).toHaveBeenCalledTimes(2);
  });

  it("blocks duplicate password submissions and reports invalid credentials without navigation", async () => {
    let finish!: (result: { error: { code: string } }) => void;
    signInWithPassword.mockReturnValueOnce(new Promise((resolve) => { finish = resolve; }));
    render(<LoginForm configured initialMessage="" />);
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "owner@example.com" } });
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "test-password" } });
    const form = screen.getByRole("button", { name: "Sign in" }).closest("form")!;
    act(() => {
      fireEvent.submit(form);
      fireEvent.submit(form);
      fireEvent.click(screen.getByRole("button", { name: "Email a sign-in link" }));
    });
    expect(signInWithPassword).toHaveBeenCalledOnce();
    expect(signInWithOtp).not.toHaveBeenCalled();
    await act(async () => { finish({ error: { code: "invalid_credentials" } }); });
    expect(screen.getByRole("status")).toHaveTextContent("The email or password is incorrect");
    expect(push).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "Sign in" })).toBeEnabled();
  });

  it("recovers from a thrown network error without showing its raw message", async () => {
    signInWithOtp.mockRejectedValue(new Error("private network detail"));
    render(<LoginForm configured initialMessage="" />);
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "owner@example.com" } });
    fireEvent.click(screen.getByRole("button", { name: "Email a sign-in link" }));
    await waitFor(() => expect(screen.getByRole("status")).toHaveTextContent("Try signing in with your password"));
    expect(screen.queryByText(/private network detail/)).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Email a sign-in link" })).toBeEnabled();
  });
});
