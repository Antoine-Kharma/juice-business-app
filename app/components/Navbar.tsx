"use client";

import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Navbar() {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const links = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Sales", href: "/sales" },
    { name: "Inventory", href: "/inventory" },
    { name: "Expenses", href: "/expenses" },
    { name: "Reports", href: "/reports" },
  ];

  return (
    <nav
      style={{
        background: "rgba(238, 239, 214, 0.85)",
        backdropFilter: "blur(16px)",
        padding: "16px 28px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderRadius: "0 0 34px 34px",
        boxShadow: "0 10px 30px rgba(47, 70, 56, 0.16)",
        position: "sticky",
        top: 0,
        zIndex: 1000,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
        <div
          style={{
            width: "58px",
            height: "58px",
            borderRadius: "50%",
            overflow: "hidden",
            background: "white",
            boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
          }}
        >
          <Image
            src="/logo.png"
            alt="Splash Juice Logo"
            width={58}
            height={58}
            style={{
              objectFit: "cover",
              width: "100%",
              height: "100%",
            }}
          />
        </div>

        <div>
          <h2
            style={{
              margin: 0,
              color: "#304638",
              fontSize: "30px",
              fontWeight: 900,
            }}
          >
            SPLASH Juice
          </h2>

          <p
            style={{
              margin: 0,
              color: "#435848",
              fontSize: "13px",
              fontFamily: "Arial, sans-serif",
            }}
          >
            Business Management System
          </p>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: "12px",
          alignItems: "center",
          background: "rgba(255,255,255,0.35)",
          padding: "6px",
          borderRadius: "999px",
        }}
      >
        {links.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            style={{
              textDecoration: "none",
              color: "#304638",
              background: "rgba(255,255,255,0.45)",
              padding: "12px 22px",
              borderRadius: "999px",
              fontWeight: 800,
              fontSize: "14px",
              fontFamily: "Arial, sans-serif",
            }}
          >
            {link.name}
          </Link>
        ))}

        <button
          onClick={handleLogout}
          style={{
            border: "none",
            background: "#304638",
            color: "white",
            padding: "12px 24px",
            borderRadius: "999px",
            fontWeight: 800,
            fontSize: "14px",
            cursor: "pointer",
            fontFamily: "Arial, sans-serif",
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}