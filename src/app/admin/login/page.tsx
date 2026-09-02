"use client";

import { Suspense } from "react";
import { useActionState } from "react";
import { useSearchParams } from "next/navigation";

import { login } from "./actions";

function LoginForm() {
  const params = useSearchParams();
  const next = params.get("next") ?? "/admin";
  const [state, formAction, pending] = useActionState(login, undefined);

  return (
    <form action={formAction} className="space-y-3">
      <input type="hidden" name="next" value={next} />
      <input
        type="password"
        name="password"
        autoFocus
        autoComplete="current-password"
        placeholder="รหัสผ่าน"
        className="w-full rounded-xl border border-brand-200 bg-surface px-4 py-3 text-sm outline-none focus:border-brand-400"
      />
      {state?.error ? <p className="text-sm text-red-600">{state.error}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-700 disabled:opacity-60"
      >
        {pending ? "กำลังเข้าสู่ระบบ…" : "เข้าสู่ระบบ"}
      </button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center px-4">
      <h1 className="mb-1 text-2xl font-extrabold text-ink">เข้าสู่ระบบ admin</h1>
      <p className="mb-6 text-sm text-muted">JMarket — จัดการร้านอาหารเจ</p>
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
