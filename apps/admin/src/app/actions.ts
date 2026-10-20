"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { COOKIE, credentials, issueToken, SESSION_SECONDS, safeEqual } from "@/lib/auth";

export interface LoginState {
  error: "config" | "password" | null;
}

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const creds = credentials(process.env);
  if (!creds) return { error: "config" };
  const given = String(formData.get("password") ?? "");
  if (!safeEqual(given, creds.password)) return { error: "password" };
  const jar = await cookies();
  jar.set(COOKIE, await issueToken(creds.secret), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_SECONDS,
  });
  redirect("/");
}

export async function logout() {
  const jar = await cookies();
  jar.delete(COOKIE);
  redirect("/login");
}
