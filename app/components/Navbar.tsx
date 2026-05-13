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
        zIndex: 100,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "18px 40px",
        background: "linear-gradient(90deg, #0f0f0f 0%, #1a1a1a 100%)",
        borderBottom: "3px solid #dc2626",
        boxShadow: "0 6px 24px rgba(0,0,0,0.25)",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <Link
        href="/dashboard"
        style={{
          textDecoration: "none",
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <div
          style={{
            width: "42px",
            height: "42px",
            borderRadius: "12px",
            background: "#dc2626",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontWeight: "bold",
            fontSize: "20px",
            boxShadow: "0 4px 14px rgba(220,38,38,0.45)",
          }}
        >
          🍊
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <span
            style={{
              color: "white",
              fontSize: "20px",
              fontWeight: 700,
              letterSpacing: "-0.3px",
            }}
          >
            Fresh Juice
          </span>

          <span
            style={{
              color: "#9ca3af",
              fontSize: "13px",
              marginTop: "2px",
            }}
          >
            Business Management System
          </span>
        </div>
      </Link>

      {!isLoginPage && (
        <button
          onClick={handleLogout}
          style={{
            padding: "10px 20px",
            borderRadius: "12px",
            border: "none",
            background: "#dc2626",
            color: "white",
            fontWeight: 600,
            fontSize: "14px",
            cursor: "pointer",
            transition: "0.2s ease",
            boxShadow: "0 6px 16px rgba(220,38,38,0.35)",
          }}
        >
          Logout
        </button>
      )}
    </nav>
  );
}