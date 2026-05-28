import Link from "next/link";

const products = [
  "Orange Juice",
  "Lemonade",
  "Minted Lemonade",
  "Mango Juice",
  "Carrot Juice",
  "Pomegranate Juice",
  "Strawberry Lemonade",
  "Strawberry Banana",
  "Straw Mango",
];

const bottles = [
  "/bottles/orange.png",
  "/bottles/lemonade.png",
  "/bottles/minted-lemonade.png",
  "/bottles/mango.png",
  "/bottles/carrot.png",
  "/bottles/pomegranate.png",
  "/bottles/strawberry-lemonade.png",
  "/bottles/strawberry-banana.png",
  "/bottles/straw-mango.png",
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
          className="heroSection"
          style={{
            minHeight: "620px",
            position: "relative",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
          }}
        >
        <div
          className="heroBackground"
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
            {["Home", "Products"].map((item, index) => (
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
          className="heroContent"
          style={{
            position: "relative",
            zIndex: 2,
            padding: "130px 40px 50px 48px",
            maxWidth: "620px",
          }}
        >
          <h1
            className="heroTitle"
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
            className="heroText"
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

          <div
            className="heroButtons"
            style={{ display: "flex", gap: "14px", marginTop: "32px" }}
          >
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
        className="productsSection"
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
            <h2
              className="productsTitle"
              style={{ fontSize: "40px", margin: 0, color: "#304638" }}
            >
              Featured Products
            </h2>
          </div>

          <div
            className="productsGrid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
              gap: "20px",
            }}
          >
            {products.map((product, index) => (
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
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  src={bottles[index]}
                  alt={product}
                  style={{
                    width: "100%",
                    maxWidth: "220px",
                    height: "260px",
                    objectFit: "contain",
                    display: "block",
                    margin: "0 auto 10px auto",
                  }}
                />

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
            padding-top: 40px;
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
            .heroSection {
              min-height: auto !important;
              height: auto !important;
              display: grid !important;
              grid-template-columns: 1fr 1fr !important;
            }

            .heroContent {
              padding: 95px 20px 35px 20px !important;
              max-width: 100% !important;
            }

            .heroTitle {
              font-size: 34px !important;
              line-height: 1.08 !important;
            }

            .heroText {
              font-size: 11px !important;
              line-height: 1.6 !important;
              max-width: 260px !important;
              margin-top: 16px !important;
            }

            .heroButtons {
              gap: 8px !important;
              margin-top: 20px !important;
              flex-wrap: wrap !important;
            }

            .heroButtons a {
              padding: 10px 14px !important;
              font-size: 11px !important;
            }

            .heroBottleArea {
              min-height: 430px !important;
              height: 430px !important;
              padding-top: 80px !important;
            }

            .bottleSlider {
              width: 210px !important;
              height: 310px !important;
            }

            .verticalText {
              display: none;
            }

            nav {
              width: 92% !important;
              height: 42px !important;
              padding: 0 10px !important;
            }

            nav div:first-child {
              font-size: 12px !important;
            }

            nav div:nth-child(2) {
              display: none !important;
            }

            nav a {
              font-size: 11px !important;
              padding: 8px 12px !important;
            }

            .productsSection {
              margin-top: 0 !important;
              padding: 34px 16px 44px !important;
              border-top-left-radius: 28px !important;
              border-top-right-radius: 28px !important;
            }

            .productsTitle {
              font-size: 28px !important;
            }

            .productsGrid {
              grid-template-columns: repeat(3, 1fr) !important;
              gap: 10px !important;
            }

            .productsGrid > div {
              padding: 14px 8px !important;
              border-radius: 18px !important;
            }

            .productsGrid img {
              max-width: 90px !important;
              height: 140px !important;
            }

            .productsGrid h3 {
              font-size: 11px !important;
            }

            .productsGrid p {
              font-size: 9px !important;
            }
          }

          @media (max-width: 430px) {
            .heroSection {
              grid-template-columns: 58% 42% !important;
            }

            .heroContent {
              padding-top: 90px !important;
              padding-right: 8px !important;
            }

            .heroTitle {
              font-size: 30px !important;
            }

            .heroText {
              font-size: 10px !important;
              max-width: 210px !important;
            }

            .heroBottleArea {
              height: 390px !important;
              min-height: 390px !important;
              padding-top: 105px !important;
            }

            .bottleSlider {
              width: 170px !important;
              height: 250px !important;
            }

            .productsSection {
              padding-top: 28px !important;
            }

            .productsGrid {
              grid-template-columns: repeat(3, 1fr) !important;
              gap: 8px !important;
            }

            .productsGrid img {
              max-width: 78px !important;
              height: 120px !important;
            }
          }
            @media (max-width: 850px) {
          .heroSection {
            min-height: 520px !important;
            height: 520px !important;
            grid-template-columns: 58% 42% !important;
          }

          .heroContent {
            padding: 85px 10px 20px 20px !important;
          }

          .heroTitle {
            font-size: 30px !important;
            line-height: 1.08 !important;
          }

          .heroText {
            font-size: 10px !important;
            line-height: 1.5 !important;
            max-width: 210px !important;
            margin-top: 14px !important;
          }

          .heroButtons {
            margin-top: 16px !important;
            gap: 7px !important;
          }

          .heroButtons a {
            padding: 9px 12px !important;
            font-size: 10px !important;
          }

          .heroBottleArea {
            height: 520px !important;
            min-height: 520px !important;
            padding-top: 120px !important;
          }

          .bottleSlider {
            width: 145px !important;
            height: 230px !important;
          }

          .productsSection {
            margin-top: 0 !important;
            padding-top: 24px !important;
          }

          .productsTitle {
            font-size: 26px !important;
          }
        }
        `}
      </style>
    </main>
  );
}