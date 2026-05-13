import ProtectedPage from "../components/ProtectedPage";

const stats = [
  { title: "Today Sales", value: "$0" },
  { title: "Cups Sold", value: "0" },
  { title: "Low Stock Items", value: "0" },
  { title: "Best Seller", value: "-" },
];

export default function DashboardPage() {
  return (
    <ProtectedPage>
      <main
        style={{
          padding: "40px",
          fontFamily: "Arial, sans-serif",
          background: "linear-gradient(135deg, #9acd32 0%, #f7ffe8 100%)",
          minHeight: "100vh",
        }}
      >
        <section
          style={{
            minHeight: "260px",
            background:
              "linear-gradient(135deg, rgba(154,205,50,0.95), rgba(210,255,130,0.95))",
            borderRadius: "34px",
            padding: "42px",
            marginBottom: "30px",
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 24px 60px rgba(75,100,20,0.25)",
          }}
        >
          <p
            style={{
              margin: 0,
              color: "white",
              fontWeight: 800,
              letterSpacing: "2px",
              fontSize: "13px",
            }}
          >
            FRESH JUICE ADMIN
          </p>

          <h1
            style={{
              margin: "18px 0 0",
              color: "white",
              fontSize: "54px",
              lineHeight: "1",
              fontWeight: 900,
            }}
          >
            Business Dashboard
          </h1>

          <p
            style={{
              color: "rgba(255,255,255,0.9)",
              fontSize: "18px",
              maxWidth: "520px",
              lineHeight: "1.6",
            }}
          >
            Track sales, stock, best sellers, and daily business performance in
            one clean place.
          </p>

          <div
            style={{
              position: "absolute",
              right: "70px",
              top: "35px",
              width: "190px",
              height: "190px",
              borderRadius: "50%",
              background: "rgba(255,255,255,0.35)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "90px",
              boxShadow: "0 20px 50px rgba(0,0,0,0.12)",
            }}
          >
            🍋
          </div>
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "20px",
            marginBottom: "30px",
          }}
        >
          {stats.map((stat) => (
            <div
              key={stat.title}
              style={{
                background: "rgba(255,255,255,0.75)",
                backdropFilter: "blur(16px)",
                padding: "26px",
                borderRadius: "28px",
                boxShadow: "0 18px 40px rgba(75,100,20,0.14)",
                border: "1px solid rgba(255,255,255,0.7)",
              }}
            >
              <p
                style={{
                  margin: 0,
                  color: "#5f7f18",
                  fontSize: "14px",
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: "0.6px",
                }}
              >
                {stat.title}
              </p>

              <h2
                style={{
                  margin: "14px 0 0",
                  fontSize: "38px",
                  color: "#263500",
                  fontWeight: 900,
                }}
              >
                {stat.value}
              </h2>
            </div>
          ))}
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: "20px",
          }}
        >
          <div
            style={{
              background: "rgba(255,255,255,0.82)",
              backdropFilter: "blur(16px)",
              padding: "30px",
              borderRadius: "30px",
              boxShadow: "0 18px 40px rgba(75,100,20,0.14)",
              border: "1px solid rgba(255,255,255,0.8)",
            }}
          >
            <h2 style={{ marginTop: 0, color: "#263500" }}>Recent Activity</h2>
            <p style={{ color: "#64702e" }}>No sales recorded yet.</p>
          </div>

          <div
            style={{
              background: "rgba(38,53,0,0.92)",
              color: "white",
              padding: "30px",
              borderRadius: "30px",
              boxShadow: "0 18px 40px rgba(75,100,20,0.2)",
            }}
          >
            <h2 style={{ marginTop: 0 }}>Quick Notes</h2>

            <ul
              style={{
                lineHeight: "1.9",
                paddingLeft: "18px",
                color: "#eaffb6",
              }}
            >
              <li>Add first sale</li>
              <li>Add inventory items</li>
              <li>Set product prices</li>
            </ul>
          </div>
        </section>
      </main>
    </ProtectedPage>
  );
}