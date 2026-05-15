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
        <nav className="loginNavbar">
          <h1 className="logoTitle">SPLASH Juice</h1>

          <button
            onClick={() => router.push("/")}
            className="homeButton"
          >
            Back Home
          </button>
        </nav>

        {/* Main Content */}
        <section className="loginContent">
          {/* Left Side */}
          <div>
            <h1 className="loginTitle">
              Welcome
              <br />
              Back To
              <br />
              <span style={{ color: "#9ccc73" }}>SPLASH.</span>
            </h1>

            <p className="loginText">
              Login to manage your fresh juice business, inventory, sales,
              expenses and reports with a clean and modern dashboard.
            </p>
          </div>

          {/* Login Card */}
          <div className="loginCard">
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
                <label className="inputLabel">Email</label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="loginInput"
                />
              </div>

              <div>
                <label className="inputLabel">Password</label>

                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="loginInput"
                />
              </div>

              <button
                onClick={handleLogin}
                className="loginButton"
              >
                Login
              </button>
            </div>
          </div>
        </section>
      </section>

      {/* RESPONSIVE STYLE */}
      <style>
        {`
          .loginNavbar{
            display:flex;
            justify-content:space-between;
            align-items:center;
            background:#ece9d7;
            padding:18px 28px;
            border-radius:50px;
            box-shadow:0 10px 30px rgba(0,0,0,0.08);
            max-width:1200px;
            margin:0 auto;
          }

          .logoTitle{
            margin:0;
            color:#2e4732;
            font-weight:bold;
            font-size:38px;
          }

          .homeButton{
            border:none;
            background:#9ccc73;
            color:#2e4732;
            padding:14px 28px;
            border-radius:999px;
            font-weight:bold;
            font-size:16px;
            cursor:pointer;
          }

          .loginContent{
            display:grid;
            grid-template-columns:1fr 1fr;
            align-items:center;
            gap:40px;
            max-width:1200px;
            margin:80px auto 0;
          }

          .loginTitle{
            font-size:78px;
            line-height:1;
            color:#2e4732;
            margin:0;
            font-weight:bold;
          }

          .loginText{
            margin-top:30px;
            font-size:22px;
            color:#435848;
            line-height:1.8;
            max-width:520px;
            font-family:Arial, sans-serif;
          }

          .loginCard{
            background:rgba(255,255,255,0.72);
            backdrop-filter:blur(14px);
            padding:45px;
            border-radius:35px;
            width:100%;
            max-width:460px;
            margin-left:auto;
            box-shadow:0 25px 60px rgba(0,0,0,0.12);
            border:1px solid rgba(255,255,255,0.7);
          }

          .inputLabel{
            display:block;
            margin-bottom:10px;
            color:#2e4732;
            font-weight:bold;
            font-family:Arial, sans-serif;
          }

          .loginInput{
            width:100%;
            padding:16px;
            border-radius:18px;
            border:1px solid #d6d6d6;
            font-size:16px;
            outline:none;
            background:rgba(255,255,255,0.85);
            box-sizing:border-box;
          }

          .loginButton{
            margin-top:10px;
            border:none;
            background:#2e4732;
            color:white;
            padding:18px;
            border-radius:999px;
            font-weight:bold;
            font-size:18px;
            cursor:pointer;
            transition:0.3s;
            box-shadow:0 12px 24px rgba(46,71,50,0.25);
          }

          @media (max-width: 850px){

            .loginContent{
              grid-template-columns:1fr;
              margin-top:45px;
            }

            .loginTitle{
              font-size:52px;
              text-align:center;
            }

            .loginText{
              font-size:18px;
              text-align:center;
              max-width:100%;
            }

            .loginCard{
              max-width:100%;
              margin-left:0;
              padding:28px;
            }

            .loginNavbar{
              padding:14px 18px;
            }

            .logoTitle{
              font-size:26px;
            }

            .homeButton{
              padding:12px 20px;
              font-size:14px;
            }

            main{
              padding:20px;
            }
          }

          @media (max-width: 550px){

            .loginNavbar{
              flex-direction:column;
              gap:14px;
              border-radius:30px;
            }

            .loginTitle{
              font-size:42px;
            }

            .loginCard{
              padding:22px;
            }

            .logoTitle{
              font-size:24px;
            }
          }
        `}
      </style>
    </main>
  );
}