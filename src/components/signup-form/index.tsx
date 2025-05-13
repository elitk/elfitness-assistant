"use client";

import { useState, useEffect } from "react";
import { signUp, signInWithOAuth } from "@/lib/api/auth";
import { FcGoogle } from "react-icons/fc";
import { FaGithub, FaFacebook } from "react-icons/fa";

const SignUpForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { error } = await signUp(email, password, { name });

      if (error) throw error;

      setSuccess(true);

    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Sign up failed';
      setError(errorMessage);
      console.error("Signup error:", err);
    } finally {
      setLoading(false);
    }
  };

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
      setError(`${provider} signup failed`);
      console.error("OAuth error:", err);
      setOauthLoading(null);
    }
  };

  if (!isClient) {
    return null;
  }

  if (success) {
    return (
      <div className="bg-[#121417] p-6 rounded-xl w-full max-w-md mx-auto">
        <div className="text-center">
          <div className="mb-4 text-green-500 flex justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-white text-2xl font-bold mb-2">
            Account Created!
          </h2>
          <p className="text-gray-400 mb-6">Redirecting you to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#121417] p-6 rounded-xl w-full max-w-md mx-auto">
      <h1 className="text-white text-2xl font-bold mb-6">
        Create your FitAI Account
      </h1>

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
            Or sign up with email
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-400 mb-2">
            Full Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-gray-800 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

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
            minLength={6}
            required
          />
          <p className="text-gray-500 text-sm mt-1">
            Must be at least 6 characters
          </p>
        </div>

        <button
          type="submit"
          disabled={loading || oauthLoading !== null}
          className="w-full bg-[#0D69F2] hover:bg-blue-600 text-white py-2 rounded font-medium disabled:opacity-70"
        >
          {loading ? "Creating account..." : "Sign Up"}
        </button>
      </form>

      <div className="mt-4 text-center text-gray-500">
        <p>
          Already have an account?{" "}
          <a href="/login" className="text-blue-400 hover:text-blue-300">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignUpForm;
