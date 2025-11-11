"use client";

import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import type React from "react";
import { useState } from "react";

import { useAuth } from "@/hooks/useAuth";

import { Switch } from "@/components/ui/switch";

export default function LoginForm() {
  const { loginMutation } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await loginMutation.mutateAsync({ email, password });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Heading */}
      <div className="mb-8 justify-center text-center">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">
          Masuk ke Sistem Parkir
        </h1>
        <p className="text-[#8E8E93]">
          Kelola dan pantau data kendaraan Anda dengan mudah
        </p>
      </div>

      {/* Email Field */}
      <div className="space-y-2">
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="cindy@its.ac.id"
          className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
          required
        />
      </div>

      {/* Password Field */}
      <div className="space-y-2">
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700"
        >
          Kata Sandi
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Masukan Kata Sandi"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-10 transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>

      {/* Remember Me & Forgot Password */}
      <div className="flex items-center justify-between">
        <label className="flex cursor-pointer items-center gap-2">
          <Switch checked={rememberMe} onCheckedChange={setRememberMe} />
          <span className="text-sm text-gray-700">
            Ingat saya di perangkat ini
          </span>
        </label>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loginMutation.isPending}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-3 font-semibold text-white transition-all duration-200 hover:bg-blue-700 disabled:bg-blue-400"
      >
        {loginMutation.isPending ? (
          <>
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            Memproses...
          </>
        ) : (
          "Masuk"
        )}
      </button>

      {/* Sign Up Link */}
      <p className="text-center text-sm text-gray-600">
        Belum punya akun?{" "}
        <Link
          href="/auth/register"
          className="font-semibold text-blue-600 hover:text-blue-700"
        >
          Daftar di sini
        </Link>
      </p>
    </form>
  );
}
