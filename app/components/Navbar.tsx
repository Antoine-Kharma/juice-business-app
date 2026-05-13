"use client";

import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useRouter, usePathname } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const isLoginPage = pathname === "/login";

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "18px 40px",
        background: "rgba(255, 255, 255, 0.85)",
        backdropFilter: "blur(14px)",
        borderBottom: "1px solid rgba(0,0,0,0.08)",
        boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <Link
        href="/dashboard"
        style={{
          textDecoration: "none",
          color: "#111827",
          fontSize: "22px",
          fontWeight: 700,
          letterSpacing: "-0.5px",
        }}
      >
        🍊 Fresh Juice Business System
      </Link>

      {!isLoginPage && (
        <button
          onClick={handleLogout}
          style={{
            padding: "10px 18px",
            borderRadius: "999px",
            border: "1px solid #111827",
            backgroundColor: "#111827",
            color: "white",
            fontWeight: 600,
            cursor: "pointer",
            boxShadow: "0 6px 14px rgba(0,0,0,0.12)",
          }}
        >
          Logout
        </button>
      )}
    </nav>
  );
}