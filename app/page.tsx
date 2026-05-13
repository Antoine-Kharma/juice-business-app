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
        fontFamily: "Arial, sans-serif",
        minHeight: "100vh",
        background: "linear-gradient(180deg, #a3cf3a 0%, #f9fafb 70%)",
      }}
    >
      <section
        style={{
          padding: "80px 40px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          alignItems: "center",
          gap: "40px",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <div>
          <p
            style={{
              color: "#dc2626",
              fontWeight: "bold",
              letterSpacing: "2px",
              marginBottom: "12px",
            }}
          >
          </p>

          <h1
            style={{
              fontSize: "56px",
              lineHeight: "1.05",
              margin: 0,
              color: "#111827",
              fontWeight: 800,
            }}
          >
            Fresh Juice <br /> Made Daily
          </h1>

          <p
            style={{
              marginTop: "20px",
              fontSize: "18px",
              color: "#374151",
              maxWidth: "520px",
              lineHeight: "1.7",
            }}
          >
            Pure fruit juices prepared with fresh ingredients, clean packaging,
            and natural flavors.
          </p>

          <div style={{ display: "flex", gap: "14px", marginTop: "30px" }}>
            <Link
              href="/login"
              style={{
                background: "#139c35",
                color: "white",
                padding: "14px 24px",
                borderRadius: "999px",
                textDecoration: "none",
                fontWeight: "bold",
                boxShadow: "0 10px 20px rgba(220,38,38,0.3)",
              }}
            >
              Admin Login
            </Link>

            <a
              href="#products"
              style={{
                background: "white",
                color: "#111827",
                padding: "14px 24px",
                borderRadius: "999px",
                textDecoration: "none",
                fontWeight: "bold",
                border: "1px solid #e5e7eb",
              }}
            >
              View Products
            </a>
          </div>
        </div>

        <div
          style={{
            background: "rgba(255,255,255,0.45)",
            borderRadius: "50%",
            padding: "40px",
            textAlign: "center",
            boxShadow: "0 20px 50px rgba(0,0,0,0.15)",
          }}
        >
          <div style={{ fontSize: "180px" }}>🍊</div>
        </div>
      </section>

      <section
        id="products"
        style={{
          background: "white",
          padding: "60px 40px",
          borderTopLeftRadius: "40px",
          borderTopRightRadius: "40px",
        }}
      >
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "36px" }}>
            <p style={{ color: "#139c35", fontWeight: "bold" }}>
              OUR MENU
            </p>

            <h2 style={{ fontSize: "36px", margin: 0 }}>
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
                  padding: "24px",
                  borderRadius: "24px",
                  background: "#f9fafb",
                  textAlign: "center",
                  boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
                  border: "1px solid #eee",
                }}
              >
                <div style={{ fontSize: "48px", marginBottom: "14px" }}>
                  🥤
                </div>

                <h3 style={{ margin: 0 }}>{product}</h3>

                <p style={{ color: "#6b7280", fontSize: "14px" }}>
                  250ml / 1 Liter
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}