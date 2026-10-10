import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import LoginForm from "@/components/LoginForm";

const { push, refresh, signInWithPassword } = vi.hoisted(() => ({
  push: vi.fn(), refresh: vi.fn(), signInWithPassword: vi.fn(),
}));
vi.mock("next/navigation", () => ({ useRouter: () => ({ push, refresh }) }));
vi.mock("@/lib/supabase/client", () => ({ createClient: () => ({ auth: { signInWithPassword } }) }));

beforeEach(() => localStorage.clear());

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
  });

  it("preserves Supabase password login for a configured site", async () => {
    signInWithPassword.mockResolvedValue({ error: null });
    render(<LoginForm configured initialMessage="" />);
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "owner@example.com" } });
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "test-password" } });
    fireEvent.submit(screen.getByRole("button", { name: "Sign in" }).closest("form")!);
    await waitFor(() => expect(push).toHaveBeenCalledWith("/admin"));
    expect(signInWithPassword).toHaveBeenCalledWith({ email: "owner@example.com", password: "test-password" });
    expect(refresh).toHaveBeenCalledOnce();
    expect(screen.queryByRole("button", { name: "進入本機後台" })).not.toBeInTheDocument();
  });
});
