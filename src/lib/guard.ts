import { NextResponse } from "next/server";
import { getSession, type Role, type SessionPayload } from "@/lib/auth";

/**
 * Use inside API routes. Returns the session if the user has one of the allowed
 * roles, otherwise returns a NextResponse you should immediately return.
 */
export async function requireRole(
  ...roles: Role[]
): Promise<{ session: SessionPayload } | { response: NextResponse }> {
  const session = await getSession();
  if (!session) {
    return { response: NextResponse.json({ error: "Not authenticated." }, { status: 401 }) };
  }
  if (roles.length && !roles.includes(session.role)) {
    return { response: NextResponse.json({ error: "Forbidden." }, { status: 403 }) };
  }
  return { session };
}
