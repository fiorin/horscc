"use client";

import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/hooks/useAuth";

export function UserNav() {
  const { user } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (!user) return null;

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm opacity-80">{user.email}</span>
      <button
        onClick={handleLogout}
        className="text-sm text-red-500 hover:underline"
      >
        Logout
      </button>
    </div>
  );
}
