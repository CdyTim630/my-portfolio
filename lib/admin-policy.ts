/** Never authorize using user_metadata: authenticated users can edit it. */
export function isAdminUser(user: { app_metadata?: Record<string, unknown> } | null | undefined): boolean {
  return user?.app_metadata?.portfolio_admin === true;
}
