// Shared auth helpers for edge functions.
// All functions run with verify_jwt = false, so each one must check the caller itself.

import { createClient, type SupabaseClient, type User } from "https://esm.sh/@supabase/supabase-js@2.93.2";

export class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

export interface AuthContext {
  user: User;
  isAdmin: boolean;
  // Service-role client: bypasses RLS, only use after the caller has been checked
  admin: SupabaseClient;
}

// Resolves the calling user from the Authorization header and looks up their role.
export async function getCaller(req: Request): Promise<AuthContext> {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    throw new HttpError(401, "Unauthorized");
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const admin = createClient(supabaseUrl, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

  const token = authHeader.slice("Bearer ".length);
  const { data: { user }, error } = await admin.auth.getUser(token);
  if (error || !user) {
    throw new HttpError(401, "Unauthorized");
  }

  const { data: roles } = await admin
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id);
  const isAdmin = (roles || []).some((r: { role: string }) => r.role === "admin");

  return { user, isAdmin, admin };
}

export async function requireAdmin(req: Request): Promise<AuthContext> {
  const ctx = await getCaller(req);
  if (!ctx.isAdmin) {
    throw new HttpError(403, "Admin access required");
  }
  return ctx;
}

export function errorStatus(error: unknown): number {
  return error instanceof HttpError ? error.status : 500;
}

export function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
