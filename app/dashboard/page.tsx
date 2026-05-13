import ProtectedPage from "../components/ProtectedPage";

const stats = [
  { title: "Today Sales", value: "$0", icon: "💵" },
  { title: "Cups Sold", value: "0", icon: "🥤" },
  { title: "Low Stock Items", value: "0", icon: "⚠️" },
  { title: "Best Seller", value: "-", icon: "🏆" },
];

export default function DashboardPage() {
  return (
    <ProtectedPage>
      <main
        style={{
          padding: "40px",
          fontFamily: "Arial, sans-serif",
          background:
            "linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)",
          minHeight: "100vh",
        }}
      >
        <section
          style={{
            background: "linear-gradient(135deg, #111827 0%, #000000 100%)",
            color: "white",
            padding: "34px",
            borderRadius: "24px",
            marginBottom: "28px",
            borderLeft: "6px solid #dc2626",
            boxShadow: "0 18px 40px rgba(0,0,0,0.18)",
          }}
        >
          <p
            style={{
              margin: "0 0 10px",
              color: "#fca5a5",
              fontWeight: 700,
              letterSpacing: "1px",
              fontSize: "13px",
            }}
          >
            ADMIN OVERVIEW
          </p>

          <h1 style={{ margin: 0, fontSize: "38px", letterSpacing: "-1px" }}>
            Dashboard
          </h1>

          <p style={{ marginTop: "12px", color: "#d1d5db", fontSize: "16px" }}>
            Monitor your sales, inventory, and daily business activity.
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
                background: "white",
                padding: "22px",
                borderRadius: "20px",
                boxShadow: "0 12px 28px rgba(15,23,42,0.08)",
                border: "1px solid #e5e7eb",
              }}
            >
              <div
                style={{
                  width: "46px",
                  height: "46px",
                  borderRadius: "14px",
                  background: "#fee2e2",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "22px",
                  marginBottom: "14px",
                }}
              >
                {stat.icon}
              </div>

              <p style={{ margin: 0, color: "#6b7280", fontSize: "14px" }}>
                {stat.title}
              </p>

              <h2
                style={{
                  margin: "8px 0 0",
                  fontSize: "30px",
                  color: "#111827",
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
              background: "white",
              padding: "26px",
              borderRadius: "22px",
              boxShadow: "0 12px 28px rgba(15,23,42,0.08)",
              border: "1px solid #e5e7eb",
            }}
          >
            <h2 style={{ marginTop: 0 }}>Recent Activity</h2>
            <p style={{ color: "#6b7280" }}>No sales recorded yet.</p>
          </div>

          <div
            style={{
              background: "#111827",
              color: "white",
              padding: "26px",
              borderRadius: "22px",
              boxShadow: "0 12px 28px rgba(15,23,42,0.15)",
              borderTop: "5px solid #dc2626",
            }}
          >
            <h2 style={{ marginTop: 0 }}>Quick Notes</h2>

            <ul style={{ lineHeight: "1.9", paddingLeft: "18px", color: "#d1d5db" }}>
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