"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import LoginForm from "@/components/auth/login-form";
import RegisterForm from "@/components/auth/register-form";
import NextImage from "@/components/NextImage";

export default function AuthPage() {
  const router = useRouter();
  const pathname = usePathname();

  const [activeTab, setActiveTab] = useState<"login" | "register">("login");

  useEffect(() => {
    if (pathname.includes("register")) {
      setActiveTab("register");
    } else {
      setActiveTab("login");
    }
  }, [pathname]);

  const handleTabClick = (tab: "login" | "register") => {
    setActiveTab(tab);
    router.push(`/auth/${tab}`);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      {/* Left Side - Image */}
      <div className="hidden bg-cover bg-center md:flex md:w-1/2 lg:w-1/3">
        <NextImage
          src="/parkingLogin.png"
          alt="Login Illustration"
          width={1000}
          height={400}
          className="object-cover"
        />
      </div>

      {/* Right Side - Form */}
      <div className="flex flex-1 flex-col bg-linear-to-b from-blue-50 to-blue-100 p-8 md:p-12 lg:p-16">
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center">
          {/* Tabs */}
          <div className="mb-8 flex justify-center gap-2">
            <button
              onClick={() => handleTabClick("login")}
              className={`rounded-full px-6 py-2 font-medium transition-all hover:cursor-pointer ${
                activeTab === "login"
                  ? "bg-blue-600 text-white"
                  : "bg-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              Masuk
            </button>
            <button
              onClick={() => handleTabClick("register")}
              className={`rounded-full px-6 py-2 font-medium transition-all hover:cursor-pointer ${
                activeTab === "register"
                  ? "bg-blue-600 text-white"
                  : "bg-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              Daftar Akun
            </button>
          </div>

          {activeTab === "login" ? <LoginForm /> : <RegisterForm />}
        </div>
      </div>
    </div>
  );
}
