"use client";

import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import type React from "react";
import { useState } from "react";

import { useAuth } from "@/hooks/useAuth";

export default function RegisterForm() {
  const { registerMutation } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    occupation: "mahasiswa",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrorMessage("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { email, name, password, confirmPassword, occupation } = formData;

    // Validasi password minimal 6 karakter
    if (password.length < 6) {
      setErrorMessage("Kata sandi harus memiliki minimal 6 karakter.");
      return;
    }

    // Validasi konfirmasi password
    if (password !== confirmPassword) {
      setErrorMessage("Kata sandi dan konfirmasi tidak cocok!");
      return;
    }

    await registerMutation.mutateAsync({ email, name, password, occupation });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Heading */}
      <div className="mb-8 justify-center text-center">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">
          Buat Akun Baru
        </h1>
        <p className="text-[#8E8E93]">
          Mulai kelola data kendaraan dengan akun Anda sendiri
        </p>
      </div>

      {/* Name + Role Field */}
      <div className="flex flex-row gap-4">
        {/* Nama */}
        <div className="flex-1 space-y-2">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Nama Lengkap
          </label>
          <input
            id="name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Masukan nama lengkap"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />
        </div>

        {/* Role */}
        <div className="w-1/3 space-y-2">
          <label
            htmlFor="occupation"
            className="block text-sm font-medium text-gray-700"
          >
            Daftar Sebagai
          </label>
          <select
            id="occupation"
            name="occupation"
            value={formData.occupation}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="tendik">Tendik</option>
            <option value="dosen">Dosen</option>
            <option value="mahasiswa">Mahasiswa</option>
          </select>
        </div>
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
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="nama@email.com"
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
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Minimal 6 karakter"
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

        {/* 🔹 Error Message (jika ada) */}
        {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}
      </div>

      {/* Confirm Password Field */}
      <div className="space-y-2">
        <label
          htmlFor="confirmPassword"
          className="block text-sm font-medium text-gray-700"
        >
          Konfirmasi Kata Sandi
        </label>
        <div className="relative">
          <input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Ulangi kata sandi"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-10 transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={registerMutation.isPending}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-3 font-semibold text-white transition-all duration-200 hover:bg-blue-700 disabled:bg-blue-400"
      >
        {registerMutation.isPending ? (
          <>
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            Memproses...
          </>
        ) : (
          "Daftar"
        )}
      </button>

      {/* Login Link */}
      <p className="text-center text-sm text-gray-600">
        Sudah punya akun?{" "}
        <Link
          href="/auth/login"
          className="font-semibold text-blue-600 hover:text-blue-700"
        >
          Masuk di sini
        </Link>
      </p>
    </form>
  );
}
