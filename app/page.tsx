import Link from "next/link";

const products = [
  "Orange Juice",
  "Lemonade",
  "Minted Lemonade",
  "Mango Juice",
  "Carrot Juice",
  "Pomegranate Juice",
];

export default function Home() {
  return (
    <main
      style={{
        fontFamily: "Georgia, 'Times New Roman', serif",
        minHeight: "100vh",
        background: "#eef0df",
        overflow: "hidden",
        color: "#304638",
      }}
    >
      <section
        style={{
          minHeight: "100vh",
          position: "relative",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 70% 50%, #b7d998 0%, #9fcf7b 28%, transparent 29%), linear-gradient(90deg, #f3f0dc 0%, #f3f0dc 58%, #9fca7e 58%, #9fca7e 100%)",
            zIndex: 0,
          }}
        />

        <nav
          style={{
            position: "absolute",
            top: "18px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "82%",
            height: "48px",
            background: "rgba(238, 239, 214, 0.8)",
            backdropFilter: "blur(16px)",
            borderRadius: "999px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 18px",
            boxShadow: "0 10px 30px rgba(47, 70, 56, 0.18)",
            zIndex: 5,
          }}
        >
          <div style={{ fontWeight: 900, fontSize: "20px" }}>
            SPLASH Juice
          </div>

          <div
            style={{
              display: "flex",
              gap: "10px",
              background: "rgba(255,255,255,0.35)",
              padding: "5px",
              borderRadius: "999px",
            }}
          >
            {["Home", "Products", "About", "Contact"].map((item, index) => (
              <a
                key={item}
                href={item === "Products" ? "#products" : "#"}
                style={{
                  textDecoration: "none",
                  color: "#304638",
                  fontSize: "13px",
                  padding: "9px 18px",
                  borderRadius: "999px",
                  background: index === 0 ? "#9cc77f" : "transparent",
                  fontWeight: 700,
                }}
              >
                {item}
              </a>
            ))}
          </div>

          <Link
            href="/login"
            style={{
              textDecoration: "none",
              color: "#304638",
              background: "rgba(255,255,255,0.55)",
              padding: "9px 18px",
              borderRadius: "999px",
              fontSize: "13px",
              fontWeight: 800,
            }}
          >
            Admin Login
          </Link>
        </nav>

        <div
          style={{
            position: "relative",
            zIndex: 2,
            padding: "160px 40px 80px 48px",
            maxWidth: "620px",
          }}
        >
          <h1
            style={{
              fontSize: "54px",
              lineHeight: "1.08",
              margin: 0,
              color: "#304638",
              fontWeight: 900,
            }}
          >
            Life Moves Fast.
            <br />
            Your Juice Should Too.
            <br />
            Choose{" "}
            <span style={{ color: "#95c979" }}>SPLASH.</span>
          </h1>

          <p
            style={{
              marginTop: "22px",
              fontFamily: "Arial, sans-serif",
              fontSize: "15px",
              lineHeight: "1.8",
              color: "#44584a",
              maxWidth: "520px",
              fontWeight: 600,
            }}
          >
            SPLASH Juice is fresh, simple, and natural. Enjoy clean fruit
            flavors made daily with premium ingredients and smooth packaging.
          </p>

          <div style={{ display: "flex", gap: "14px", marginTop: "32px" }}>
            <Link
              href="/login"
              style={{
                background: "#304638",
                color: "white",
                padding: "14px 24px",
                borderRadius: "999px",
                textDecoration: "none",
                fontFamily: "Arial, sans-serif",
                fontWeight: 800,
                fontSize: "14px",
                boxShadow: "0 12px 24px rgba(48,70,56,0.25)",
              }}
            >
              Admin Login
            </Link>

            <a
              href="#products"
              style={{
                background: "rgba(255,255,255,0.55)",
                color: "#304638",
                padding: "14px 24px",
                borderRadius: "999px",
                textDecoration: "none",
                fontFamily: "Arial, sans-serif",
                fontWeight: 800,
                fontSize: "14px",
                border: "1px solid rgba(48,70,56,0.2)",
              }}
            >
              View Products
            </a>
          </div>

          <div
            style={{
              marginTop: "86px",
              display: "flex",
              alignItems: "center",
              gap: "14px",
              fontFamily: "Arial, sans-serif",
            }}
          >
            <div style={{ display: "flex" }}>
              {["🍊", "🍋", "🥭"].map((emoji, index) => (
                <div
                  key={emoji}
                  style={{
                    width: "42px",
                    height: "42px",
                    borderRadius: "50%",
                    background: "white",
                    display: "grid",
                    placeItems: "center",
                    marginLeft: index === 0 ? 0 : "-12px",
                    border: "2px solid #eef0df",
                    boxShadow: "0 6px 14px rgba(0,0,0,0.12)",
                  }}
                >
                  {emoji}
                </div>
              ))}
            </div>

            <div>
              <strong style={{ fontSize: "14px" }}>Fresh Reviews</strong>
              <p style={{ margin: 0, fontSize: "12px", color: "#617266" }}>
                Customers are satisfied
              </p>
            </div>
          </div>
        </div>

        <div
          style={{
            position: "relative",
            zIndex: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            paddingTop: "80px",
          }}
        >
          <h2
            style={{
              position: "absolute",
              right: "-80px",
              top: "70px",
              writingMode: "vertical-rl",
              fontSize: "86px",
              lineHeight: 1,
              color: "transparent",
              WebkitTextStroke: "1px rgba(48,70,56,0.25)",
              fontWeight: 900,
              margin: 0,
            }}
          >
            Fresh Juice
          </h2>

          <div
            style={{
              width: "250px",
              height: "470px",
              borderRadius: "120px 120px 80px 80px",
              background:
                "linear-gradient(145deg, #d9efc9 0%, #8fbd6e 45%, #51784c 100%)",
              transform: "rotate(14deg)",
              boxShadow: "0 35px 70px rgba(37,62,39,0.35)",
              position: "relative",
              animation: "floatBottle 3s ease-in-out infinite",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "-42px",
                left: "78px",
                width: "94px",
                height: "70px",
                borderRadius: "18px 18px 8px 8px",
                background:
                  "repeating-linear-gradient(90deg, #f4f4ee 0 8px, #deded6 8px 14px)",
                boxShadow: "0 8px 18px rgba(0,0,0,0.15)",
              }}
            />

            <div
              style={{
                position: "absolute",
                top: "110px",
                left: "42px",
                width: "165px",
                height: "190px",
                borderRadius: "32px",
                background: "rgba(237,244,207,0.45)",
                display: "grid",
                placeItems: "center",
                color: "#304638",
                fontSize: "42px",
                fontWeight: 900,
              }}
            >
              🍊
            </div>

            <div
              style={{
                position: "absolute",
                right: "-34px",
                top: "130px",
                background: "#f5f2df",
                padding: "10px 12px",
                borderRadius: "12px",
                fontWeight: 900,
                fontSize: "22px",
                writingMode: "vertical-rl",
                color: "#304638",
                boxShadow: "0 10px 20px rgba(0,0,0,0.12)",
              }}
            >
              SPLASH
            </div>
          </div>
        </div>
      </section>

      <section
        id="products"
        style={{
          background: "#fffdf0",
          padding: "70px 40px",
          borderTopLeftRadius: "44px",
          borderTopRightRadius: "44px",
          position: "relative",
          zIndex: 4,
          marginTop: "-40px",
        }}
      >
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "36px" }}>
            <p
              style={{
                color: "#95c979",
                fontFamily: "Arial, sans-serif",
                fontWeight: 900,
                letterSpacing: "2px",
              }}
            >
              OUR MENU
            </p>

            <h2
              style={{
                fontSize: "40px",
                margin: 0,
                color: "#304638",
              }}
            >
              Featured Products
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "20px",
            }}
          >
            {products.map((product) => (
              <div
                key={product}
                style={{
                  padding: "26px",
                  borderRadius: "30px",
                  background: "#eef0df",
                  textAlign: "center",
                  boxShadow: "0 14px 30px rgba(48,70,56,0.1)",
                  border: "1px solid rgba(48,70,56,0.08)",
                  fontFamily: "Arial, sans-serif",
                }}
              >
                <div style={{ fontSize: "52px", marginBottom: "14px" }}>
                  🥤
                </div>

                <h3 style={{ margin: 0, color: "#304638" }}>{product}</h3>

                <p style={{ color: "#617266", fontSize: "14px" }}>
                  250ml / 1 Liter
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>
        {`
          @keyframes floatBottle {
            0%, 100% {
              transform: rotate(14deg) translateY(0);
            }
            50% {
              transform: rotate(14deg) translateY(-18px);
            }
          }

          @media (max-width: 850px) {
            section {
              grid-template-columns: 1fr !important;
            }

            nav {
              width: 92% !important;
            }

            nav div:nth-child(2) {
              display: none !important;
            }

            h1 {
              font-size: 42px !important;
            }
          }
        `}
      </style>
    </main>
  );
}