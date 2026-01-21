"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithOtp({ email });
    setLoading(false);

    if (error) {
      alert(error.message);
    } else {
      alert("Check your email for the magic link!");
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-20">
      <h1 className="text-3xl font-bold mb-6 text-center">Login</h1>

      <form
        onSubmit={handleLogin}
        className="border rounded-lg shadow-sm p-6 bg-white"
      >
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email Address
          </label>
          <input
            id="email"
            type="email"
            placeholder="your@email.com"
            className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white rounded py-2 font-semibold hover:bg-blue-700 disabled:opacity-70"
        >
          {loading ? "Sending link..." : "Send Magic Link"}
        </button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-4">
        You’ll receive a secure login link via email.
      </p>
    </div>
  );
}
