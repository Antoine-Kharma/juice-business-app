import Link from "next/link";

const products = [
  "Orange Juice",
  "Lemonade",
  "Minted Lemonade",
  "Mango Juice",
  "Carrot Juice",
  "Pomegranate Juice",
];

const bottles = [
  "/bottles/orange.png",
  "/bottles/strawberry-banana.png",
  "/bottles/lemonade.png",
  "/bottles/carrot.png",
  "/bottles/strawberry-lemonade.png",
  "/bottles/mango.png",
  "/bottles/pomegranate.png",
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
            Real Fruit,
            <br />
            No Powder,
            <br />
            No Syrup.
            <br />
            Choose <span style={{ color: "#95c979" }}>SPLASH.</span>
          </h1>

          <p
            style={{
              marginTop: "22px",
              fontFamily: "Arial, sans-serif",
              fontSize: "15px",
              lineHeight: "1.8",
              color: "#44584a",
              maxWidth: "520px",
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
        </div>

        <div className="heroBottleArea">
          <h2 className="verticalText">Fresh Juice</h2>

          <div className="bottleSlider">
            {bottles.map((bottle, index) => (
              <img
                key={bottle}
                src={bottle}
                alt="SPLASH Juice Bottle"
                className="bottleImage"
                style={{ animationDelay: `${index * 3}s` }}
              />
            ))}
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

            <h2 style={{ fontSize: "40px", margin: 0, color: "#304638" }}>
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
                <div style={{ fontSize: "52px", marginBottom: "14px" }}>🥤</div>
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
          .heroBottleArea {
            position: relative;
            z-index: 2;
            display: flex;
            align-items: center;
            justify-content: center;
            padding-top: 80px;
          }

          .verticalText {
            position: absolute;
            right: -80px;
            top: 70px;
            writing-mode: vertical-rl;
            font-size: 86px;
            line-height: 1;
            color: transparent;
            -webkit-text-stroke: 1px rgba(48,70,56,0.25);
            font-weight: 900;
            margin: 0;
          }

          .bottleSlider {
            position: relative;
            width: 430px;
            height: 610px;
            animation: floatBottle 3s ease-in-out infinite;
          }

          .bottleImage {
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
            object-fit: contain;
            opacity: 0;
            filter: drop-shadow(0 35px 45px rgba(37,62,39,0.35));
            animation: bottleFade 21s infinite;
          }

          @keyframes bottleFade {
            0% { opacity: 0; transform: translateY(20px) scale(0.96); }
            5% { opacity: 1; transform: translateY(0) scale(1); }
            14% { opacity: 1; transform: translateY(0) scale(1); }
            19% { opacity: 0; transform: translateY(-20px) scale(0.96); }
            100% { opacity: 0; }
          }

          @keyframes floatBottle {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-18px);
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

            .bottleSlider {
              width: 310px;
              height: 470px;
            }

            .verticalText {
              display: none;
            }
          }
        `}
      </style>
    </main>
  );
}