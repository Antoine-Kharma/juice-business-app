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

  const links = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Sales", href: "/sales" },
    { name: "Inventory", href: "/inventory" },
    { name: "Expenses", href: "/expenses" },
    { name: "Reports", href: "/reports" },
  ];

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        paddingTop: "24px",
        position: "sticky",
        top: 0,
        zIndex: 1000,
      }}
    >
      <nav
        style={{
          width: "92%",
          background: "#ECE9D8",
          borderRadius: "999px",
          padding: "14px 22px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0 10px 30px rgba(48,70,56,0.08)",
          backdropFilter: "blur(12px)",
        }}
      >
        <h1
          style={{
            margin: 0,
            color: "#304638",
            fontSize: "28px",
            fontWeight: 900,
            fontFamily: "Georgia, serif",
          }}
        >
          SPLASH Juice
        </h1>

    <div
      className="navbarLinks"
        style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
  }}
>
          {links.map((link) => {
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.name}
                href={link.href}
                style={{
                  textDecoration: "none",
                  background: isActive ? "#9ACB6B" : "transparent",
                  color: "#304638",
                  padding: "12px 22px",
                  borderRadius: "999px",
                  fontWeight: 700,
                  fontSize: "16px",
                  transition: "0.2s",
                  fontFamily: "Arial, sans-serif",
                }}
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        <button
          className="logoutButton"
            onClick={handleLogout}
          style={{
            border: "none",
            background: "#9ACB6B",
            color: "#304638",
            padding: "12px 28px",
            borderRadius: "999px",
            fontWeight: 800,
            fontSize: "16px",
            cursor: "pointer",
            fontFamily: "Arial, sans-serif",
          }}
        >
          Logout
        </button>
      </nav>
      <style>
  {`
    @media (max-width: 900px) {

      nav{
        width:95% !important;
        padding:18px !important;
        border-radius:32px !important;
        gap:18px;
        flex-direction:column;
      }

      .navbarLinks{
        width:100%;
        display:flex;
        flex-wrap:wrap;
        justify-content:center;
        gap:10px;
      }

      .navbarLinks a{
        padding:10px 18px !important;
        font-size:14px !important;
      }

      .logoutButton{
        width:100%;
        max-width:220px;
      }
    }

    @media (max-width: 550px){

      nav h1{
        font-size:24px !important;
      }

      .navbarLinks a{
        font-size:13px !important;
        padding:9px 15px !important;
      }
    }
  `}
</style>
    </div>
    
  );
} 