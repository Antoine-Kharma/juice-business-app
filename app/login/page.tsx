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
        fontFamily: "'Georgia', serif",
        minHeight: "100vh",
        background: "#f6f3e8",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Background Shape */}
      <div
        style={{
          position: "absolute",
          right: "-180px",
          top: "-80px",
          width: "700px",
          height: "700px",
          background: "#a8d57a",
          borderRadius: "50%",
          filter: "blur(2px)",
        }}
      />

      <section
        style={{
          position: "relative",
          zIndex: 2,
          padding: "30px 60px",
        }}
      >
        {/* Navbar */}
        <nav
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "#ece9d7",
            padding: "18px 28px",
            borderRadius: "50px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >
          <h1
            style={{
              margin: 0,
              color: "#2e4732",
              fontWeight: "bold",
              fontSize: "38px",
            }}
          >
            SPLASH Juice
          </h1>

          <button
            onClick={() => router.push("/")}
            style={{
              border: "none",
              background: "#9ccc73",
              color: "#2e4732",
              padding: "14px 28px",
              borderRadius: "999px",
              fontWeight: "bold",
              fontSize: "16px",
              cursor: "pointer",
            }}
          >
            Back Home
          </button>
        </nav>

        {/* Main Content */}
        <section
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            alignItems: "center",
            gap: "40px",
            maxWidth: "1200px",
            margin: "80px auto 0",
          }}
        >
          {/* Left Side */}
          <div>
            <h1
              style={{
                fontSize: "78px",
                lineHeight: "1",
                color: "#2e4732",
                margin: 0,
                fontWeight: "bold",
              }}
            >
              Welcome
              <br />
              Back To
              <br />
              <span style={{ color: "#9ccc73" }}>SPLASH.</span>
            </h1>

            <p
              style={{
                marginTop: "30px",
                fontSize: "22px",
                color: "#435848",
                lineHeight: "1.8",
                maxWidth: "520px",
                fontFamily: "Arial, sans-serif",
              }}
            >
              Login to manage your fresh juice business, inventory, sales,
              expenses and reports with a clean and modern dashboard.
            </p>
          </div>

          {/* Login Card */}
          <div
            style={{
              background: "rgba(255,255,255,0.72)",
              backdropFilter: "blur(14px)",
              padding: "45px",
              borderRadius: "35px",
              width: "100%",
              maxWidth: "460px",
              marginLeft: "auto",
              boxShadow: "0 25px 60px rgba(0,0,0,0.12)",
              border: "1px solid rgba(255,255,255,0.7)",
            }}
          >
            <h2
              style={{
                marginTop: 0,
                marginBottom: "30px",
                color: "#2e4732",
                fontSize: "42px",
              }}
            >
              Admin Login
            </h2>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "22px",
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "10px",
                    color: "#2e4732",
                    fontWeight: "bold",
                    fontFamily: "Arial, sans-serif",
                  }}
                >
                  Email
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  style={{
                    width: "100%",
                    padding: "16px",
                    borderRadius: "18px",
                    border: "1px solid #d6d6d6",
                    fontSize: "16px",
                    outline: "none",
                    background: "rgba(255,255,255,0.85)",
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "10px",
                    color: "#2e4732",
                    fontWeight: "bold",
                    fontFamily: "Arial, sans-serif",
                  }}
                >
                  Password
                </label>

                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  style={{
                    width: "100%",
                    padding: "16px",
                    borderRadius: "18px",
                    border: "1px solid #d6d6d6",
                    fontSize: "16px",
                    outline: "none",
                    background: "rgba(255,255,255,0.85)",
                  }}
                />
              </div>

              <button
                onClick={handleLogin}
                style={{
                  marginTop: "10px",
                  border: "none",
                  background: "#2e4732",
                  color: "white",
                  padding: "18px",
                  borderRadius: "999px",
                  fontWeight: "bold",
                  fontSize: "18px",
                  cursor: "pointer",
                  transition: "0.3s",
                  boxShadow: "0 12px 24px rgba(46,71,50,0.25)",
                }}
              >
                Login
              </button>
            </div>
          </div>
        </section>
      </section>
      <section className="loginContent">
        <h1 className="loginTitle">
          <section className="loginCard">
            <style>
  {`
    @media (max-width: 850px) {
      .loginContent {
        grid-template-columns: 1fr !important;
        margin-top: 45px !important;
      }

      .loginTitle {
        font-size: 48px !important;
      }

      .loginCard {
        max-width: 100% !important;
        margin-left: 0 !important;
        padding: 28px !important;
      }

      nav {
        padding: 14px 18px !important;
      }

      nav h1 {
        font-size: 26px !important;
      }

      main {
        padding: 20px !important;
      }
    }
  `}
</style>
          </section>
        </h1>
      </section>
    </main>
  );
}