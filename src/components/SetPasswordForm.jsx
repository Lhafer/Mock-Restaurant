import { useState } from "react";
import { supabase } from "../../supabase";

export default function SetPasswordForm({ error, onComplete, onError }) {
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { password, confirmPassword } = event.target.elements;
    if (password.value.length < 8) {
      onError("Password must be at least 8 characters.");
      return;
    }
    if (password.value !== confirmPassword.value) {
      onError("Passwords do not match.");
      return;
    }
    setSubmitting(true);
    onError(null);
    const { error } = await supabase.auth.updateUser({
      password: password.value,
    });
    if (error) onError(error.message);
    else {
      window.history.replaceState({}, document.title, window.location.pathname);
      onComplete();
    }
    setSubmitting(false);
  };

  return (
    <main className="mx-auto w-[min(100%-2rem,420px)] pt-[15vh]">
      <p className="mb-[0.45rem] font-sans text-[0.72rem] font-bold uppercase tracking-[0.08em] text-[#a14f35]">
        Worker invitation
      </p>
      <h1 className="mb-0 text-[clamp(2rem,5vw,3.5rem)]">
        Create your password
      </h1>
      <form className="mt-6 grid gap-3.5" onSubmit={handleSubmit}>
        <label className="grid gap-1.5 text-[0.9rem]">
          Password
          <input
            className="w-full rounded border border-[#c9c0b2] bg-[#fffdf9] p-[0.7rem]"
            name="password"
            type="password"
            minLength="8"
            required
            autoComplete="new-password"
          />
        </label>
        <label className="grid gap-1.5 text-[0.9rem]">
          Confirm password
          <input
            className="w-full rounded border border-[#c9c0b2] bg-[#fffdf9] p-[0.7rem]"
            name="confirmPassword"
            type="password"
            minLength="8"
            required
            autoComplete="new-password"
          />
        </label>
        <button
          className="rounded bg-[#2d5548] px-4 py-[0.7rem] text-white enabled:cursor-pointer disabled:cursor-wait disabled:opacity-55"
          type="submit"
          disabled={submitting}
        >
          {submitting ? "Saving..." : "Set password"}
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
