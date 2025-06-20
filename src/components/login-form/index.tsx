"use client";

import { useState, useEffect } from "react";

import { FcGoogle } from "react-icons/fc";
import { FaGithub, FaFacebook } from "react-icons/fa";
import { signInWithOAuth } from "@/lib/api/auth";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setError(null);
  //   setLoading(true);

  //   try {
  //     const { error } = await signIn(email, password);

  //     if (error) throw error;

  //     router.push("/dashboard");
  //   } catch (err) {
  //     setError("Invalid email or password");
  //     console.error("Login error:", err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleOAuthLogin = async (
    provider: "google" | "github" | "facebook"
  ) => {
    setError(null);
    setOauthLoading(provider);

    try {
      const { error } = await signInWithOAuth(provider);
      if (error) throw error;
      // No need to redirect - OAuth will handle it
    } catch (err) {
      setError(`${provider} login failed`);
      console.error("OAuth error:", err);
      setOauthLoading(null);
    }
  };

  if (!isClient) {
    return null;
  }

  return (
    <div className="bg-[#121417] p-6 rounded-xl w-full max-w-md mx-auto">
      <h1 className="text-white text-2xl font-bold mb-6">Login to FitAI</h1>

      {error && (
        <div className="bg-red-900/30 border border-red-700 text-red-200 p-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* OAuth Options */}
      <div className="space-y-3 mb-6">
        <button
          type="button"
          onClick={() => handleOAuthLogin("google")}
          disabled={oauthLoading !== null}
          className="w-full bg-white text-gray-800 py-2 px-4 rounded flex items-center justify-center space-x-2 hover:bg-gray-100"
        >
          <FcGoogle className="text-xl" />
          <span>
            {oauthLoading === "google"
              ? "Connecting..."
              : "Continue with Google"}
          </span>
        </button>

        <button
          type="button"
          onClick={() => handleOAuthLogin("github")}
          disabled={oauthLoading !== null}
          className="w-full bg-gray-800 text-white py-2 px-4 rounded flex items-center justify-center space-x-2 hover:bg-gray-700 border border-gray-600"
        >
          <FaGithub className="text-xl" />
          <span>
            {oauthLoading === "github"
              ? "Connecting..."
              : "Continue with GitHub"}
          </span>
        </button>

        <button
          type="button"
          onClick={() => handleOAuthLogin("facebook")}
          disabled={oauthLoading !== null}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded flex items-center justify-center space-x-2 hover:bg-blue-700"
        >
          <FaFacebook className="text-xl" />
          <span>
            {oauthLoading === "facebook"
              ? "Connecting..."
              : "Continue with Facebook"}
          </span>
        </button>
      </div>

      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-700"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-[#121417] text-gray-500">
            Or continue with email
          </span>
        </div>
      </div>

      <form >
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-400 mb-2">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-gray-800 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="block text-gray-400 mb-2">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-gray-800 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading || oauthLoading !== null}
          className="w-full bg-[#0D69F2] hover:bg-blue-600 text-white py-2 rounded font-medium disabled:opacity-70"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <div className="mt-4 text-center text-gray-500">
        <p>
          {"Don't have an account?"}
          <a href="/signup" className="text-blue-400 hover:text-blue-300">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
