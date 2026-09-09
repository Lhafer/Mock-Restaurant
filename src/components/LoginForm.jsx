import { useState } from "react";
import { supabase } from "../../supabase";

export default function LoginForm({ error, onError }) {
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    onError(null);
    const { email, password } = event.target.elements;
    const { error: loginError } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    });
    if (loginError) onError(loginError.message);
    setSubmitting(false);
  };

  return (
    <main className="mx-auto w-[min(100%-2rem,420px)] pt-[15vh]">
      <p className="mb-[0.45rem] font-sans text-[0.72rem] font-bold uppercase tracking-[0.08em] text-[#a14f35]">
        Restaurant admin
      </p>
      <h1 className="mb-0 text-[clamp(2rem,5vw,3.5rem)]">
        Sign in to manage your menu
      </h1>
      <form className="mt-6 grid gap-3.5" onSubmit={handleSubmit}>
        <label className="grid gap-1.5 text-[0.9rem]">
          Email
          <input
            className="w-full rounded border border-[#c9c0b2] bg-[#fffdf9] p-[0.7rem]"
            name="email"
            type="email"
            required
            autoComplete="email"
          />
        </label>
        <label className="grid gap-1.5 text-[0.9rem]">
          Password
          <input
            className="w-full rounded border border-[#c9c0b2] bg-[#fffdf9] p-[0.7rem]"
            name="password"
            type="password"
            required
            autoComplete="current-password"
          />
        </label>
        <button
          className="rounded bg-[#2d5548] px-4 py-[0.7rem] text-white enabled:cursor-pointer disabled:cursor-wait disabled:opacity-55"
          type="submit"
          disabled={submitting}
        >
          {submitting ? "Signing in..." : "Sign in"}
        </button>
      </form>
      {error && (
        <p className="my-4 border-l-[3px] border-[#a14f35] bg-[#f5ddd4] p-3 text-[#7d3021]">
          {error}
        </p>
      )}
    </main>
  );
}
