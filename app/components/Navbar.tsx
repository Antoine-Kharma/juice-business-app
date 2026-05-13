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
        background: "linear-gradient(135deg,#84cc16,#a3e635)",
        padding: "22px 28px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderRadius: "0 0 28px 28px",
        boxShadow: "0 10px 30px rgba(120,160,20,0.25)",
        position: "sticky",
        top: 0,
        zIndex: 1000,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "14px",
        }}
      >
<div
  style={{
    width: "64px",
    height: "64px",
    borderRadius: "20px",
    overflow: "hidden",
    background: "rgba(255,255,255,0.12)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
  }}
>
  <Image
    src="/logo.png"
    alt="Splash Juice Logo"
    width={64}
    height={64}
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
              color: "white",
              fontSize: "32px",
              fontWeight: 900,
            }}
          >
            SPLASH Juice
          </h2>

          <p
            style={{
              margin: 0,
              color: "rgba(255,255,255,0.85)",
              fontSize: "14px",
            }}
          >
            Business Management System
          </p>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: "16px",
          alignItems: "center",
        }}
      >
        {links.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            style={{
              textDecoration: "none",
              color: "white",
              background: "rgba(0,0,0,0.18)",
              padding: "14px 24px",
              borderRadius: "18px",
              fontWeight: 700,
              backdropFilter: "blur(10px)",
              boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
              transition: "0.2s",
            }}
          >
            {link.name}
          </Link>
        ))}

        <button
          onClick={handleLogout}
          style={{
            border: "none",
            background: "rgb(185, 6, 6)",
            color: "white",
            padding: "14px 26px",
            borderRadius: "18px",
            fontWeight: 800,
            cursor: "pointer",
            boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}