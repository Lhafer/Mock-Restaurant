import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import { useAuthSession } from "./hooks/useAuthSession";
import LoginForm from "./components/LoginForm";
import MenuDashboard from "./components/MenuDashboard";
import SetPasswordForm from "./components/SetPasswordForm";

export default function AdminApp() {
  const { session, loading, error, setError } = useAuthSession();
  const [passwordSetupRequired, setPasswordSetupRequired] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function checkPasswordSetup() {
      if (!session) {
        setPasswordSetupRequired(false);
        return;
      }

      const { data, error: userError } = await supabase.auth.getUser();
      if (!cancelled && !userError) {
        setPasswordSetupRequired(
          data.user?.user_metadata?.password_setup_required === true,
        );
      }
    }

    checkPasswordSetup();
    return () => {
      cancelled = true;
    };
  }, [session]);

  if (loading && !session) {
    return (
      <main className="mx-auto w-[min(100%-2rem,960px)] py-12 pb-20">
        <p>Loading...</p>
      </main>
    );
  }
  if (!session) return <LoginForm error={error} onError={setError} />;

  if (passwordSetupRequired === null) {
    return (
      <main className="mx-auto w-[min(100%-2rem,960px)] py-12 pb-20">
        <p>Checking account...</p>
      </main>
    );
  }

  if (passwordSetupRequired) {
    return (
      <SetPasswordForm
        error={error}
        onComplete={() => window.location.reload()}
        onError={setError}
      />
    );
  }

  return (
    <MenuDashboard
      session={session}
      onSignOut={() => supabase.auth.signOut()}
      onError={setError}
      error={error}
    />
  );
}
