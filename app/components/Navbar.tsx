"use client";

import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <nav
      style={{
        display: "flex",
        gap: "20px",
        padding: "20px 40px",
        backgroundColor: "#f3f4f6",
        borderBottom: "1px solid #ddd",
        fontFamily: "Arial, sans-serif",
        alignItems: "center",
      }}
    >
      <Link href="/">Home</Link>

      <Link href="/dashboard">Dashboard</Link>

      <Link href="/sales">Sales</Link>

      <Link href="/inventory">Inventory</Link>

      <Link href="/expenses">Expenses</Link>

      <Link href="/reports">Reports</Link>

      <div style={{ marginLeft: "auto" }}>
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
      </div>
    </nav>
  );
}