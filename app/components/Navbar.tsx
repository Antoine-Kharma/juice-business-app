"use client";

import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useRouter, usePathname } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const isLoginPage = pathname === "/login";

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "20px 40px",
        backgroundColor: "#f3f4f6",
        borderBottom: "1px solid #ddd",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <Link
        href="/dashboard"
        style={{
          textDecoration: "none",
          color: "black",
          fontSize: "24px",
          fontWeight: "bold",
        }}
      >
        Fresh Juice Business System
      </Link>

      {!isLoginPage && (
        <button
          onClick={handleLogout}
          style={{
            padding: "8px 14px",
            borderRadius: "8px",
            border: "none",
            backgroundColor: "black",
            color: "white",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      )}
    </nav>
  );
}