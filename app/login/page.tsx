"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    router.push("/dashboard");
  };

  return (
    <main
      style={{
        fontFamily: "Arial, sans-serif",
        minHeight: "100vh",
        background: "linear-gradient(180deg, #a3cf3a 0%, #f9fafb 75%)",
        padding: "70px 40px",
      }}
    >
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          alignItems: "center",
          gap: "50px",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <div>
          <p
            style={{
              color: "#009f3c",
              fontWeight: "bold",
              letterSpacing: "2px",
              marginBottom: "12px",
            }}
          >
            ADMIN ACCESS
          </p>

          <h1
            style={{
              fontSize: "56px",
              lineHeight: "1.05",
              margin: 0,
              color: "#101828",
              fontWeight: 900,
            }}
          >
            Fresh Juice <br /> Business Login
          </h1>

          <p
            style={{
              marginTop: "20px",
              fontSize: "18px",
              color: "#344054",
              maxWidth: "520px",
              lineHeight: "1.7",
            }}
          >
            Enter your account details to manage sales, inventory, expenses,
            and reports.
          </p>
        </div>

        <section
          style={{
            background: "rgba(255,255,255,0.8)",
            backdropFilter: "blur(16px)",
            padding: "34px",
            borderRadius: "28px",
            boxShadow: "0 24px 60px rgba(60,90,20,0.22)",
            width: "100%",
            maxWidth: "430px",
            marginLeft: "auto",
            border: "1px solid rgba(255,255,255,0.8)",
          }}
        >
          <h2 style={{ marginTop: 0, fontSize: "28px", color: "#101828" }}>
            Login
          </h2>

          <div style={{ display: "grid", gap: "18px" }}>
            <div>
              <label style={{ fontWeight: 700, color: "#101828" }}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
                style={{
                  width: "100%",
                  padding: "14px",
                  marginTop: "8px",
                  borderRadius: "14px",
                  border: "1px solid #d0d5dd",
                  outline: "none",
                }}
              />
            </div>

            <div>
              <label style={{ fontWeight: 700, color: "#101828" }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                style={{
                  width: "100%",
                  padding: "14px",
                  marginTop: "8px",
                  borderRadius: "14px",
                  border: "1px solid #d0d5dd",
                  outline: "none",
                }}
              />
            </div>

            <button
              onClick={handleLogin}
              style={{
                marginTop: "8px",
                padding: "14px",
                border: "none",
                borderRadius: "999px",
                backgroundColor: "#009f3c",
                color: "white",
                fontWeight: 800,
                fontSize: "16px",
                cursor: "pointer",
                boxShadow: "0 12px 24px rgba(0,159,60,0.28)",
              }}
            >
              Login
            </button>
          </div>
        </section>
      </section>
    </main>
  );
}