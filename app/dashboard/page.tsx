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
          background: "#111111",
          minHeight: "100vh",
        }}
      >
        <section
          style={{
            background: "#0b0b0b",
            color: "white",
            padding: "36px",
            borderRadius: "18px",
            marginBottom: "28px",
            borderBottom: "5px solid #dc2626",
            boxShadow: "0 12px 30px rgba(0,0,0,0.18)",
          }}
        >
          <p
            style={{
              margin: "0 0 10px",
              color: "#dc2626",
              fontWeight: 700,
              letterSpacing: "1.5px",
              fontSize: "13px",
            }}
          >
            ADMIN PANEL
          </p>

          <h1 style={{ margin: 0, fontSize: "40px" }}>Dashboard</h1>

          <p style={{ marginTop: "12px", color: "#d4d4d8", fontSize: "16px" }}>
            Business overview, sales activity, and stock status.
          </p>
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "18px",
            marginBottom: "28px",
          }}
        >
          {stats.map((stat) => (
            <div
              key={stat.title}
              style={{
                background: "#0b0b0b",
                padding: "24px",
                borderRadius: "16px",
                border: "1px solid #1f1f1f",
                borderTop: "4px solid #dc2626",
                boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
              }}
            >
              <p
                style={{
                  margin: 0,
                  color: "#a1a1aa",
                  fontSize: "14px",
                  fontWeight: 600,
                }}
              >
                {stat.title}
              </p>

              <h2
                style={{
                  margin: "12px 0 0",
                  fontSize: "32px",
                  color: "white",
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
            gap: "18px",
          }}
        >
          <div
            style={{
              background: "#0b0b0b",
              padding: "28px",
              borderRadius: "16px",
              border: "1px solid #1f1f1f",
              boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
            }}
          >
            <h2 style={{ marginTop: 0, color: "#0b0b0b" }}>
              Recent Activity
            </h2>
            <p style={{ color: "#a1a1aa" }}>No sales recorded yet.</p>
          </div>

          <div
            style={{
              background: "#0b0b0b",
              color: "white",
              padding: "28px",
              borderRadius: "16px",
              border: "1px solid #1f1f1f",
              borderTop: "5px solid #dc2626",
              boxShadow: "0 8px 20px rgba(0,0,0,0.16)",
            }}
          >
            <h2 style={{ marginTop: 0 }}>Quick Notes</h2>

            <ul
              style={{
                lineHeight: "1.9",
                paddingLeft: "18px",
                color: "#d4d4d8",
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